import Link from "next/link";
import { Menu } from "lucide-react";

export function Header() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          Besmak India
        </Link>

        <nav className="hidden md:flex space-x-8">
          <Link
            href="/"
            className="text-gray-600 hover:text-blue-600 font-medium"
          >
            Home
          </Link>
          <Link
            href="/products"
            className="text-gray-600 hover:text-blue-600 font-medium"
          >
            Products
          </Link>
          <Link
            href="/about-us"
            className="text-gray-600 hover:text-blue-600 font-medium"
          >
            About Us
          </Link>
          <Link
            href="/contact"
            className="text-gray-600 hover:text-blue-600 font-medium"
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
