import { useEffect, useMemo } from 'react';
import {
  FAQ_ITEMS,
  FINISH_VARIANTS,
  FinishPresetId,
  STUDIO_TESTIMONIALS,
} from '../data/productData';

export const OG_IMAGE_PATH = '/src/assets/images/og_turntable_showcase_1795440002578.jpg';

export function buildStructuredDataGraph(selectedFinish: FinishPresetId, canonicalUrl: string) {
  const activeVariant =
    FINISH_VARIANTS.find((variant) => variant.id === selectedFinish) ?? FINISH_VARIANTS[0];
  const baseOrigin = canonicalUrl.replace(/\/$/, '');
  const absoluteImageUrl = baseOrigin.startsWith('http')
    ? `${new URL(canonicalUrl).origin}${OG_IMAGE_PATH}`
    : OG_IMAGE_PATH;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${baseOrigin}#organization`,
        name: 'Veld Audio',
        url: canonicalUrl,
        email: 'atelier@veldaudio.example',
        description:
          'Precision analog audio engineering atelier building direct-drive reference turntables and titanium tonearms.',
      },
      {
        '@type': 'WebSite',
        '@id': `${baseOrigin}#website`,
        name: 'Veld Audio R1 3D Showcase',
        url: canonicalUrl,
        publisher: { '@id': `${baseOrigin}#organization` },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Showcase',
            item: canonicalUrl,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Veld Audio R1 Reference Turntable',
            item: `${canonicalUrl}#engineering`,
          },
        ],
      },
      {
        '@type': 'Product',
        '@id': `${baseOrigin}#product`,
        name: `Veld Audio R1 Reference Direct-Drive Turntable (${activeVariant.name})`,
        sku: activeVariant.sku,
        mpn: activeVariant.sku,
        category: 'Electronics > Audio > Audio Players & Recorders > Turntables',
        brand: {
          '@type': 'Brand',
          name: 'Veld Audio',
        },
        image: [absoluteImageUrl],
        description:
          '14.2 kg 5-axis CNC aerospace aluminum direct-drive turntable featuring a 6.4 kg C36000 solid brass flywheel platter, coreless optical PLL motor, and 12-inch Grade 5 titanium gimballed tonearm.',
        material: '6061-T6 Billet Aluminum, C36000 Brass, Grade 5 Titanium',
        weight: {
          '@type': 'QuantitativeValue',
          value: 14.2,
          unitCode: 'KGM',
        },
        additionalProperty: [
          {
            '@type': 'PropertyValue',
            name: 'Wow and Flutter',
            value: '0.018% WRMS',
          },
          {
            '@type': 'PropertyValue',
            name: 'Signal-to-Noise Ratio (Rumble)',
            value: '-86 dB',
          },
          {
            '@type': 'PropertyValue',
            name: 'Effective Tonearm Length',
            value: '305 mm (12 inch)',
          },
        ],
        offers: FINISH_VARIANTS.map((variant) => ({
          '@type': 'Offer',
          sku: variant.sku,
          name: `Veld Audio R1 — ${variant.name}`,
          price: String(variant.priceUsd),
          priceCurrency: 'USD',
          availability: 'https://schema.org/PreOrder',
          itemCondition: 'https://schema.org/NewCondition',
          url: `${canonicalUrl}#reserve`,
        })),
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.9',
          reviewCount: '28',
        },
        review: STUDIO_TESTIMONIALS.map((item) => ({
          '@type': 'Review',
          reviewRating: {
            '@type': 'Rating',
            ratingValue: '5',
            bestRating: '5',
          },
          author: {
            '@type': 'Person',
            name: item.author,
            jobTitle: item.role,
          },
          reviewBody: item.quote,
        })),
      },
      {
        '@type': 'FAQPage',
        mainEntity: FAQ_ITEMS.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      },
    ],
  };
}

export function useSeoMetadata(selectedFinish: FinishPresetId) {
  const canonicalUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}${window.location.pathname}`
      : 'https://veldaudio.example/';

  const structuredData = useMemo(
    () => buildStructuredDataGraph(selectedFinish, canonicalUrl),
    [selectedFinish, canonicalUrl],
  );

  const jsonLdString = useMemo(
    () => JSON.stringify(structuredData, null, 2),
    [structuredData],
  );

  useEffect(() => {
    if (typeof document === 'undefined') return;

    // Canonical link element
    let canonicalLink = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = canonicalUrl;

    // Dynamic og:url
    let ogUrlMeta = document.querySelector<HTMLMetaElement>('meta[property="og:url"]');
    if (!ogUrlMeta) {
      ogUrlMeta = document.createElement('meta');
      ogUrlMeta.setAttribute('property', 'og:url');
      document.head.appendChild(ogUrlMeta);
    }
    ogUrlMeta.content = canonicalUrl;

    // Live JSON-LD update
    let ldScript = document.getElementById('veld-structured-data') as HTMLScriptElement | null;
    if (!ldScript) {
      ldScript = document.createElement('script');
      ldScript.id = 'veld-structured-data';
      ldScript.type = 'application/ld+json';
      document.head.appendChild(ldScript);
    }
    ldScript.textContent = JSON.stringify(structuredData);
  }, [canonicalUrl, structuredData]);

  return {
    canonicalUrl,
    structuredData,
    jsonLdString,
  };
}
