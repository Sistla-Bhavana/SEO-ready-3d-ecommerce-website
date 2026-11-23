import { FormEvent, useState } from 'react';
import { Check } from 'lucide-react';
import { FINISH_VARIANTS, FinishPresetId } from '../data/productData';

interface ReservationSectionProps {
  selectedFinish: FinishPresetId;
  onSelectFinish: (finish: FinishPresetId) => void;
}

export function ReservationSection({
  selectedFinish,
  onSelectFinish,
}: ReservationSectionProps) {
  const [requestType, setRequestType] = useState<'allocation' | 'audition'>('allocation');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  const activeVariant =
    FINISH_VARIANTS.find((v) => v.id === selectedFinish) ?? FINISH_VARIANTS[0];

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();

    if (trimmedName.length < 2) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setErrorMsg(null);
    const code = `VR1-${activeVariant.sku.slice(-3)}-${String(
      Math.abs(trimmedEmail.length * 17 + trimmedName.length * 31) % 900 + 100,
    )}`;
    setSubmittedRef(code);
  };

  return (
    <section
      id="reserve"
      className="w-full bg-[#F7F7F5] border-t border-[#E3E2DC] py-20 sm:py-24"
    >
      <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-5">
          <p className="text-xs font-medium text-[#B45309] mb-2">
            05. Atelier Allocation &amp; Audition
          </p>
          <h2
            className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-[#111316] mb-4"
            style={{ textWrap: 'balance' }}
          >
            Reserve a serialized build or schedule a studio session.
          </h2>
          <p className="text-sm sm:text-[15px] text-[#52555A] leading-relaxed mb-6">
            Each Veld Audio R1 is machined to order in batches of 40 units and shipped in a custom flight case with its signed optical speed verification certificate.
          </p>

          <dl className="space-y-3 pt-5 border-t border-[#E3E2DC]">
            <div className="flex items-center justify-between text-sm">
              <dt className="text-[#52555A]">Selected Finish</dt>
              <dd className="font-medium text-[#111316]">{activeVariant.name}</dd>
            </div>
            <div className="flex items-center justify-between text-sm">
              <dt className="text-[#52555A]">Reference SKU</dt>
              <dd className="font-mono tabular-nums text-[#111316]">{activeVariant.sku}</dd>
            </div>
            <div className="flex items-center justify-between text-sm">
              <dt className="text-[#52555A]">Build Allocation Price</dt>
              <dd className="font-mono tabular-nums font-semibold text-[#111316]">
                ${activeVariant.priceUsd.toLocaleString()} USD
              </dd>
            </div>
          </dl>
        </div>

        <div className="lg:col-span-7 bg-white border border-[#E3E2DC] rounded-xl p-6 sm:p-8">
          {submittedRef ? (
            <div className="py-6">
              <div className="w-10 h-10 rounded-full bg-[#111316] text-white flex items-center justify-center mb-4">
                <Check className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="font-display text-2xl font-semibold text-[#111316] mb-2">
                {requestType === 'allocation'
                  ? 'Allocation request logged'
                  : 'Studio audition requested'}
              </h3>
              <p className="text-sm text-[#52555A] leading-relaxed mb-5">
                Thank you, {fullName}. Reference{' '}
                <span className="font-mono tabular-nums font-semibold text-[#111316]">
                  {submittedRef}
                </span>{' '}
                for the <span className="font-medium text-[#111316]">{activeVariant.name}</span>{' '}
                edition has been registered for{' '}
                <span className="font-medium text-[#111316]">{email}</span>.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSubmittedRef(null);
                  setFullName('');
                  setEmail('');
                  setCity('');
                }}
                className="px-4 py-2 text-xs font-semibold text-[#111316] border border-[#D4D2CA] hover:border-[#111316] rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B45309]"
              >
                Submit Another Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              {/* Inquiry Mode Toggle */}
              <div>
                <span className="block text-xs font-semibold text-[#52555A] mb-2">
                  Request Type
                </span>
                <div className="grid grid-cols-2 gap-2 p-1 bg-[#F3F2EE] border border-[#E3E2DC] rounded-lg">
                  <button
                    type="button"
                    onClick={() => setRequestType('allocation')}
                    className={`py-2 px-3 text-xs font-semibold rounded-md transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B45309] ${
                      requestType === 'allocation'
                        ? 'bg-white text-[#111316] shadow-xs'
                        : 'text-[#52555A] hover:text-[#111316]'
                    }`}
                  >
                    Reserve Build Slot
                  </button>
                  <button
                    type="button"
                    onClick={() => setRequestType('audition')}
                    className={`py-2 px-3 text-xs font-semibold rounded-md transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B45309] ${
                      requestType === 'audition'
                        ? 'bg-white text-[#111316] shadow-xs'
                        : 'text-[#52555A] hover:text-[#111316]'
                    }`}
                  >
                    Private Studio Audition
                  </button>
                </div>
              </div>

              {/* Finish Selector */}
              <div>
                <label
                  htmlFor="reserve-finish"
                  className="block text-xs font-semibold text-[#52555A] mb-1.5"
                >
                  Chassis Finish
                </label>
                <select
                  id="reserve-finish"
                  value={selectedFinish}
                  onChange={(e) => onSelectFinish(e.target.value as FinishPresetId)}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#D4D2CA] rounded-lg text-[#111316] focus:outline-none focus:border-[#B45309] focus:ring-1 focus:ring-[#B45309]"
                >
                  {FINISH_VARIANTS.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} ({v.sku}) — ${v.priceUsd.toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="reserve-name"
                    className="block text-xs font-semibold text-[#52555A] mb-1.5"
                  >
                    Full Name
                  </label>
                  <input
                    id="reserve-name"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Henrik Lindqvist"
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#D4D2CA] rounded-lg text-[#111316] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#B45309] focus:ring-1 focus:ring-[#B45309]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="reserve-email"
                    className="block text-xs font-semibold text-[#52555A] mb-1.5"
                  >
                    Email Address
                  </label>
                  <input
                    id="reserve-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="studio@example.com"
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#D4D2CA] rounded-lg text-[#111316] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#B45309] focus:ring-1 focus:ring-[#B45309]"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="reserve-city"
                  className="block text-xs font-semibold text-[#52555A] mb-1.5"
                >
                  {requestType === 'audition'
                    ? 'Preferred Listening Room (Copenhagen, Zurich, or Portland)'
                    : 'Shipping City / Studio Name (Optional)'}
                </label>
                <input
                  id="reserve-city"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder={
                    requestType === 'audition' ? 'Copenhagen Listening Room' : 'Zurich, Switzerland'
                  }
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#D4D2CA] rounded-lg text-[#111316] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#B45309] focus:ring-1 focus:ring-[#B45309]"
                />
              </div>

              {errorMsg && (
                <p role="alert" className="text-xs font-medium text-[#B91C1C]">
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 text-sm font-semibold text-white bg-[#111316] hover:bg-[#242830] rounded-lg transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B45309] focus-visible:ring-offset-2"
              >
                {requestType === 'allocation'
                  ? 'Request Build Allocation'
                  : 'Schedule Studio Audition'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
