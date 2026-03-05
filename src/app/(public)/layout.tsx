import Header from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import ThemeRegistry from "@/components/layout/ThemeRegistry";
import { getAllSettings } from "@/lib/settings";

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getAllSettings();

  return (
    <div className="flex flex-col min-h-screen site-content">
      <ThemeRegistry initialSettings={settings} />
      <Header />

      <main className="grow">{children}</main>
      <Footer />
    </div>
  );
}
