"use client";

import { useState, useRef } from "react";
import NDAForm from "@/components/NDAForm";
import NDADocument from "@/components/NDADocument";
import { NDAFormData } from "@/types/nda";

export default function Home() {
  const [formData, setFormData] = useState<NDAFormData | null>(null);
  const documentRef = useRef<HTMLDivElement>(null);

  function handleDownload() {
    window.print();
  }

  if (formData) {
    return (
      <div className="min-h-screen bg-white">
        {/* Toolbar — hidden when printing */}
        <div className="no-print sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setFormData(null)}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              ← Edit
            </button>
            <span className="text-gray-300">|</span>
            <span className="text-sm font-medium text-gray-800">
              Mutual Non-Disclosure Agreement
            </span>
          </div>
          <button
            onClick={handleDownload}
            className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Download PDF
          </button>
        </div>

        {/* Document */}
        <div className="max-w-3xl mx-auto px-6 py-10" ref={documentRef}>
          <NDADocument data={formData} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mutual NDA Creator</h1>
          <p className="text-gray-500 mt-2 text-sm">
            Fill in the details below to generate your Mutual Non-Disclosure Agreement.
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
          <NDAForm onSubmit={setFormData} />
        </div>
      </div>
    </div>
  );
}
