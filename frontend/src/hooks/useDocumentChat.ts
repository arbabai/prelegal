"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChatMessage } from "@/types/chat";
import { ClientDocConfig, DocFields, GenericChatApiResponse } from "@/types/document";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

function mergeFields(prev: DocFields, patch: Record<string, string | null>): DocFields {
  const result = { ...prev };
  for (const [key, val] of Object.entries(patch)) {
    if (val != null && val !== "") result[key] = val;
  }
  return result;
}

function buildDefaultFields(config: ClientDocConfig): DocFields {
  return Object.fromEntries(config.fields.map((f) => [f.key, f.default ?? ""]));
}

export function useDocumentChat(config: ClientDocConfig) {
  const defaultFields = buildDefaultFields(config);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [fields, setFields] = useState<DocFields>(defaultFields);
  const [isLoading, setIsLoading] = useState(true);

  const messagesRef = useRef<ChatMessage[]>(messages);
  const fieldsRef = useRef<DocFields>(fields);
  const openingDone = useRef(false);

  useEffect(() => { messagesRef.current = messages; }, [messages]);
  useEffect(() => { fieldsRef.current = fields; }, [fields]);

  // Load the AI's opening message once on mount
  useEffect(() => {
    if (openingDone.current) return;
    openingDone.current = true;

    fetch(`${API_BASE}/api/chat/generic`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        documentType: config.slug,
        messages: [],
        currentFields: defaultFields,
      }),
    })
      .then((r) => r.json() as Promise<GenericChatApiResponse>)
      .then((data) => {
        setMessages([{ id: crypto.randomUUID(), role: "assistant", content: data.message }]);
        if (data.fields) setFields((prev) => mergeFields(prev, data.fields));
      })
      .catch(() => {
        setMessages([
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: `Hi! I'm here to help you create a ${config.name}. Let's get started — what are the names of the parties involved?`,
          },
        ]);
      })
      .finally(() => setIsLoading(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const sendMessage = useCallback(async (content: string) => {
    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: "user", content };
    const history = [...messagesRef.current, userMsg];

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/chat/generic`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentType: config.slug,
          messages: history.map((m) => ({ role: m.role, content: m.content })),
          currentFields: fieldsRef.current,
        }),
      });

      const data = (await res.json()) as GenericChatApiResponse;
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "assistant", content: data.message },
      ]);
      if (data.fields) setFields((prev) => mergeFields(prev, data.fields));
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
  }, [config.slug]); // eslint-disable-line react-hooks/exhaustive-deps

  const updateField = useCallback((key: string, value: string) => {
    setFields((prev) => ({ ...prev, [key]: value }));
  }, []);

  return { messages, fields, isLoading, sendMessage, updateField };
}
