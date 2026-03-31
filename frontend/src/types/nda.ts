export interface Party {
  name: string;
  title: string;
  company: string;
  noticeAddress: string;
}

export type MndaTerm = "expires" | "until_terminated";
export type ConfidentialityTerm = "fixed" | "perpetual";

export interface NDAFormData {
  purpose: string;
  effectiveDate: string;
  mndaTerm: MndaTerm;
  mndaTermYears: string;
  confidentialityTerm: ConfidentialityTerm;
  confidentialityTermYears: string;
  governingLaw: string;
  jurisdiction: string;
  modifications: string;
  party1: Party;
  party2: Party;
}
