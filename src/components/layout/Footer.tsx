import Link from "next/link";
import { Facebook, Linkedin, Twitter, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-white py-16">
      <div className="container mx-auto px-4">
        {/* Top Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16 max-w-5xl mx-auto">
          {/* Column 1: Verticals */}
          <div>
            <h4 className="text-sm font-bold tracking-widest uppercase mb-8">
              Verticals
            </h4>
            <ul className="space-y-4 text-sm font-light">
              <li>
                <Link
                  href="/verticals/connection-systems"
                  className="hover:text-blue-200 transition-colors"
                >
                  Connection Systems
                </Link>
              </li>
              <li>
                <Link
                  href="/verticals/engineering-products"
                  className="hover:text-blue-200 transition-colors"
                >
                  Engineering Products Division
                </Link>
              </li>
              <li>
                <Link
                  href="/verticals/precision-stamping"
                  className="hover:text-blue-200 transition-colors"
                >
                  Precision Stamping Manufacturing
                </Link>
              </li>
              <li>
                <Link
                  href="/verticals/cnh-moulds"
                  className="hover:text-blue-200 transition-colors"
                >
                  CNH Moulds
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Products */}
          <div>
            <h4 className="text-sm font-bold tracking-widest uppercase mb-8">
              Products
            </h4>
            <ul className="space-y-4 text-sm font-light">
              <li>
                <Link
                  href="/products/connectors"
                  className="hover:text-blue-200 transition-colors"
                >
                  Connectors
                </Link>
              </li>
              <li>
                <Link
                  href="/products/fuse-box"
                  className="hover:text-blue-200 transition-colors"
                >
                  Fuse Box
                </Link>
              </li>
              <li>
                <Link
                  href="/products/dummy-plugs"
                  className="hover:text-blue-200 transition-colors"
                >
                  Dummy Plugs
                </Link>
              </li>
              <li>
                <Link
                  href="/products/relay"
                  className="hover:text-blue-200 transition-colors"
                >
                  Relay
                </Link>
              </li>
              <li>
                <Link
                  href="/products/cases"
                  className="hover:text-blue-200 transition-colors"
                >
                  Cases
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: More Products */}
          <div className="pt-[52px]">
            {" "}
            {/* Align with the list items of other columns */}
            <ul className="space-y-4 text-sm font-light">
              <li>
                <Link
                  href="/products/cable-tuf"
                  className="hover:text-blue-200 transition-colors"
                >
                  Cable TUF
                </Link>
              </li>
              <li>
                <Link
                  href="/products/cover"
                  className="hover:text-blue-200 transition-colors"
                >
                  Cover
                </Link>
              </li>
              <li>
                <Link
                  href="/products/clips"
                  className="hover:text-blue-200 transition-colors"
                >
                  Clips
                </Link>
              </li>
              <li>
                <Link
                  href="/products/terminals"
                  className="hover:text-blue-200 transition-colors"
                >
                  Terminals
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Section */}
        <div className="text-center mb-16">
          <p className="text-sm font-light mb-6">Stay up-to-date</p>
          <div className="flex justify-center items-center space-x-8">
            <Link
              href="https://linkedin.com"
              target="_blank"
              className="hover:scale-110 transition-transform"
            >
              <Linkedin className="w-6 h-6 fill-white stroke-none" />
            </Link>
            <Link
              href="https://facebook.com"
              target="_blank"
              className="hover:scale-110 transition-transform"
            >
              <Facebook className="w-6 h-6 fill-white stroke-none" />
            </Link>
            <Link
              href="https://twitter.com"
              target="_blank"
              className="hover:scale-110 transition-transform"
            >
              <Twitter className="w-6 h-6 fill-white stroke-none" />
            </Link>
            <Link
              href="https://youtube.com"
              target="_blank"
              className="hover:scale-110 transition-transform"
            >
              <Youtube className="w-6 h-6 fill-white stroke-none" />
            </Link>
          </div>
        </div>

        {/* Bottom Bar Divider */}
        <div className="border-t border-white/10 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-xs font-light text-white/70 space-y-4 md:space-y-0">
            <p>&copy; 2026 Besmak India Pvt. Ltd. All rights reserved.</p>

            <p>
              Designed By{" "}
              <Link
                href="https://imaginetventures.com"
                target="_blank"
                className="underline hover:text-white transition-colors"
              >
                ImagiNET Ventures
              </Link>
            </p>

            <div className="flex space-x-6">
              <Link
                href="/terms"
                className="hover:text-white transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="/privacy"
                className="hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
