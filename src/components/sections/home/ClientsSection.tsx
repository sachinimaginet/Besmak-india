"use client";

import Image from "next/image";

/* ── Types ─────────────────────────────────────────────────────── */

interface ClientLogo {
  id: string;
  src: string;   // image URL
  alt: string;   // company name / alt text
  href?: string; // optional link
}

interface ClientsSectionProps {
  content?: {
    title?: string;
    /** JSON string of ClientLogo[] so it works with the generic CMS editor */
    logos?: string;
    bgColor?: string;
  };
}

/* ── Default logos ──────────────────────────────────────────────── */

const DEFAULT_LOGOS: ClientLogo[] = [
  { id: "zf", src: "https://cvnvhpmvk12hdosq.public.blob.vercel-storage.com/0caeda75379e6d94fc370b49d13786101387a09f.png", alt: "ZF", href: "https://www.zf.com" },
  { id: "visteon", src: "https://cvnvhpmvk12hdosq.public.blob.vercel-storage.com/728ca0b425ca9efb8155972a1d09f875115de503.png", alt: "Visteon", href: "https://www.visteon.com" },
  { id: "napino", src: "https://cvnvhpmvk12hdosq.public.blob.vercel-storage.com/628434809ce02eaee5033a39870e4b4e2417f5d4.png", alt: "Napino", href: "https://www.napino.com" },
  { id: "motherson", src: "https://cvnvhpmvk12hdosq.public.blob.vercel-storage.com/628434809ce02eaee5033a39870e4b4e2417f5d4.png", alt: "Motherson", href: "https://www.motherson.com" },
  { id: "minda", src: "https://cvnvhpmvk12hdosq.public.blob.vercel-storage.com/628434809ce02eaee5033a39870e4b4e2417f5d4.png", alt: "Spark Minda", href: "https://www.sparkminda.com" },
  { id: "fme", src: "https://cvnvhpmvk12hdosq.public.blob.vercel-storage.com/79e64bd20614bf98312b9fb1ba0a61424a2fe91d.png", alt: "FME", href: "https://www.furukawa.co.jp" },
  { id: "kautex", src: "https://cvnvhpmvk12hdosq.public.blob.vercel-storage.com/8501ffaf7dddf6ec4c5b9359076ba86ac92575b6.png", alt: "Kautex", href: "https://www.kautex-textron.com" },
  { id: "aptiv", src: "https://cvnvhpmvk12hdosq.public.blob.vercel-storage.com/5a3a8de98f1fc61b4268e466744fba8061fb7ab5.png", alt: "Aptiv", href: "https://www.aptiv.com" },
];

/* ── Component ─────────────────────────────────────────────────── */

export default function ClientsSection({ content }: ClientsSectionProps) {
  const {
    title = "Our Clients",
    logos: logosJson,
    bgColor = "#f8fafc",
  } = content || {};

  /* Parse logos from JSON string (CMS stores arrays as JSON) */
  let logos: ClientLogo[] = DEFAULT_LOGOS;
  if (logosJson) {
    try {
      const parsed = JSON.parse(logosJson);
      if (Array.isArray(parsed) && parsed.length > 0) logos = parsed;
    } catch {
      /* ignore parse errors */
    }
  }

  /* Duplicate the list so the marquee loops seamlessly */
  const track = [...logos, ...logos];

  return (
    <section
      className="cs-section"
      style={{ background: bgColor }}
      aria-label="Our Clients"
    >
      <div className="container mx-auto px-4 max-w-7xl">
        {/* ── Heading ── */}
        <h2 className="cs-heading">{title}</h2>

        {/* ── Ticker ── */}
        <div className="cs-ticker" aria-hidden="true">
          <div className="cs-track">
            {track.map((logo, i) =>
              logo.href ? (
                <a
                  key={`${logo.id}-${i}`}
                  href={logo.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cs-logo-wrap"
                  tabIndex={-1}
                >
                  <Image
                    src={logo.src}
                    alt={logo.alt}
                    fill
                    className="cs-logo-img"
                    unoptimized
                  />
                </a>
              ) : (
                <span key={`${logo.id}-${i}`} className="cs-logo-wrap">
                  <Image
                    src={logo.src}
                    alt={logo.alt}
                    fill
                    className="cs-logo-img"
                    unoptimized
                  />
                </span>
              )
            )}
          </div>
        </div>
      </div>

      {/* ── Styles ── */}
      <style jsx>{`
        /* Section */
        .cs-section {
          padding: 3rem 0 2.5rem;
          overflow: hidden;
        }

        /* Heading */
        .cs-heading {
          text-align: center;
          font-size: 2.75rem;
          font-weight: 400;
          color: #111827;
          margin-bottom: 2rem;
          font-family: var(--font-heading), serif;
          letter-spacing: -0.01em;
        }

        /* Ticker viewport — masks overflow */
        .cs-ticker {
          position: relative;
          overflow: hidden;
          /* fade edges */
          mask-image: linear-gradient(
            to right,
            transparent 0%,
            black 8%,
            black 92%,
            transparent 100%
          );
          -webkit-mask-image: linear-gradient(
            to right,
            transparent 0%,
            black 8%,
            black 92%,
            transparent 100%
          );
        }

        /*
         * The track holds two copies of the logo list.
         * Animation:
         *   1. Scroll left the full width of ONE copy (translateX -50%) over 18s – smooth
         *   2. Jump instantly back to 0 (step timing at 100%) – snap reset
         */
        .cs-track {
          display: flex;
          align-items: center;
          gap: 3.5rem;
          padding: 0 2rem;
          width: max-content;
          animation: cs-marquee 18s linear infinite;
        }

        @keyframes cs-marquee {
          0%   { transform: translateX(0); }
          /* scroll forward */
          85%  { transform: translateX(-50%); }
          /* instant snap back */
          85.001% { transform: translateX(0); }
          100% { transform: translateX(0); }
        }

        /* Each logo slot */
        .cs-logo-wrap {
          position: relative;
          flex-shrink: 0;
          width: 9rem;
          height: 3.5rem;
          display: block;
          transition: transform 0.25s ease, filter 0.25s ease;
        }
        .cs-logo-wrap:hover {
          transform: scale(1.08);
          filter: grayscale(0%);
        }

        .cs-logo-img {
          object-fit: contain;
          object-position: center;
        }

        /* Pause on hover for accessibility */
        .cs-ticker:hover .cs-track {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
