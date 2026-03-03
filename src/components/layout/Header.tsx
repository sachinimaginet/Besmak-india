import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";

import { getSetting } from "@/lib/settings";

export async function Header() {
  const logoUrl = await getSetting("logo_url", "/images/Besmak-Logo.png");

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image
            src={logoUrl}
            alt="Besmak Logo"
            width={320}
            height={120}
            className="h-20 w-auto object-contain"
            priority
          />
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <button className="text-gray-600 hover:text-primary font-medium flex items-center gap-1 group">
            Discover Us
            <svg
              className="w-4 h-4 transition-transform group-hover:rotate-180"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          <button className="text-gray-600 hover:text-primary font-medium flex items-center gap-1 group">
            Products
            <svg
              className="w-4 h-4 transition-transform group-hover:rotate-180"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          <button className="text-gray-600 hover:text-primary font-medium flex items-center gap-1 group">
            Infrastructure
            <svg
              className="w-4 h-4 transition-transform group-hover:rotate-180"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          <Link
            href="/events"
            className="text-gray-600 hover:text-primary font-medium"
          >
            Events
          </Link>

          <Link
            href="/csr"
            className="text-gray-600 hover:text-primary font-medium"
          >
            CSR
          </Link>

          <Link
            href="/contact"
            className="text-gray-600 hover:text-primary font-medium"
          >
            Contact Us
          </Link>

          <Link
            href="/e-catalog"
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 font-medium transition-colors shadow-sm"
          >
            e-Catalog
          </Link>
        </nav>

        <button className="md:hidden p-2 text-gray-600">
          <Menu className="h-6 w-6" />
        </button>
      </div>
    </header>
  );
}
