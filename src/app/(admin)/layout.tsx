import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  MessageSquare,
  LogOut,
  Settings,
  Image as ImageIcon,
} from "lucide-react";
import { signOut } from "@/auth"; // Use server action or client side signOut?
// For server component layout, we need a client component for logout or form action.
// Let's make the sidebar a client component or use a form for logout.

import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md flex flex-col">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-gray-800">Besmak Admin</h1>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link
            href="/admin/dashboard"
            className="flex items-center p-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
          >
            <LayoutDashboard className="h-5 w-5 mr-3" />
            Dashboard
          </Link>
          <Link
            href="/admin/products"
            className="flex items-center p-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
          >
            <Package className="h-5 w-5 mr-3" />
            Products
          </Link>
          <Link
            href="/admin/enquiries"
            className="flex items-center p-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
          >
            <MessageSquare className="h-5 w-5 mr-3" />
            Enquiries
          </Link>
          <Link
            href="/admin/media"
            className="flex items-center p-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
          >
            <ImageIcon className="h-5 w-5 mr-3" />
            Media
          </Link>
          <Link
            href="/admin/settings"
            className="flex items-center p-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
          >
            <Settings className="h-5 w-5 mr-3" />
            Settings
          </Link>
        </nav>

        <div className="p-4 border-t">
          <form
            action={async () => {
              "use server";
              await signOut();
            }}
          >
            <button className="flex items-center w-full p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
              <LogOut className="h-5 w-5 mr-3" />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}
