"use client";

import { useEffect, useState } from "react";

export default function ThemeRegistry({
  initialSettings,
}: {
  initialSettings: Record<string, string>;
}) {
  const [settings, setSettings] = useState(initialSettings);

  useEffect(() => {
    // Apply initial settings
    if (settings.primary_color) {
      document.documentElement.style.setProperty(
        "--primary",
        settings.primary_color,
      );
    }

    // Detect if a font is likely serif
    const isSerif = (font: string) => {
      const serifFonts = ["Times New Roman", "Playfair Display", "Georgia", "Garamond"];
      return serifFonts.some(s => font.includes(s));
    };

    if (settings.heading_font) {
      const fallback = isSerif(settings.heading_font) ? "serif" : "sans-serif";
      document.documentElement.style.setProperty(
        "--font-heading",
        `'${settings.heading_font}', ${fallback}`,
      );
    }

    if (settings.body_font) {
      const fallback = isSerif(settings.body_font) ? "serif" : "sans-serif";
      document.documentElement.style.setProperty(
        "--font-body",
        `'${settings.body_font}', ${fallback}`,
      );
    }

    // ... rest of sizes ... (kept same)
    if (settings.h1_font_size) document.documentElement.style.setProperty("--font-size-h1", `${settings.h1_font_size}px`);
    if (settings.h2_font_size) document.documentElement.style.setProperty("--font-size-h2", `${settings.h2_font_size}px`);
    if (settings.h3_font_size) document.documentElement.style.setProperty("--font-size-h3", `${settings.h3_font_size}px`);
    if (settings.h4_font_size) document.documentElement.style.setProperty("--font-size-h4", `${settings.h4_font_size}px`);
    if (settings.h5_font_size) document.documentElement.style.setProperty("--font-size-h5", `${settings.h5_font_size}px`);
    if (settings.h6_font_size) document.documentElement.style.setProperty("--font-size-h6", `${settings.h6_font_size}px`);

    if (settings.body_font_size) {
      document.documentElement.style.setProperty(
        "--font-size-body",
        `${settings.body_font_size}px`,
      );
    }

    // Load fonts (skip system fonts)
    const systemFonts = ["Inter", "Times New Roman", "Arial", "Verdana", "Georgia", "Helvetica"];
    const fontsToLoad = [];
    if (settings.heading_font && !systemFonts.includes(settings.heading_font))
      fontsToLoad.push(settings.heading_font);
    if (
      settings.body_font &&
      !systemFonts.includes(settings.body_font) &&
      settings.body_font !== settings.heading_font
    )
      fontsToLoad.push(settings.body_font);

    if (fontsToLoad.length > 0) {
      const linkId = "dynamic-google-fonts";
      let link = document.getElementById(linkId) as HTMLLinkElement;
      if (!link) {
        link = document.createElement("link");
        link.id = linkId;
        link.rel = "stylesheet";
        document.head.appendChild(link);
      }
      const fontQuery = fontsToLoad
        .map((f) => `family=${f.replace(/ /g, "+")}:wght@400;500;600;700`)
        .join("&");
      link.href = `https://fonts.googleapis.com/css2?${fontQuery}&display=swap`;
    }

    // Listen for custom events (for immediate preview in admin)
    const handleSettingsUpdate = (e: any) => {
      if (e.detail) {
        setSettings((prev) => ({ ...prev, ...e.detail }));
      }
    };

    window.addEventListener("site-settings-updated", handleSettingsUpdate);
    return () =>
      window.removeEventListener("site-settings-updated", handleSettingsUpdate);
  }, [settings]);

  return null;
}
