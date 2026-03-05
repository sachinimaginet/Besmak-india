"use client";

import { useState, useEffect } from "react";
import {
  Save,
  Loader2,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Layout,
  Share2,
  Globe,
} from "lucide-react";
import { toast } from "sonner";

interface FooterLink {
  title: string;
  href: string;
}

interface SocialLink {
  platform: "linkedin" | "facebook" | "twitter" | "youtube";
  url: string;
}

export default function FooterPage() {
  const [verticals, setVerticals] = useState<FooterLink[]>([]);
  const [products, setProducts] = useState<FooterLink[]>([]);
  const [legal, setLegal] = useState<FooterLink[]>([]);
  const [socials, setSocials] = useState<SocialLink[]>([]);
  const [headingSize, setHeadingSize] = useState(11);
  const [fontFamily, setFontFamily] = useState("Inter");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchFooterSettings();
  }, []);

  const fetchFooterSettings = async () => {
    try {
      const res = await fetch("/api/admin/settings");
      if (!res.ok) throw new Error("Failed to fetch settings");
      const data = await res.json();

      if (data.footer_verticals)
        setVerticals(JSON.parse(data.footer_verticals));
      if (data.footer_products) setProducts(JSON.parse(data.footer_products));
      if (data.footer_legal) setLegal(JSON.parse(data.footer_legal));
      if (data.footer_socials) setSocials(JSON.parse(data.footer_socials));
      if (data.footer_heading_size)
        setHeadingSize(parseInt(data.footer_heading_size));
      if (data.footer_font_family) setFontFamily(data.footer_font_family);
    } catch (error) {
      toast.error("Error loading footer settings");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const settings = {
        footer_verticals: JSON.stringify(verticals),
        footer_products: JSON.stringify(products),
        footer_legal: JSON.stringify(legal),
        footer_socials: JSON.stringify(socials),
        footer_heading_size: headingSize.toString(),
        footer_font_family: fontFamily,
      };

      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings }),
      });

      if (!res.ok) throw new Error("Failed to save footer settings");
      toast.success("Footer configuration saved successfully");
    } catch (error) {
      toast.error("Error saving footer settings");
    } finally {
      setIsSaving(false);
    }
  };

  const addItem = (
    setFn: React.Dispatch<React.SetStateAction<FooterLink[]>>,
  ) => {
    setFn((prev) => [...prev, { title: "New Link", href: "#" }]);
  };

  const removeItem = (
    index: number,
    setFn: React.Dispatch<React.SetStateAction<FooterLink[]>>,
  ) => {
    setFn((prev) => prev.filter((_, i) => i !== index));
  };

  const updateItem = (
    index: number,
    field: keyof FooterLink,
    value: string,
    setFn: React.Dispatch<React.SetStateAction<FooterLink[]>>,
  ) => {
    setFn((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    );
  };

  const moveItem = (
    index: number,
    direction: "up" | "down",
    setFn: React.Dispatch<React.SetStateAction<FooterLink[]>>,
  ) => {
    setFn((prev) => {
      const newItems = [...prev];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= newItems.length) return prev;
      [newItems[index], newItems[targetIndex]] = [
        newItems[targetIndex],
        newItems[index],
      ];
      return newItems;
    });
  };

  const updateSocial = (platform: string, url: string) => {
    setSocials((prev) => {
      const existing = prev.find((s) => s.platform === platform);
      if (existing) {
        return prev.map((s) => (s.platform === platform ? { ...s, url } : s));
      }
      return [...prev, { platform: platform as any, url }];
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-sans">
            Footer Configuration
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your website footer links and social media profiles.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold hover:bg-primary/90 transition-all flex items-center shadow-lg shadow-primary/20 disabled:opacity-50"
        >
          {isSaving ? (
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
          ) : (
            <Save className="h-5 w-5 mr-2" />
          )}
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Appearance Settings */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b bg-gray-50 flex items-center gap-2">
            <Layout className="h-5 w-5 text-primary" />
            <h2 className="font-bold text-gray-800">Heading Appearance</h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-gray-700">
                  Footer Menu Heading Size
                </label>
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-lg text-xs font-bold">
                  {headingSize}px
                </span>
              </div>
              <input
                type="range"
                min="8"
                max="30"
                value={headingSize}
                onChange={(e) => setHeadingSize(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                <span>8px</span>
                <span>30px</span>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-gray-100">
              <label className="text-sm font-bold text-gray-700">
                Footer Font Family
              </label>
              <select
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value)}
                className="w-full p-2.5 border border-gray-200 rounded-lg text-gray-900 focus:ring-2 focus:ring-primary outline-none bg-white font-medium"
              >
                {[
                  "Inter",
                  "Times New Roman",
                  "Roboto",
                  "Open Sans",
                  "Montserrat",
                  "Playfair Display",
                  "Oswald",
                  "Raleway",
                  "Nunito",
                  "Poppins",
                ].map((font) => (
                  <option key={font} value={font} style={{ fontFamily: font }}>
                    {font}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500">
                Choose the font family for all text in the footer.
              </p>
            </div>
          </div>
        </section>

        {/* Verticals Section */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b bg-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layout className="h-5 w-5 text-primary" />
              <h2 className="font-bold text-gray-800">Verticals Links</h2>
            </div>
            <button
              onClick={() => addItem(setVerticals)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-xs font-bold hover:bg-primary/20 transition-all"
            >
              <Plus className="h-4 w-4" />
              Add Link
            </button>
          </div>
          <div className="p-6 space-y-4">
            {verticals.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-4 bg-gray-50 p-3 rounded-xl border border-gray-100"
              >
                <input
                  type="text"
                  placeholder="Link Title"
                  value={item.title}
                  onChange={(e) =>
                    updateItem(index, "title", e.target.value, setVerticals)
                  }
                  className="flex-1 p-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-900"
                />
                <input
                  type="text"
                  placeholder="URL Path"
                  value={item.href}
                  onChange={(e) =>
                    updateItem(index, "href", e.target.value, setVerticals)
                  }
                  className="flex-1 p-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600"
                />
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => moveItem(index, "up", setVerticals)}
                    className="p-1.5 text-gray-400 hover:text-primary"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => moveItem(index, "down", setVerticals)}
                    className="p-1.5 text-gray-400 hover:text-primary"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => removeItem(index, setVerticals)}
                    className="p-1.5 text-red-400 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Products Section */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b bg-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              <h2 className="font-bold text-gray-800">Products Links</h2>
            </div>
            <button
              onClick={() => addItem(setProducts)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-xs font-bold hover:bg-primary/20 transition-all"
            >
              <Plus className="h-4 w-4" />
              Add Link
            </button>
          </div>
          <div className="p-6 space-y-4">
            {products.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-4 bg-gray-50 p-3 rounded-xl border border-gray-100"
              >
                <input
                  type="text"
                  placeholder="Link Title"
                  value={item.title}
                  onChange={(e) =>
                    updateItem(index, "title", e.target.value, setProducts)
                  }
                  className="flex-1 p-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-900"
                />
                <input
                  type="text"
                  placeholder="URL Path"
                  value={item.href}
                  onChange={(e) =>
                    updateItem(index, "href", e.target.value, setProducts)
                  }
                  className="flex-1 p-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600"
                />
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => moveItem(index, "up", setProducts)}
                    className="p-1.5 text-gray-400 hover:text-primary"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => moveItem(index, "down", setProducts)}
                    className="p-1.5 text-gray-400 hover:text-primary"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => removeItem(index, setProducts)}
                    className="p-1.5 text-red-400 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Legal Info Section */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b bg-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layout className="h-5 w-5 text-primary" />
              <h2 className="font-bold text-gray-800">
                Legal Information Links
              </h2>
            </div>
            <button
              onClick={() => addItem(setLegal)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-xs font-bold hover:bg-primary/20 transition-all"
            >
              <Plus className="h-4 w-4" />
              Add Link
            </button>
          </div>
          <div className="p-6 space-y-4">
            {legal.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-4 bg-gray-50 p-3 rounded-xl border border-gray-100"
              >
                <input
                  type="text"
                  placeholder="Link Title"
                  value={item.title}
                  onChange={(e) =>
                    updateItem(index, "title", e.target.value, setLegal)
                  }
                  className="flex-1 p-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-900"
                />
                <input
                  type="text"
                  placeholder="URL Path"
                  value={item.href}
                  onChange={(e) =>
                    updateItem(index, "href", e.target.value, setLegal)
                  }
                  className="flex-1 p-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600"
                />
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => moveItem(index, "up", setLegal)}
                    className="p-1.5 text-gray-400 hover:text-primary"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => moveItem(index, "down", setLegal)}
                    className="p-1.5 text-gray-400 hover:text-primary"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => removeItem(index, setLegal)}
                    className="p-1.5 text-red-400 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Social Section */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b bg-gray-50 flex items-center gap-2">
            <Share2 className="h-5 w-5 text-primary" />
            <h2 className="font-bold text-gray-800">Social Media Links</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {(["linkedin", "facebook", "twitter", "youtube"] as const).map(
              (platform) => (
                <div key={platform} className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                    <span className="capitalize">{platform}</span> URL
                  </label>
                  <input
                    type="text"
                    placeholder={`https://${platform}.com/yourprofile`}
                    value={
                      socials.find((s) => s.platform === platform)?.url || ""
                    }
                    onChange={(e) => updateSocial(platform, e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 font-medium"
                  />
                </div>
              ),
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
