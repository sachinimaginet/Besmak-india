import Link from "next/link";
import { Facebook, Linkedin, Twitter, Youtube } from "lucide-react";

interface FooterProps {
  settings?: Record<string, string>;
}

export function Footer({ settings }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const verticals = settings?.footer_verticals
    ? JSON.parse(settings.footer_verticals)
    : [
      { title: "Connection Systems", href: "/verticals/connection-systems" },
      {
        title: "Engineering Products Division",
        href: "/verticals/engineering-products",
      },
      {
        title: "Precision Stamping Manufacturing",
        href: "/verticals/precision-stamping",
      },
      { title: "CNH Moulds", href: "/verticals/cnh-moulds" },
    ];

  const products = settings?.footer_products
    ? JSON.parse(settings.footer_products)
    : [
      { title: "Connectors", href: "/products/connectors" },
      { title: "Fuse Box", href: "/products/fuse-box" },
      { title: "Dummy Plugs", href: "/products/dummy-plugs" },
      { title: "Relay", href: "/products/relay" },
      { title: "Cable TUF", href: "/products/cable-tuf" },
      { title: "Cover", href: "/products/cover" },
      { title: "Clips", href: "/products/clips" },
      { title: "Terminals", href: "/products/terminals" },
    ];

  const legal = settings?.footer_legal
    ? JSON.parse(settings.footer_legal)
    : [
      { title: "Terms and Service", href: "/terms" },
      { title: "Privacy Policy", href: "/privacy" },
    ];

  const socials = settings?.footer_socials
    ? JSON.parse(settings.footer_socials)
    : [
      { platform: "linkedin", url: "https://linkedin.com" },
      { platform: "facebook", url: "https://facebook.com" },
      { platform: "twitter", url: "https://twitter.com" },
      { platform: "youtube", url: "https://youtube.com" },
    ];

  const headingSize = settings?.footer_heading_size
    ? `${settings.footer_heading_size}px`
    : "11px";
  const fontFamily = settings?.footer_font_family || "Inter";
  const bgColor = settings?.footer_bg_color || "#00469b";

  const getSocialIcon = (platform: string) => {
    const iconClass =
      "w-5 h-5 fill-white stroke-none hover:opacity-100 transition-opacity opacity-90";
    switch (platform) {
      case "linkedin":
        return <Linkedin className={iconClass} />;
      case "facebook":
        return <Facebook className={iconClass} />;
      case "twitter":
        return (
          <svg viewBox="0 0 24 24" className={iconClass} aria-hidden="true">
            <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.292 19.49h2.039L6.486 3.24H4.298l13.311 17.403z" />
          </svg>
        );
      case "youtube":
        return (
          <svg viewBox="0 0 24 24" className={iconClass} aria-hidden="true">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <footer
      style={{ fontFamily, backgroundColor: bgColor }}
      className="text-white pt-12 pb-5"
    >
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Main Footer Grid */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-8 mb-12">
          {/* Column 1: Verticals */}
          <div>
            <h4
              style={{ fontSize: headingSize }}
              className="font-bold tracking-[0.2em] mb-6 pb-1"
            >
              Verticals
            </h4>
            <ul className="space-y-3 text-[14px] font-medium opacity-80 decoration-0">
              {verticals.map((link: any, idx: number) => (
                <li key={idx}>
                  <Link
                    href={link.href}
                    className="hover:opacity-100 transition-opacity"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2 & 3: Products (Dual List) */}
          <div className="lg:col-span-2 lg:pl-12">
            <h4
              style={{ fontSize: headingSize }}
              className="font-bold tracking-[0.2em] mb-6 pb-1"
            >
              Products
            </h4>
            <div className="grid grid-cols-2 gap-x-4 max-w-sm gap-y-3 text-[14px] font-medium opacity-80">
              <ul className="space-y-3">
                {products
                  .slice(0, Math.ceil(products.length / 2))
                  .map((link: any, idx: number) => (
                    <li key={idx}>
                      <Link
                        href={link.href}
                        className="hover:opacity-100 transition-opacity"
                      >
                        {link.title}
                      </Link>
                    </li>
                  ))}
              </ul>
              <ul className="space-y-3">
                {products
                  .slice(Math.ceil(products.length / 2))
                  .map((link: any, idx: number) => (
                    <li key={idx}>
                      <Link
                        href={link.href}
                        className="hover:opacity-100 transition-opacity"
                      >
                        {link.title}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          </div>

          {/* Column 4: Legal Information */}
          <div>
            <h4
              style={{ fontSize: headingSize }}
              className="font-bold tracking-[0.2em] mb-6 pb-1"
            >
              Legal Information
            </h4>
            <ul className="space-y-3 text-[14px] font-medium opacity-80">
              {legal.map((link: any, idx: number) => (
                <li key={idx}>
                  <Link
                    href={link.href}
                    className="hover:opacity-100 transition-opacity"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social Section */}
        <div className="flex flex-col items-center justify-center mb-5">
          <p className="text-[13px] font-bold tracking-widest mb-4 opacity-90">
            Stay up-to-date
          </p>
          <div className="flex items-center gap-6">
            {socials.map((social: any, idx: number) => (
              <Link
                key={idx}
                href={social.url}
                target="_blank"
                className="hover:scale-110 transition-transform"
              >
                {getSocialIcon(social.platform)}
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-6 border-t border-white/10 text-[11px] font-bold tracking-widest opacity-60">
          <p>© {currentYear} Besmak India Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Designed By</span>
            <Link
              href="https://imaginetventures.com"
              target="_blank"
              className="hover:opacity-100 transition-opacity hover:underline"
            >
              ImagiNET Ventures
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
