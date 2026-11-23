interface FooterProps {
  onOpenSeoInspector: () => void;
}

export function Footer({ onOpenSeoInspector }: FooterProps) {
  return (
    <footer className="w-full bg-white border-t border-[#E3E2DC]">
      <div className="max-w-[1200px] mx-auto px-6 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <span className="font-display text-base font-bold text-[#111316]">Veld Audio</span>
          <p className="text-xs text-[#52555A] mt-1">
            © {new Date().getFullYear()} Veld Audio Atelier · Copenhagen &amp; Zurich ·{' '}
            <a
              href="mailto:atelier@veldaudio.example"
              className="hover:text-[#111316] underline underline-offset-2"
            >
              atelier@veldaudio.example
            </a>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-xs text-[#52555A]">
          <a href="#showcase" className="hover:text-[#111316] transition-colors">
            3D Stage
          </a>
          <a href="#engineering" className="hover:text-[#111316] transition-colors">
            Engineering
          </a>
          <a href="#specifications" className="hover:text-[#111316] transition-colors">
            Specifications
          </a>
          <a href="#faq" className="hover:text-[#111316] transition-colors">
            FAQ
          </a>
          <a href="/sitemap.xml" className="hover:text-[#111316] transition-colors">
            Sitemap
          </a>
          <button
            type="button"
            onClick={onOpenSeoInspector}
            className="font-medium text-[#B45309] hover:text-[#92400E] hover:underline underline-offset-4 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B45309] rounded-sm"
          >
            Schema.org &amp; SEO Audit
          </button>
        </div>
      </div>
    </footer>
  );
}
