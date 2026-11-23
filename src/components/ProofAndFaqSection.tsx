import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { FAQ_ITEMS, STUDIO_TESTIMONIALS } from '../data/productData';

export function ProofAndFaqSection() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [studioImgFailed, setStudioImgFailed] = useState(false);

  return (
    <>
      {/* Section 03: Studio Listening Proof */}
      <section id="proof" className="max-w-[1200px] mx-auto px-6 py-20 sm:py-24">
        <div className="max-w-2xl mb-10">
          <p className="text-xs font-medium text-[#B45309] mb-2">
            03. Mastering Studio Proof
          </p>
          <h2
            className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-[#111316]"
            style={{ textWrap: 'balance' }}
          >
            Calibrated for archival transfer suites and reference listening rooms.
          </h2>
        </div>

        {/* 16:9 Architectural Studio Visual */}
        <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden border border-[#E3E2DC] bg-[#181A20] mb-10">
          {!studioImgFailed ? (
            <img
              src="/src/assets/images/studio_listening_room_1795440003044.jpg"
              alt="Minimalist acoustic mastering room with oak wall diffusers and Veld Audio reference turntable console"
              referrerPolicy="no-referrer"
              onError={() => setStudioImgFailed(true)}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#23262F] to-[#12141A] text-[#D4A85C] text-sm font-medium">
              Veld Audio Reference Mastering Suite
            </div>
          )}
        </div>

        {/* Attributable Mastering Engineer Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {STUDIO_TESTIMONIALS.map((item) => (
            <blockquote
              key={item.author}
              className="bg-white border border-[#E3E2DC] rounded-xl p-6 sm:p-8 flex flex-col justify-between"
            >
              <p className="text-sm sm:text-[15px] text-[#111316] leading-relaxed mb-6">
                “{item.quote}”
              </p>
              <footer className="pt-4 border-t border-[#ECECE6] flex flex-col gap-1">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <cite className="not-italic text-sm font-semibold text-[#111316]">
                    {item.author}
                  </cite>
                  <span className="text-xs font-mono tabular-nums text-[#B45309]">
                    {item.outcome}
                  </span>
                </div>
                <span className="text-xs text-[#52555A]">
                  {item.role} · {item.studio}
                </span>
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      {/* Section 04: Frequently Asked Questions (1:1 synced with FAQPage JSON-LD) */}
      <section id="faq" className="w-full bg-white border-t border-[#E3E2DC] py-20 sm:py-24">
        <div className="max-w-[900px] mx-auto px-6">
          <div className="mb-10">
            <p className="text-xs font-medium text-[#B45309] mb-2">
              04. Frequently Asked Questions
            </p>
            <h2 className="font-display text-3xl font-semibold tracking-tight text-[#111316]">
              Allocation, cartridge pairing, and acoustic calibration.
            </h2>
          </div>

          <div className="divide-y divide-[#E3E2DC] border-y border-[#E3E2DC]">
            {FAQ_ITEMS.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div key={faq.question}>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full py-5 flex items-center justify-between gap-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B45309] rounded-sm"
                  >
                    <span className="font-display text-base sm:text-lg font-medium text-[#111316]">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#52555A] shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : 'rotate-0'
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                  {isOpen && (
                    <div className="pb-5 pr-8 text-sm sm:text-[15px] text-[#52555A] leading-relaxed">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
