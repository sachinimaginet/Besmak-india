"use client";

import { useState, useEffect } from "react";
import {
  Palette,
  ImageIcon,
  Lock,
  Mail,
  Save,
  Loader2,
  RefreshCw,
  Eye,
  EyeOff,
  Menu as MenuIcon,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Layers,
} from "lucide-react";
import { toast } from "sonner";
import MediaPickerModal from "@/components/admin/MediaPickerModal";

export default function SettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({
    primary_color: "#284b8c",
    logo_url: "/images/Besmak-Logo.png",
    header_height: "24",
  });
  const [menu, setMenu] = useState<any[]>([]);
  const [profile, setProfile] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/admin/settings");
      if (!res.ok) throw new Error("Failed to fetch settings");
      const data = await res.json();
      setSettings((prev) => ({ ...prev, ...data }));
      if (data.main_menu) {
        try {
          setMenu(JSON.parse(data.main_menu));
        } catch (e) {
          console.error("Failed to parse menu JSON", e);
        }
      }
    } catch (error) {
      toast.error("Error loading settings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    setIsSavingSettings(true);
    try {
      const settingsToSave = {
        ...settings,
        main_menu: JSON.stringify(menu),
      };

      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings: settingsToSave }),
      });

      if (!res.ok) throw new Error("Failed to save settings");

      toast.success("Settings updated successfully");

      // Dispatch event for ThemeRegistry to pick up
      window.dispatchEvent(
        new CustomEvent("site-settings-updated", {
          detail: settingsToSave,
        }),
      );
    } catch (error) {
      toast.error("Error saving settings");
    } finally {
      setIsSavingSettings(false);
    }
  };

  const addMenuItem = () => {
    setMenu([...menu, { title: "New Item", href: "#" }]);
  };

  const removeMenuItem = (index: number) => {
    const newMenu = [...menu];
    newMenu.splice(index, 1);
    setMenu(newMenu);
  };

  const updateMenuItem = (index: number, field: string, value: any) => {
    const newMenu = [...menu];
    newMenu[index] = { ...newMenu[index], [field]: value };
    setMenu(newMenu);
  };

  const moveMenuItem = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === menu.length - 1)
    )
      return;
    const newMenu = [...menu];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    [newMenu[index], newMenu[targetIndex]] = [
      newMenu[targetIndex],
      newMenu[index],
    ];
    setMenu(newMenu);
  };

  const addSubItem = (parentIndex: number) => {
    const newMenu = [...menu];
    if (!newMenu[parentIndex].child) newMenu[parentIndex].child = [];
    newMenu[parentIndex].child.push({ name: "New Sub Item", href: "#" });
    setMenu(newMenu);
  };

  const removeSubItem = (parentIndex: number, subIndex: number) => {
    const newMenu = [...menu];
    newMenu[parentIndex].child.splice(subIndex, 1);
    setMenu(newMenu);
  };

  const updateSubItem = (
    parentIndex: number,
    subIndex: number,
    field: string,
    value: string,
  ) => {
    const newMenu = [...menu];
    newMenu[parentIndex].child[subIndex] = {
      ...newMenu[parentIndex].child[subIndex],
      [field]: value,
    };
    setMenu(newMenu);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (profile.password && profile.password !== profile.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsSavingProfile(true);
    try {
      const res = await fetch("/api/admin/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: profile.email || undefined,
          password: profile.password || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update profile");
      }

      toast.success("Profile updated successfully");
      setProfile({ email: "", password: "", confirmPassword: "" });
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSavingProfile(false);
    }
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
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Settings</h1>
        <p className="text-gray-600 mt-1">
          Configure your website appearance and account security.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Site Configuration */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b bg-gray-50 flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" />
            <h2 className="font-bold text-gray-800">Site Configuration</h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Theme Primary Color
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="color"
                  value={settings.primary_color}
                  onChange={(e) =>
                    setSettings({ ...settings, primary_color: e.target.value })
                  }
                  className="h-12 w-20 rounded cursor-pointer border-none p-0"
                />
                <input
                  type="text"
                  value={settings.primary_color}
                  onChange={(e) =>
                    setSettings({ ...settings, primary_color: e.target.value })
                  }
                  className="flex-1 p-2.5 border border-gray-200 rounded-lg text-gray-900 focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
              <p className="text-xs text-gray-500">
                This color will be used for buttons, icons and accents across
                the site.
              </p>
            </div>

            <div className="space-y-4 pt-4 border-t">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Palette className="h-4 w-4 text-gray-400" />
                Typography & Heading Sizes
              </label>

              <div className="grid grid-cols-1 gap-6">
                {/* Fonts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500 uppercase">
                      Heading Font
                    </label>
                    <select
                      value={settings.heading_font || "Inter"}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          heading_font: e.target.value,
                        })
                      }
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
                        "Poppins",
                        "Lato",
                      ].map((font) => (
                        <option key={font} value={font}>
                          {font}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500 uppercase">
                      Body Font
                    </label>
                    <select
                      value={settings.body_font || "Inter"}
                      onChange={(e) =>
                        setSettings({ ...settings, body_font: e.target.value })
                      }
                      className="w-full p-2.5 border border-gray-200 rounded-lg text-gray-900 focus:ring-2 focus:ring-primary outline-none bg-white font-medium"
                    >
                      {[
                        "Inter",
                        "Times New Roman",
                        "Roboto",
                        "Open Sans",
                        "Lato",
                        "Poppins",
                        "Montserrat",
                        "Nunito",
                        "Source Sans 3",
                      ].map((font) => (
                        <option key={font} value={font}>
                          {font}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Heading Sizes */}
                <div className="space-y-4 pt-2">
                  {[
                    {
                      id: "h1",
                      label: "H1 Size",
                      min: 24,
                      max: 96,
                      default: 48,
                    },
                    {
                      id: "h2",
                      label: "H2 Size",
                      min: 20,
                      max: 72,
                      default: 36,
                    },
                    {
                      id: "h3",
                      label: "H3 Size",
                      min: 18,
                      max: 60,
                      default: 30,
                    },
                    {
                      id: "h4",
                      label: "H4 Size",
                      min: 16,
                      max: 48,
                      default: 24,
                    },
                    {
                      id: "h5",
                      label: "H5 Size",
                      min: 14,
                      max: 36,
                      default: 20,
                    },
                    {
                      id: "h6",
                      label: "H6 Size",
                      min: 12,
                      max: 30,
                      default: 18,
                    },
                  ].map((h) => (
                    <div key={h.id} className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-500 uppercase flex justify-between">
                        {h.label}
                        <span className="text-primary">
                          {settings[`${h.id}_font_size`] || h.default}px
                        </span>
                      </label>
                      <input
                        type="range"
                        min={h.min}
                        max={h.max}
                        value={settings[`${h.id}_font_size`] || h.default}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            [`${h.id}_font_size`]: e.target.value,
                          })
                        }
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                      />
                    </div>
                  ))}

                  <div className="space-y-1.5 pt-2">
                    <label className="text-xs font-semibold text-gray-500 uppercase flex justify-between">
                      Body Text Size
                      <span className="text-primary">
                        {settings.body_font_size || "16"}px
                      </span>
                    </label>
                    <input
                      type="range"
                      min="12"
                      max="24"
                      value={settings.body_font_size || "16"}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          body_font_size: e.target.value,
                        })
                      }
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t">
              <label className="text-sm font-semibold text-gray-700 block">
                Website Logo
              </label>
              <div className="flex flex-col items-center gap-4 p-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                {settings.logo_url ? (
                  <div className="relative group bg-white p-4 rounded-lg shadow-sm">
                    <img
                      src={settings.logo_url}
                      alt="Logo Preview"
                      className="max-h-20 object-contain"
                    />
                  </div>
                ) : (
                  <div className="h-20 flex items-center justify-center text-gray-400">
                    <ImageIcon className="h-10 w-10" />
                  </div>
                )}
                <button
                  onClick={() => setIsMediaModalOpen(true)}
                  className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
                >
                  <RefreshCw className="h-4 w-4" />
                  Change Logo from Media
                </button>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={handleSaveSettings}
                disabled={isSavingSettings}
                className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary/90 transition-all flex items-center justify-center shadow-lg shadow-primary/20 disabled:opacity-50"
              >
                {isSavingSettings ? (
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                ) : (
                  <Save className="h-5 w-5 mr-2" />
                )}
                Save Site Settings
              </button>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-fit">
          <div className="p-6 border-b bg-gray-50 flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            <h2 className="font-bold text-gray-800">Header Appearance</h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="space-y-4">
              <label className="text-sm font-semibold text-gray-700 flex justify-between">
                Header Height
                <span className="text-primary">
                  {settings.header_height || "24"}
                </span>
              </label>
              <input
                type="range"
                min="16"
                max="48"
                step="4"
                value={settings.header_height || "24"}
                onChange={(e) =>
                  setSettings({ ...settings, header_height: e.target.value })
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <p className="text-xs text-gray-500">
                Adjust the vertical size of the main header row (in Tailwind h-
                units).
              </p>
            </div>
          </div>
        </section>

        {/* Account Security */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b bg-gray-50 flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary" />
            <h2 className="font-bold text-gray-800">Account Security</h2>
          </div>
          <form onSubmit={handleSaveProfile} className="p-6 space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-400" />
                Change Admin Email
              </label>
              <input
                type="email"
                placeholder="Leave blank to keep current"
                value={profile.email}
                onChange={(e) =>
                  setProfile({ ...profile, email: e.target.value })
                }
                className="w-full p-2.5 border border-gray-200 rounded-lg text-gray-900 focus:ring-2 focus:ring-primary outline-none"
              />
            </div>

            <div className="space-y-4 pt-4 border-t">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={profile.password}
                    onChange={(e) =>
                      setProfile({ ...profile, password: e.target.value })
                    }
                    className="w-full p-2.5 border border-gray-200 rounded-lg text-gray-900 focus:ring-2 focus:ring-primary outline-none pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">
                  Confirm Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={profile.confirmPassword}
                  onChange={(e) =>
                    setProfile({ ...profile, confirmPassword: e.target.value })
                  }
                  className="w-full p-2.5 border border-gray-200 rounded-lg text-gray-900 focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSavingProfile}
                className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition-all flex items-center justify-center shadow-lg shadow-gray-200 disabled:opacity-50"
              >
                {isSavingProfile ? (
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                ) : (
                  <RefreshCw className="h-5 w-5 mr-2" />
                )}
                Update Profile
              </button>
            </div>
            <p className="text-[10px] text-center text-gray-500">
              Note: Updating email or password will require you to log in again.
            </p>
          </form>
        </section>
      </div>

      {/* Menu Management */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b bg-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MenuIcon className="h-5 w-5 text-primary" />
            <h2 className="font-bold text-gray-800">Menu Management</h2>
          </div>
          <button
            onClick={addMenuItem}
            className="flex items-center gap-1.5 px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm font-bold hover:bg-primary/20 transition-all"
          >
            <Plus className="h-4 w-4" />
            Add Menu Item
          </button>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            {menu.map((item, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-xl p-5 border border-gray-100 space-y-4"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Menu Title (e.g., Products)"
                      value={item.title}
                      onChange={(e) =>
                        updateMenuItem(index, "title", e.target.value)
                      }
                      className="p-2 border border-gray-200 rounded-lg text-sm font-medium"
                    />
                    <input
                      type="text"
                      placeholder="Link (e.g., /products)"
                      value={item.href || ""}
                      onChange={(e) =>
                        updateMenuItem(index, "href", e.target.value)
                      }
                      className="p-2 border border-gray-200 rounded-lg text-sm"
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => moveMenuItem(index, "up")}
                      className="p-2 text-gray-400 hover:text-primary transition-colors"
                      title="Move Up"
                    >
                      <ChevronUp className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => moveMenuItem(index, "down")}
                      className="p-2 text-gray-400 hover:text-primary transition-colors"
                      title="Move Down"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => removeMenuItem(index)}
                      className="p-2 text-red-400 hover:text-red-500 transition-colors"
                      title="Delete Item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Submenu Items */}
                <div className="pl-6 border-l-2 border-gray-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Submenu Items
                    </span>
                    <button
                      onClick={() => addSubItem(index)}
                      className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                    >
                      <Plus className="h-3 w-3" />
                      Add Sub Item
                    </button>
                  </div>
                  {item.child?.map((subItem: any, subIndex: number) => (
                    <div
                      key={subIndex}
                      className="flex items-center gap-3 bg-white p-2 rounded-lg border border-gray-100"
                    >
                      <input
                        type="text"
                        placeholder="Submenu Name"
                        value={subItem.name}
                        onChange={(e) =>
                          updateSubItem(index, subIndex, "name", e.target.value)
                        }
                        className="flex-1 text-sm p-1 border-none focus:ring-0"
                      />
                      <input
                        type="text"
                        placeholder="Submenu Link"
                        value={subItem.href}
                        onChange={(e) =>
                          updateSubItem(index, subIndex, "href", e.target.value)
                        }
                        className="flex-1 text-sm p-1 border-none focus:ring-0 text-gray-500"
                      />
                      <button
                        onClick={() => removeSubItem(index, subIndex)}
                        className="p-1 text-red-300 hover:text-red-500"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))}

                  {/* Optional Image for items with children */}
                  {item.child && item.child.length > 0 && (
                    <div className="pt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">
                          Menu Image URL
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Image URL"
                            value={item.image || ""}
                            onChange={(e) =>
                              updateMenuItem(index, "image", e.target.value)
                            }
                            className="flex-1 text-xs p-2 border border-gray-100 rounded bg-white"
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">
                          Tagline
                        </label>
                        <input
                          type="text"
                          placeholder="Tagline text"
                          value={item.tagline || ""}
                          onChange={(e) =>
                            updateMenuItem(index, "tagline", e.target.value)
                          }
                          className="w-full text-xs p-2 border border-gray-100 rounded bg-white"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {menu.length === 0 && (
              <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-2xl">
                <MenuIcon className="h-10 w-10 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-400 font-medium">
                  No menu items added yet.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <MediaPickerModal
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        selectedUrls={[settings.logo_url]}
        onSelect={(urls) => setSettings({ ...settings, logo_url: urls[0] })}
        multiple={false}
      />
    </div>
  );
}
