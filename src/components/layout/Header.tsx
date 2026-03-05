"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";

interface HeaderProps {
  settings?: Record<string, string>;
}

const DEFAULT_MENU = [
  {
    title: "Discover Us",
    child: [
      { name: "At a Glance", href: "/about-us/at-a-glance" },
      { name: "Our Values & Governance", href: "/about-us/values-governance" },
      { name: "Partnerships", href: "/about-us/partnerships" },
    ],
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop",
    tagline: "Building a legacy of precision and trust.",
  },
  {
    title: "Products",
    child: [
      { name: "Connectors", href: "/products/connectors" },
      { name: "Engineering Products", href: "/products/engineering-products" },
    ],
    image:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop",
    tagline: "Quality components for global industries.",
  },
  {
    title: "Infrastructure",
    child: [
      { name: "Tool Room", href: "/infrastructure/tool-room" },
      {
        name: "Automation & Technology",
        href: "/infrastructure/automation-technology",
      },
    ],
    image:
      "https://images.unsplash.com/photo-1504917595217-d4dc5fee1227?q=80&w=800&auto=format&fit=crop",
    tagline: "Cutting-edge technology at our core.",
  },
  { title: "Events", href: "/events" },
  { title: "CSR", href: "/csr" },
  { title: "Contact Us", href: "/contact" },
];

const Header = ({ settings }: HeaderProps) => {
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const [hoverImage, setHoverImage] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const navRef = useRef<HTMLDivElement>(null);

  let menu = DEFAULT_MENU;
  if (settings?.main_menu) {
    try {
      menu = JSON.parse(settings.main_menu);
    } catch (e) {
      console.error("Failed to parse main_menu setting", e);
    }
  }
  const logoUrl = settings?.logo_url || "/images/Besmak-Logo.png";
  const headerHeight = settings?.header_height
    ? parseInt(settings.header_height)
    : 24;

  const logoSize = settings?.logo_size ? parseInt(settings.logo_size) / 100 : 1;
  const menuFont = settings?.menu_font || "Inter";

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
    if (expandedMenu === title) {
      setExpandedMenu(null);
      setHoverImage(null);
    } else {
      setExpandedMenu(title);
      const activeMenu = menu.find((item: any) => item.title === title);
      setHoverImage(activeMenu?.image || null);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white ${expandedMenu || scrolled ? "shadow-md" : ""
        }`}
      style={{ fontFamily: 'var(--font-body)' }}
    >
      <div className="container mx-auto px-4">
        {/* Main Header Row */}
        <div
          className={`flex items-center justify-between transition-all duration-300 h-${headerHeight}`}
        >
          {/* Logo - Left Aligned */}
          <Link href="/" className="flex items-center">
            <div
              className="relative transition-all duration-300 flex items-center"
              style={{
                height: `${(headerHeight - 8) * 4}px`,
                transform: `scale(${logoSize})`,
                transformOrigin: "left center",
              }}
            >
              <Image
                src={logoUrl}
                alt="Besmak Logo"
                width={280}
                height={100}
                className="object-contain h-full w-auto"
                priority
              />
            </div>
          </Link>

          {/* Navigation - Right Aligned */}
          <div className="flex items-center gap-6">
            <nav ref={navRef} className="hidden lg:flex items-center gap-6">
              {menu.map((item: any) => (
                <div key={item.title} className="relative">
                  {item.child ? (
                    <button
                      onClick={() => toggleMenu(item.title)}
                      className={`flex items-center gap-1.5 text-[15px] font-medium transition-colors ${expandedMenu === item.title ||
                        pathname.startsWith(item.href || "")
                        ? "text-primary"
                        : "text-gray-600 hover:text-primary"
                        }`}
                    >
                      {item.title}
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-300 ${expandedMenu === item.title ? "rotate-180" : ""
                          }`}
                      />
                    </button>
                  ) : (
                    <Link
                      href={item.href || "#"}
                      className={`text-[15px] font-medium transition-colors ${pathname === item.href
                        ? "text-primary"
                        : "text-gray-600 hover:text-primary"
                        }`}
                    >
                      {item.title}
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            {/* CTA Button */}
            <Link
              href="/e-catalog"
              className="hidden lg:inline-flex px-6 py-2.5 bg-[#00469b] text-white rounded-lg font-bold text-sm transition-all hover:bg-[#003576] active:scale-95"
            >
              e-Catalog
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden p-2 text-gray-700 hover:text-primary transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Submenu Expansion - Focused under Nav area */}
        {expandedMenu && (
          <div className="hidden lg:block w-full border-t border-gray-50 py-12 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex justify-end pr-8">
              <div className="flex gap-12 max-w-4xl">
                {/* Submenu Links Pane */}
                <div className="min-w-[240px]">
                  <ul className="space-y-4">
                    {menu
                      .find((m: any) => m.title === expandedMenu)
                      ?.child?.map((subItem: any) => (
                        <li key={subItem.name}>
                          <Link
                            href={subItem.href}
                            onMouseEnter={() => {
                              if (subItem.image) {
                                setHoverImage(subItem.image);
                              } else {
                                const activeMenu = menu.find(
                                  (m: any) => m.title === expandedMenu,
                                );
                                setHoverImage(activeMenu?.image || null);
                              }
                            }}
                            onClick={() => {
                              setExpandedMenu(null);
                              setHoverImage(null);
                            }}
                            className={`text-[15px] font-medium transition-colors inline-block ${pathname === subItem.href
                              ? "text-primary"
                              : "text-gray-800 hover:text-primary"
                              }`}
                          >
                            {subItem.name}
                          </Link>
                        </li>
                      ))}
                  </ul>
                </div>

                {/* Submenu Image Pane */}
                {(() => {
                  const activeMenu = menu.find(
                    (m: any) => m.title === expandedMenu,
                  );
                  if (!activeMenu) return null;
                  return (
                    <div className="w-[380px] shrink-0">
                      <div className="relative rounded-2xl overflow-hidden aspect-[1.8/1] shadow-xl border border-gray-100 bg-gray-50">
                        {hoverImage ? (
                          <Image
                            src={hoverImage}
                            alt={expandedMenu}
                            fill
                            className="object-cover animate-in fade-in duration-500"
                            key={hoverImage}
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-gray-300">
                            <Menu className="w-12 h-12" />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Navigation Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-60 bg-white lg:hidden overflow-y-auto animate-in slide-in-from-right duration-300">
          <div className="flex flex-col h-full">
            <div className="p-4 flex items-center justify-between border-b border-gray-50">
              <Image
                src={logoUrl}
                alt="Logo"
                width={140}
                height={50}
                className="h-10 w-auto object-contain"
              />
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 text-gray-900 bg-gray-50 rounded-full"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="p-6 space-y-6">
              {menu.map((item: any) => (
                <div key={item.title} className="space-y-3">
                  {item.child ? (
                    <>
                      <h4 className="text-xs font-bold  tracking-widest text-[#00469b]">
                        {item.title}
                      </h4>
                      <div className="flex flex-col space-y-3 pl-3">
                        {item.child.map((subItem: any) => (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            onClick={() => setMobileOpen(false)}
                            className="text-lg font-medium text-gray-800 hover:text-primary transition-colors"
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
                      className="text-lg font-bold text-gray-900 border-b border-gray-50 pb-2 block"
                    >
                      {item.title}
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            <div className="p-6 mt-auto">
              <Link
                href="/e-catalog"
                onClick={() => setMobileOpen(false)}
                className="block w-full text-center py-4 bg-[#00469b] text-white rounded-xl font-bold transition-all shadow-lg active:scale-95"
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
