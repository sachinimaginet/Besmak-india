import Link from "next/link";
import { Facebook, Linkedin, Twitter, Youtube, Phone, Mail } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#00469b] text-white py-12 font-sans">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Column 1: Verticals */}
          <div>
            <h4 className="text-[11px] font-bold tracking-[0.2em] uppercase mb-6 opacity-90 border-b border-white/10 pb-2 inline-block">
              Verticals
            </h4>
            <ul className="space-y-2.5 text-[13px] font-medium opacity-80">
              <li>
                <Link href="/verticals/connection-systems" className="hover:text-white transition-colors">
                  Connection Systems
                </Link>
              </li>
              <li>
                <Link href="/verticals/engineering-products" className="hover:text-white transition-colors">
                  Engineering Products Division
                </Link>
              </li>
              <li>
                <Link href="/verticals/precision-stamping" className="hover:text-white transition-colors">
                  Precision Stamping Manufacturing
                </Link>
              </li>
              <li>
                <Link href="/verticals/cnh-moulds" className="hover:text-white transition-colors">
                  CNH Moulds
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Products (Dual List) */}
          <div>
            <h4 className="text-[11px] font-bold tracking-[0.2em] uppercase mb-6 opacity-90 border-b border-white/10 pb-2 inline-block">
              Products
            </h4>
            <div className="grid grid-cols-2 gap-4 text-[13px] font-medium opacity-80">
              <ul className="space-y-2.5">
                <li><Link href="/products/connectors" className="hover:text-white transition-colors">Connectors</Link></li>
                <li><Link href="/products/fuse-box" className="hover:text-white transition-colors">Fuse Box</Link></li>
                <li><Link href="/products/dummy-plugs" className="hover:text-white transition-colors">Dummy Plugs</Link></li>
                <li><Link href="/products/relay" className="hover:text-white transition-colors">Relay</Link></li>
              </ul>
              <ul className="space-y-2.5">
                <li><Link href="/products/cable-tuf" className="hover:text-white transition-colors">Cable TUF</Link></li>
                <li><Link href="/products/cover" className="hover:text-white transition-colors">Cover</Link></li>
                <li><Link href="/products/clips" className="hover:text-white transition-colors">Clips</Link></li>
                <li><Link href="/products/terminals" className="hover:text-white transition-colors">Terminals</Link></li>
              </ul>
            </div>
          </div>

          {/* Column 3: Legal Information */}
          <div>
            <h4 className="text-[11px] font-bold tracking-[0.2em] uppercase mb-6 opacity-90 border-b border-white/10 pb-2 inline-block">
              Legal Information
            </h4>
            <ul className="space-y-2.5 text-[13px] font-medium opacity-80">
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms and Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h4 className="text-[11px] font-bold tracking-[0.2em] uppercase mb-6 opacity-90 border-b border-white/10 pb-2 inline-block">
              Contact
            </h4>
            <div className="space-y-4 text-[13px] font-medium opacity-80 leading-relaxed">
              <p>
                Besmak Components Pvt Ltd, Plot No. A-45, SIPCOT Industrial Growth Centre, Oragadam, Kanchipuram – 602118, Tamil Nadu, India.
              </p>
              <div className="flex items-center gap-2.5">
                <Phone className="w-3.5 h-3.5 fill-white stroke-none" />
                <a href="tel:+914467123333" className="hover:text-white transition-colors">+91 44 6712 3333</a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-3.5 h-3.5 fill-white stroke-none" />
                <a href="mailto:sales@besmakindia.com" className="hover:text-white transition-colors">sales@besmakindia.com</a>
              </div>
            </div>
          </div>
        </div>

        {/* Social Section */}
        <div className="flex flex-col items-center justify-center pt-6 border-t border-white/10">
          <p className="text-[10px] font-bold tracking-widest uppercase mb-4 opacity-50">Stay up-to-date</p>
          <div className="flex items-center gap-6">
            <Link href="https://linkedin.com" target="_blank" className="hover:scale-110 transition-transform">
              <Linkedin className="w-5 h-5 fill-white stroke-none" />
            </Link>
            <Link href="https://facebook.com" target="_blank" className="hover:scale-110 transition-transform">
              <Facebook className="w-5 h-5 fill-white stroke-none" />
            </Link>
            <Link href="https://twitter.com" target="_blank" className="hover:scale-110 transition-transform">
              <Twitter className="w-5 h-5 fill-white stroke-none" />
            </Link>
            <Link href="https://youtube.com" target="_blank" className="hover:scale-110 transition-transform">
              <Youtube className="w-5 h-5 fill-white stroke-none" />
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-12 pt-8 text-[11px] font-bold tracking-widest uppercase opacity-40">
          <p>© {currentYear} Besmak India Pvt. Ltd. All rights reserved.</p>
          <p>
            Designed By{" "}
            <Link href="https://imaginetventures.com" target="_blank" className="hover:text-white transition-colors">
              ImagiNET Ventures
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
