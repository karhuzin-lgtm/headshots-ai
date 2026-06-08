import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-[#faf8f5]">
      <Loader2 className="h-10 w-10 animate-spin text-[#c9a96e]" />
      <span className="sr-only">Загрузка…</span>
    </div>
  );
}
