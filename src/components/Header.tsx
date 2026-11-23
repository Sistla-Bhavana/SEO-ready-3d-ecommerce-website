export function Header() {
  return (
    <header className="w-full bg-[#F7F7F5] border-b border-[#E3E2DC]">
      <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#showcase"
          className="font-display text-lg font-bold tracking-tight text-[#111316] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B45309] rounded-sm"
        >
          Veld Audio
        </a>

        {/* Zone 2: 4 concise single-line navigation links */}
        <nav aria-label="Primary Navigation" className="hidden md:flex items-center gap-8 text-sm font-medium text-[#52555A]">
          <a
            href="#showcase"
            className="hover:text-[#111316] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B45309] rounded-sm"
          >
            Showcase
          </a>
          <a
            href="#engineering"
            className="hover:text-[#111316] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B45309] rounded-sm"
          >
            Engineering
          </a>
          <a
            href="#specifications"
            className="hover:text-[#111316] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B45309] rounded-sm"
          >
            Specifications
          </a>
          <a
            href="#faq"
            className="hover:text-[#111316] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B45309] rounded-sm"
          >
            FAQ
          </a>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center shrink-0">
          <a
            href="#reserve"
            className="px-4 py-2 text-xs font-semibold text-white bg-[#111316] hover:bg-[#242830] rounded-lg transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B45309] focus-visible:ring-offset-2"
          >
            Reserve R1
          </a>
        </div>
      </div>
    </header>
  );
}
