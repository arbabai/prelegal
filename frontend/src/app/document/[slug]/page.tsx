import { DOC_CONFIGS } from "@/lib/docConfigs";
import DocumentCreatorClient from "./DocumentCreatorClient";

export function generateStaticParams() {
  return Object.keys(DOC_CONFIGS).map((slug) => ({ slug }));
}

export default async function DocumentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <DocumentCreatorClient slug={slug} />;
}
