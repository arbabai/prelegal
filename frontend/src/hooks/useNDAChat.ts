"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChatApiResponse, ChatMessage, NDAFieldUpdate } from "@/types/chat";
import { NDAFormData } from "@/types/nda";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

function deepMerge(base: NDAFormData, patch: NDAFieldUpdate): NDAFormData {
  const result = { ...base };
  for (const key of Object.keys(patch) as Array<keyof NDAFieldUpdate>) {
    const val = patch[key];
    if (val == null) continue;
    if (key === "party1" || key === "party2") {
      // Filter out null sub-fields so they don't overwrite valid string values
      const filtered = Object.fromEntries(
        Object.entries(val as object).filter(([, v]) => v != null),
      );
      result[key] = { ...base[key], ...filtered };
    } else {
      (result as Record<string, unknown>)[key] = val;
    }
  }
  return result;
}

export function useNDAChat(initialData: NDAFormData) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [formData, setFormData] = useState<NDAFormData>(initialData);
  const [isLoading, setIsLoading] = useState(true);

  // Refs for use inside async callbacks to avoid stale closures
  const messagesRef = useRef<ChatMessage[]>(messages);
  const formDataRef = useRef<NDAFormData>(formData);
  const openingDone = useRef(false);

  useEffect(() => { messagesRef.current = messages; }, [messages]);
  useEffect(() => { formDataRef.current = formData; }, [formData]);

  // Load the AI's opening message once on mount
  useEffect(() => {
    if (openingDone.current) return;
    openingDone.current = true;

    fetch(`${API_BASE}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: [], currentFields: initialData }),
    })
      .then((r) => r.json() as Promise<ChatApiResponse>)
      .then((data) => {
        setMessages([{ id: crypto.randomUUID(), role: "assistant", content: data.message }]);
        if (data.fields) setFormData((prev) => deepMerge(prev, data.fields));
      })
      .catch(() => {
        setMessages([
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content:
              "Hi! I'm here to help you create a Mutual NDA. What's the purpose of this agreement?",
          },
        ]);
      })
      .finally(() => setIsLoading(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const sendMessage = useCallback(async (content: string) => {
    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: "user", content };
    // Read current messages from ref to avoid stale closure on concurrent sends
    const history = [...messagesRef.current, userMsg];

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history.map((m) => ({ role: m.role, content: m.content })),
          currentFields: formDataRef.current,
        }),
      });

      const data = (await res.json()) as ChatApiResponse;
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "assistant", content: data.message },
      ]);
      if (data.fields) setFormData((prev) => deepMerge(prev, data.fields));
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, []); // stable reference — reads live state via refs

  const updateField = useCallback((path: string, value: string) => {
    setFormData((prev) => {
      const next = { ...prev };
      if (path.startsWith("party1.")) {
        next.party1 = { ...prev.party1, [path.slice(7)]: value };
      } else if (path.startsWith("party2.")) {
        next.party2 = { ...prev.party2, [path.slice(7)]: value };
      } else {
        (next as Record<string, unknown>)[path] = value;
      }
      return next;
    });
  }, []);

  return { messages, formData, isLoading, sendMessage, updateField };
}
