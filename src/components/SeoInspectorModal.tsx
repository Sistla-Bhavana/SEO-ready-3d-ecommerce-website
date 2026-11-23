import { useState } from 'react';
import { Check, Copy, X } from 'lucide-react';
import { OG_IMAGE_PATH } from '../seo/useSeoMetadata';

interface SeoInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  canonicalUrl: string;
  jsonLdString: string;
}

export function SeoInspectorModal({
  isOpen,
  onClose,
  canonicalUrl,
  jsonLdString,
}: SeoInspectorModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const pageTitle =
    typeof document !== 'undefined'
      ? document.title
      : 'Veld Audio R1 – Reference Direct-Drive Turntable 3D Showcase';

  const metaDescription =
    typeof document !== 'undefined'
      ? document.querySelector('meta[name="description"]')?.getAttribute('content') ?? ''
      : '';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonLdString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="seo-modal-title"
    >
      <div className="bg-white border border-[#E3E2DC] rounded-xl max-w-3xl w-full max-h-[86vh] flex flex-col overflow-hidden shadow-2xl">
        <div className="px-6 py-4 border-b border-[#E3E2DC] flex items-center justify-between gap-4">
          <h2 id="seo-modal-title" className="font-display text-lg font-semibold text-[#111316]">
            SEO &amp; Schema.org Structured Data Inspector
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close SEO Inspector"
            className="p-1.5 text-[#52555A] hover:text-[#111316] rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B45309]"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          {/* Search Snippet & OpenGraph Preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-4 bg-[#F7F7F5] border border-[#E3E2DC] rounded-lg">
              <p className="text-xs font-semibold text-[#52555A] mb-2">
                Search Engine Result Snippet
              </p>
              <p className="text-xs text-[#15803D] truncate mb-1">{canonicalUrl}</p>
              <p className="text-base font-semibold text-[#1D4ED8] leading-snug mb-1">
                {pageTitle}
              </p>
              <p className="text-xs text-[#52555A] leading-relaxed">{metaDescription}</p>
              <p className="text-[11px] font-mono tabular-nums text-[#52555A] mt-3">
                Title: {pageTitle.length} chars · Desc: {metaDescription.length} chars
              </p>
            </div>

            <div className="bg-[#F7F7F5] border border-[#E3E2DC] rounded-lg overflow-hidden">
              <div className="aspect-[16/9] bg-[#181A20] overflow-hidden">
                <img
                  src={OG_IMAGE_PATH}
                  alt="OpenGraph preview card for Veld Audio R1"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3">
                <p className="text-[11px] text-[#52555A]">og:type=website · summary_large_image</p>
                <p className="text-xs font-semibold text-[#111316] truncate">{pageTitle}</p>
              </div>
            </div>
          </div>

          {/* Semantic DOM Structure */}
          <div className="p-4 bg-[#F7F7F5] border border-[#E3E2DC] rounded-lg">
            <p className="text-xs font-semibold text-[#52555A] mb-2">
              Semantic Document &amp; Crawl Readiness
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#111316]">
              <li>H1 → H2 → H3 strict single-root outline</li>
              <li>Canonical &amp; og:url dynamically resolved</li>
              <li>robots.txt &amp; sitemap.xml served at root</li>
              <li>All specs &amp; FAQs indexed in semantic DOM</li>
            </ul>
          </div>

          {/* Live Schema.org JSON-LD Graph */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-[#52555A]">
                Live Schema.org JSON-LD (@graph: Organization, WebSite, BreadcrumbList, Product, FAQPage)
              </p>
              <button
                type="button"
                onClick={handleCopy}
                className="px-3 py-1 text-xs font-medium text-[#111316] bg-[#F3F2EE] hover:bg-[#E7E6E0] rounded-md flex items-center gap-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B45309]"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#15803D]" aria-hidden="true" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Copy JSON-LD</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-4 bg-[#101216] text-[#E5E7EB] rounded-lg text-xs font-mono overflow-x-auto max-h-64 leading-relaxed">
              {jsonLdString}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
