import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";

export function Header() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          <Image
            src="/images/Besmak-Logo.png"
            alt="Logo"
            width={100}
            height={100}
          />
        </Link>

        <nav className="hidden md:flex items-center space-x-8">
          <Link
            href="/"
            className="text-gray-600 hover:text-blue-600 font-medium"
          >
            Home
          </Link>
          <Link
            href="/about-us"
            className="text-gray-600 hover:text-blue-600 font-medium"
          >
            About
          </Link>
          <Link
            href="/divisions"
            className="text-gray-600 hover:text-blue-600 font-medium"
          >
            Divisions
          </Link>
          <Link
            href="/products"
            className="text-gray-600 hover:text-blue-600 font-medium"
          >
            Products
          </Link>
          <Link
            href="/events"
            className="text-gray-600 hover:text-blue-600 font-medium"
          >
            Events
          </Link>
          <Link
            href="/contact"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium transition-colors"
          >
            Contact
          </Link>
        </nav>

        <button className="md:hidden p-2 text-gray-600">
          <Menu className="h-6 w-6" />
        </button>
      </div>
    </header>
  );
}
