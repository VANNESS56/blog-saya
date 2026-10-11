import { Suspense } from "react";
import JualBeliClient from "./JualBeliClient";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0c0805] text-white flex items-center justify-center font-bold">Memuat...</div>}>
      <JualBeliClient />
    </Suspense>
  );
}
