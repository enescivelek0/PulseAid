import { notFound } from 'next/navigation';
import { ActionView } from '@/components/ActionView';
import { CASE_IDS, getCase, getOption } from '@/lib/content';

export const dynamicParams = false;
export function generateStaticParams() {
  return CASE_IDS.flatMap((caseId) => Object.keys(getCase('tr', caseId)!.options).map((choice) => ({ caseId, choice })));
}

export default async function Page({ params }: { params: Promise<{ caseId: string; choice: string }> }) {
  const { caseId, choice } = await params;
  if (!getOption('tr', caseId, choice)) notFound();
  return <ActionView caseId={caseId} choice={choice} />;
}
