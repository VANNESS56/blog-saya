import JualBeliClient from "./JualBeliClient";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

export default function Page() {
  return <JualBeliClient />;
}
