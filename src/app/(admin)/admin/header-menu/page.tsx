"use client";

import { useState, useEffect } from "react";
import {
  Save,
  Loader2,
  Layers,
  Menu as MenuIcon,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";

export default function HeaderMenuPage() {
  const [settings, setSettings] = useState<Record<string, string>>({
    header_height: "24",
  });
  const [menu, setMenu] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

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

  const handleSave = async () => {
    setIsSaving(true);
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

      toast.success("Header and Menu updated successfully");

      // Dispatch event for ThemeRegistry (if it needs header_height, though mostly handles core theme)
      window.dispatchEvent(
        new CustomEvent("site-settings-updated", {
          detail: settingsToSave,
        }),
      );
    } catch (error) {
      toast.error("Error saving settings");
    } finally {
      setIsSaving(false);
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
    const newItem = { ...newMenu[parentIndex] };
    newItem.child = [
      ...(newItem.child || []),
      { name: "New Sub Item", href: "#" },
    ];
    newMenu[parentIndex] = newItem;
    setMenu(newMenu);
  };

  const removeSubItem = (parentIndex: number, subIndex: number) => {
    const newMenu = [...menu];
    const newItem = { ...newMenu[parentIndex] };
    const newSubMenu = [...(newItem.child || [])];
    newSubMenu.splice(subIndex, 1);
    newItem.child = newSubMenu;
    newMenu[parentIndex] = newItem;
    setMenu(newMenu);
  };

  const updateSubItem = (
    parentIndex: number,
    subIndex: number,
    field: string,
    value: string,
  ) => {
    const newMenu = [...menu];
    const newItem = { ...newMenu[parentIndex] };
    const newSubMenu = [...(newItem.child || [])];
    newSubMenu[subIndex] = { ...newSubMenu[subIndex], [field]: value };
    newItem.child = newSubMenu;
    newMenu[parentIndex] = newItem;
    setMenu(newMenu);
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
          <h1 className="text-3xl font-bold text-gray-900">Header & Menu</h1>
          <p className="text-gray-600 mt-1">
            Manage your website navigation and header appearance.
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
        {/* Header Appearance */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b bg-gray-50 flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            <h2 className="font-bold text-gray-800">Header Appearance</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                  Adjust the vertical size of the main header row.
                </p>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-semibold text-gray-700 flex justify-between">
                  Logo Size
                  <span className="text-primary">
                    {settings.logo_size || "100"}%
                  </span>
                </label>
                <input
                  type="range"
                  min="50"
                  max="400"
                  step="5"
                  value={settings.logo_size || "100"}
                  onChange={(e) =>
                    setSettings({ ...settings, logo_size: e.target.value })
                  }
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <p className="text-xs text-gray-500">
                  Adjust the size of the logo relative to its default size.
                </p>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-semibold text-gray-700">
                  Menu Font Family
                </label>
                <select
                  value={settings.menu_font || "Inter"}
                  onChange={(e) =>
                    setSettings({ ...settings, menu_font: e.target.value })
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
                <p className="text-xs text-gray-500">
                  Choose the font family for the navigation menu links.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Menu Management */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b bg-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MenuIcon className="h-5 w-5 text-primary" />
              <h2 className="font-bold text-gray-800">Menu Management</h2>
            </div>
            <button
              onClick={addMenuItem}
              className="flex items-center gap-1.5 px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm font-bold hover:bg-primary/20 transition-all font-sans"
            >
              <Plus className="h-4 w-4" />
              Add Local Item
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
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 ">
                          Title
                        </label>
                        <input
                          type="text"
                          placeholder="Menu Title"
                          value={item.title}
                          onChange={(e) =>
                            updateMenuItem(index, "title", e.target.value)
                          }
                          className="w-full p-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-900"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 ">
                          Link / Path
                        </label>
                        <input
                          type="text"
                          placeholder="Link (e.g., /products)"
                          value={item.href || ""}
                          onChange={(e) =>
                            updateMenuItem(index, "href", e.target.value)
                          }
                          className="w-full p-2 border border-gray-200 rounded-lg text-sm text-gray-900"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-1 pt-4">
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
                      <span className="text-xs font-bold text-gray-500  tracking-wider">
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
                        className="bg-white p-4 rounded-xl border border-gray-100 space-y-3"
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="text"
                            placeholder="Submenu Name"
                            value={subItem.name}
                            onChange={(e) =>
                              updateSubItem(
                                index,
                                subIndex,
                                "name",
                                e.target.value,
                              )
                            }
                            className="flex-1 text-sm p-2 border border-gray-100 rounded bg-gray-50 focus:ring-1 focus:ring-primary text-gray-900"
                          />
                          <input
                            type="text"
                            placeholder="Submenu Link"
                            value={subItem.href}
                            onChange={(e) =>
                              updateSubItem(
                                index,
                                subIndex,
                                "href",
                                e.target.value,
                              )
                            }
                            className="flex-1 text-sm p-2 border border-gray-100 rounded bg-gray-50 focus:ring-1 focus:ring-primary text-gray-600"
                          />
                          <button
                            onClick={() => removeSubItem(index, subIndex)}
                            className="p-1.5 text-red-300 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="pl-2 flex items-center gap-2">
                          <label className="text-[10px] font-bold text-gray-400  shrink-0">
                            Hover Image URL:
                          </label>
                          <input
                            type="text"
                            placeholder="Optional image for this sub-item"
                            value={subItem.image || ""}
                            onChange={(e) =>
                              updateSubItem(
                                index,
                                subIndex,
                                "image",
                                e.target.value,
                              )
                            }
                            className="flex-1 text-[11px] p-2 border border-gray-100 rounded bg-gray-50 focus:ring-1 focus:ring-primary text-gray-600"
                          />
                        </div>
                      </div>
                    ))}

                    {/* Optional Image for items with children */}
                    {item.child && item.child.length > 0 && (
                      <div className="pt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gray-400 ">
                            Mega-menu Image URL
                          </label>
                          <input
                            type="text"
                            placeholder="Image URL"
                            value={item.image || ""}
                            onChange={(e) =>
                              updateMenuItem(index, "image", e.target.value)
                            }
                            className="w-full text-xs p-2 border border-gray-100 rounded bg-white text-gray-900"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gray-400 ">
                            Mega-menu Tagline
                          </label>
                          <input
                            type="text"
                            placeholder="Tagline text"
                            value={item.tagline || ""}
                            onChange={(e) =>
                              updateMenuItem(index, "tagline", e.target.value)
                            }
                            className="w-full text-xs p-2 border border-gray-100 rounded bg-white text-gray-900"
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
      </div>
    </div>
  );
}
