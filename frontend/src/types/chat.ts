export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export interface NDAFieldUpdate {
  purpose?: string;
  effectiveDate?: string;
  mndaTerm?: "expires" | "until_terminated";
  mndaTermYears?: string;
  confidentialityTerm?: "fixed" | "perpetual";
  confidentialityTermYears?: string;
  governingLaw?: string;
  jurisdiction?: string;
  modifications?: string;
  party1?: Partial<{ name: string; title: string; company: string; noticeAddress: string }>;
  party2?: Partial<{ name: string; title: string; company: string; noticeAddress: string }>;
}

export interface ChatApiResponse {
  message: string;
  fields: NDAFieldUpdate;
}
