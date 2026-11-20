import { notFound } from 'next/navigation';
import { DecisionView } from '@/components/DecisionView';
import { CASE_IDS } from '@/lib/content';

export const dynamicParams = false;
export function generateStaticParams() {
  return CASE_IDS.map((caseId) => ({ caseId }));
}

export default async function Page({ params }: { params: Promise<{ caseId: string }> }) {
  const { caseId } = await params;
  if (!CASE_IDS.includes(caseId)) notFound();
  return <DecisionView caseId={caseId} />;
}
