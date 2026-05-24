import Link from "next/link";

export function TryFlowHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200/60 bg-[#faf8f5]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">
        <Link href="/" className="font-display text-xl font-semibold tracking-[-0.03em] text-[#111827]">
          Headshots
        </Link>
        <div className="flex items-center gap-4 sm:gap-6">
          <span className="hidden rounded-full border border-[#c9a96e]/30 bg-white/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#9a7b4f] sm:inline">
            Test flow
          </span>
          <Link href="/" className="text-sm font-medium text-gray-600 transition hover:text-gray-900">
            ← Home
          </Link>
        </div>
      </div>
    </header>
  );
}
