import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-[#11110f]">
      <div className="flex h-16 w-16 items-center justify-center border border-white/15">
        <Loader2 className="h-6 w-6 animate-spin text-white" />
      </div>
      <span className="sr-only">Загрузка…</span>
    </div>
  );
}
