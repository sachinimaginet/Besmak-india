import Header from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import ProductSearchSection from "@/components/sections/home/ProductSearchSection";
import { QueryBasketProvider } from "@/context/QueryBasketContext";
import { getAllSettings } from "@/lib/settings";
import QueryBasketIndicator from "@/components/products/QueryBasketIndicator";

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getAllSettings();

  return (
    <QueryBasketProvider>
      <div className="flex flex-col min-h-screen site-content">
        <Header settings={settings} />

        <main className="grow">{children}</main>
        <ProductSearchSection />
        <Footer settings={settings} />
        <QueryBasketIndicator />
      </div>
    </QueryBasketProvider>
  );
}
