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
} from "lucide-react";
import { toast } from "sonner";
import MediaPickerModal from "@/components/admin/MediaPickerModal";

export default function SettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({
    primary_color: "#284b8c",
    logo_url: "/images/Besmak-Logo.png",
  });
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
    } catch (error) {
      toast.error("Error loading settings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    setIsSavingSettings(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings }),
      });

      if (!res.ok) throw new Error("Failed to save settings");

      toast.success("Settings updated successfully");

      // Dispatch event for ThemeRegistry to pick up
      window.dispatchEvent(
        new CustomEvent("site-settings-updated", {
          detail: settings,
        }),
      );
    } catch (error) {
      toast.error("Error saving settings");
    } finally {
      setIsSavingSettings(false);
    }
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
                    <label className="text-xs font-semibold text-gray-500 ">
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
                    <label className="text-xs font-semibold text-gray-500 ">
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
                      <label className="text-xs font-semibold text-gray-500  flex justify-between">
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
                    <label className="text-xs font-semibold text-gray-500  flex justify-between">
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
