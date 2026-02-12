import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4 grid md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-xl font-bold mb-4">Besmak India</h3>
          <p className="text-gray-400">
            Leading manufacturer of high-quality industrial components.
          </p>
        </div>

        <div>
          <h4 className="font-bold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-gray-400">
            <li>
              <Link href="/products" className="hover:text-white">
                Products
              </Link>
            </li>
            <li>
              <Link href="/about-us" className="hover:text-white">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-white">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-4">Contact</h4>
          <ul className="space-y-2 text-gray-400">
            <li>info@besmakindia.com</li>
            <li>+91 123 456 7890</li>
            <li>Mumbai, India</li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-8 pt-8 border-t border-gray-800 text-center text-gray-500">
        <p>
          &copy; {new Date().getFullYear()} Besmak India. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
