import JualBeliClient from "./JualBeliClient";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string }>;
}) {
  const resolvedParams = await searchParams;
  return <JualBeliClient initialMode={resolvedParams?.mode} />;
}
