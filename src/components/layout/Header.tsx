"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";

// The official menu structure for Besmak-india
const menu = [
  {
    title: "Discover Us",
    child: [
      { name: "At a glance", href: "/about-us/at-a-glance" },
      { name: "Our values & governance", href: "/about-us/values-governance" },
      { name: "Partnerships", href: "/about-us/partnerships" },
    ],
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop",
    tagline: "Building a legacy of precision and trust."
  },
  {
    title: "Products",
    child: [
      { name: "Connectors", href: "/products/connectors" },
      { name: "Engineering products", href: "/products/engineering-products" },
    ],
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop",
    tagline: "Quality components for global industries."
  },
  {
    title: "Infrastructure",
    child: [
      { name: "Tool room", href: "/infrastructure/tool-room" },
      { name: "Automation & technology", href: "/infrastructure/automation-technology" },
    ],
    image: "https://images.unsplash.com/photo-1504917595217-d4dc5fee1227?q=80&w=800&auto=format&fit=crop",
    tagline: "Cutting-edge technology at our core."
  },
  { title: "Events", href: "/events" },
  { title: "CSR", href: "/csr" },
  { title: "Contact Us", href: "/contact" },
];

const Header = () => {
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const navRef = useRef<HTMLDivElement>(null);

  const logoUrl = "/images/Besmak-Logo.png";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setExpandedMenu(null);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMenu = (title: string) => {
    setExpandedMenu((prev) => (prev === title ? null : title));
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 bg-white border-b border-gray-100 overflow-hidden ${expandedMenu ? "max-h-[600px] shadow-2xl" : scrolled ? "max-h-16 shadow-md" : "max-h-20"
        }`}
    >
      <div className="container mx-auto px-4 h-full flex flex-col">
        {/* Top Header Bar */}
        <div className={`flex items-center justify-between transition-all duration-300 ${scrolled || expandedMenu ? "h-16" : "h-20"
          }`}>
          <Link href="/" className="flex items-center group">
            <Image
              src={logoUrl}
              alt="Besmak Logo"
              width={320}
              height={120}
              className={`transition-all duration-500 object-contain ${scrolled || expandedMenu ? "h-10" : "h-14"
                } w-auto group-hover:scale-105`}
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav ref={navRef} className="hidden lg:flex items-center space-x-1">
            {menu.map((item) => (
              <div key={item.title} className="relative h-full flex items-center px-1">
                {item.child ? (
                  <button
                    onClick={() => toggleMenu(item.title)}
                    className={`flex items-center gap-1.5 font-bold text-sm tracking-tight transition-all px-4 py-2.5 rounded-full ${expandedMenu === item.title
                      ? "text-primary bg-primary/5"
                      : "text-gray-600 hover:text-primary hover:bg-gray-50"
                      }`}
                  >
                    {item.title}
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-500 ${expandedMenu === item.title ? "rotate-180" : ""
                        }`}
                    />
                  </button>
                ) : (
                  <Link
                    href={item.href || "#"}
                    className={`font-bold text-sm tracking-tight transition-all px-4 py-2.5 rounded-full ${pathname === item.href
                      ? "text-primary bg-primary/5"
                      : "text-gray-600 hover:text-primary hover:bg-gray-50"
                      }`}
                  >
                    {item.title}
                  </Link>
                )}
              </div>
            ))}

            <Link
              href="/e-catalog"
              className="px-6 py-2.5 bg-primary text-white rounded-full hover:bg-primary/90 font-black text-sm uppercase tracking-wider transition-all shadow-lg hover:shadow-primary/20 active:scale-95 ml-4"
            >
              e-Catalog
            </Link>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2 text-gray-700 hover:text-primary transition-all rounded-full hover:bg-gray-50"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Inline Mega Menu Expansion */}
        {expandedMenu && (
          <div className="hidden lg:block w-full border-t border-gray-50 py-10 animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="flex gap-16 items-start max-w-6xl mx-auto">
              {/* Left Pane: Submenu Links */}
              <div className="flex-1">
                <div className="grid grid-cols-1 gap-1">
                  {menu.find(m => m.title === expandedMenu)?.child?.map((subItem, idx) => (
                    <Link
                      key={subItem.name}
                      href={subItem.href}
                      onClick={() => setExpandedMenu(null)}
                      className="group/item flex items-center justify-between px-6 py-4 rounded-2xl transition-all duration-300 hover:bg-primary/5"
                      style={{
                        animationDelay: `${idx * 40}ms`,
                        animation: "slideInLeft 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
                        opacity: 0,
                      }}
                    >
                      <span className="text-xl font-black text-gray-800 group-hover/item:text-primary transition-colors tracking-tight">
                        {subItem.name}
                      </span>
                      <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center opacity-0 -translate-x-4 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all duration-300">
                        <span className="text-primary font-bold">→</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Right Pane: Featured Image & Content */}
              {(() => {
                const activeMenu = menu.find(m => m.title === expandedMenu);
                if (!activeMenu) return null;
                return (
                  <div className="w-[440px] shrink-0 animate-in fade-in zoom-in-95 duration-1000">
                    <div className="relative group/img overflow-hidden rounded-[2rem] aspect-[1.4/1] shadow-2xl border-[6px] border-white">
                      <Image
                        src={activeMenu.image || ""}
                        alt={activeMenu.title}
                        fill
                        className="object-cover transition-transform duration-1000 group-hover/img:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute bottom-6 left-6 right-6">
                        <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black text-white uppercase tracking-[0.2em] mb-3">
                          Featured
                        </span>
                        <h3 className="text-white font-black text-2xl leading-none uppercase tracking-tighter">
                          {activeMenu.title}
                        </h3>
                      </div>
                    </div>
                    <div className="mt-6 flex items-start gap-3">
                      <div className="w-1 h-12 bg-primary/20 rounded-full shrink-0" />
                      <p className="text-gray-500 font-bold leading-relaxed italic text-lg opacity-80">
                        "{activeMenu.tagline}"
                      </p>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Navigation Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 top-0 z-[60] bg-white lg:hidden overflow-y-auto animate-in slide-in-from-bottom duration-500">
          <div className="flex flex-col h-full bg-white">
            <div className="p-4 flex items-center justify-between border-b border-gray-50">
              <Image src={logoUrl} alt="Logo" width={120} height={40} className="h-8 w-auto object-contain" />
              <button onClick={() => setMobileOpen(false)} className="p-2 bg-gray-50 rounded-full">
                <X className="w-6 h-6 text-gray-900" />
              </button>
            </div>

            <nav className="p-8 space-y-10 flex-grow">
              {menu.map((item) => (
                <div key={item.title} className="space-y-4">
                  {item.child ? (
                    <>
                      <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/40">
                        {item.title}
                      </h4>
                      <div className="flex flex-col space-y-5">
                        {item.child.map((subItem) => (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            onClick={() => setMobileOpen(false)}
                            className="text-2xl font-black text-gray-900 hover:text-primary transition-all active:scale-95 origin-left"
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    </>
                  ) : (
                    <Link
                      href={item.href || "#"}
                      onClick={() => setMobileOpen(false)}
                      className="text-3xl font-black text-gray-900 hover:text-primary transition-all block uppercase tracking-tighter"
                    >
                      {item.title}
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            <div className="p-8 border-t border-gray-50">
              <Link
                href="/e-catalog"
                onClick={() => setMobileOpen(false)}
                className="block w-full text-center py-6 bg-primary text-white rounded-3xl font-black text-xl uppercase tracking-widest shadow-2xl shadow-primary/30 active:scale-95 transition-all"
              >
                e-Catalog
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
