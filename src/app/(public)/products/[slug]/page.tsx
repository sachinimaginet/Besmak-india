import { query as dbQuery } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ChevronRight,
  ChevronDown,
  ArrowRight,
  Inbox,
  ShieldCheck,
  Zap,
  Factory,
  Sparkles,
} from "lucide-react";
import ProductImageGallery from "@/components/products/ProductImageGallery";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const sql = `
    SELECT p.*, c.name as categoryName 
    FROM product p 
    JOIN category c ON p.categoryId = c.id 
    WHERE p.slug = ? 
    LIMIT 1
  `;

  const results = await dbQuery(sql, [params.slug]);
  const rawProduct = results[0];

  if (!rawProduct) {
    notFound();
  }

  // Fetch related products
  const relatedSql = `
    SELECT p.id, p.name, p.slug, p.images, c.name as categoryName
    FROM product p
    JOIN category c ON p.categoryId = c.id
    WHERE p.categoryId = ? AND p.id != ?
    LIMIT 4
  `;
  const relatedResults = await dbQuery(relatedSql, [
    rawProduct.categoryId,
    rawProduct.id,
  ]);

  const relatedProducts = relatedResults.map((rp: any) => ({
    ...rp,
    images: rp.images ? JSON.parse(rp.images) : [],
  }));

  // Parse JSON fields manually since we're using raw driver
  const product = {
    ...rawProduct,
    category: {
      name: rawProduct.categoryName,
    },
    specifications: rawProduct.specifications
      ? JSON.parse(rawProduct.specifications)
      : null,
    images: rawProduct.images ? JSON.parse(rawProduct.images) : [],
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-12 pt-[130px] relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-50/50 to-transparent pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 max-w-6xl mb-6 relative z-10 animate-in fade-in slide-in-from-top-4 duration-1000">
        <nav className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-xl border border-white/40 rounded-full shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] text-[10px] font-black uppercase tracking-[0.15em]">
          <Link
            href="/"
            className="text-gray-400 hover:text-primary transition-colors hover:scale-105"
          >
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
          <Link
            href="/products"
            className="text-gray-400 hover:text-primary transition-colors hover:scale-105"
          >
            Products
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
          <span className="text-primary font-bold">{product.name}</span>
        </nav>
      </div>

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Left Column: Images & Key Specs */}
          <div className="lg:col-span-7 space-y-4 animate-in fade-in slide-in-from-left-8 duration-1000 ease-out">
            <div className="group bg-white rounded-[2rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] overflow-hidden border border-gray-100/50 p-4 md:p-6 transition-all hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.12)]">
              <ProductImageGallery
                images={product.images}
                productName={product.name}
              />
            </div>

            {/* Feature Highlights with Staggered Entrance */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  icon: ShieldCheck,
                  title: "Quality",
                  desc: "IS Certified",
                  color: "blue",
                },
                {
                  icon: Zap,
                  title: "Precision",
                  desc: "High Speed",
                  color: "amber",
                },
                {
                  icon: Factory,
                  title: "Scale",
                  desc: "Bulk Ready",
                  color: "emerald",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className={`bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 group hover:border-primary/20 hover:shadow-md transition-all duration-500 animate-in fade-in slide-in-from-bottom-4 delay-[${300 + idx * 100}ms]`}
                >
                  <div
                    className={`w-10 h-10 bg-${item.color}-50 rounded-xl flex items-center justify-center text-${item.color === "blue" ? "primary" : item.color + "-600"} shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500`}
                  >
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                      {item.title}
                    </p>
                    <p className="text-xs font-black text-gray-800">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Info & Enquiry */}
          <div className="lg:col-span-5 space-y-6 animate-in fade-in slide-in-from-right-8 duration-1000 ease-out">
            <div className="bg-white rounded-[2rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] border border-gray-100/50 p-6 md:p-8 lg:p-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                <Sparkles className="w-32 h-32 text-primary" />
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/5 text-primary rounded-full text-[10px] font-bold uppercase tracking-widest mb-4 group cursor-default">
                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse group-hover:scale-150 transition-transform"></span>
                {product.category.name}
              </div>

              <h1 className="text-[10px] md:text-xs lg:text-sm font-black text-primary mb-1 leading-tight tracking-tight">
                {product.name}
              </h1>

              <div className="prose prose-slate max-w-none mb-6">
                <p className="text-primary/70 text-sm font-bold leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Specifications List */}
              <div className="space-y-4 mb-8">
                <h4 className="text-[7px] font-black text-primary/40 uppercase tracking-[0.3em] mb-2 flex items-center gap-2">
                  <span className="w-2.5 h-[1px] bg-primary/20"></span>
                  Technical Excellence
                </h4>
                <div className="grid grid-cols-1 gap-2">
                  {product.specifications &&
                    Object.entries(
                      product.specifications as Record<string, any>,
                    ).map(([key, value], idx) => (
                      <div
                        key={key}
                        className="flex items-center justify-between p-3 bg-gray-50/50 rounded-xl border border-gray-100 hover:border-primary/30 hover:bg-white hover:shadow-sm transition-all duration-300 group animate-in fade-in slide-in-from-right-2"
                        style={{ animationDelay: `${500 + idx * 50}ms` }}
                      >
                        <span className="text-[11px] font-black text-primary/50 group-hover:text-primary transition-colors">
                          {key}
                        </span>
                        <span className="text-[11px] font-black text-primary">
                          {String(value)}
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Premium Enquiry UI */}
              <div className="pt-8 border-t border-gray-100/80">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-11 h-11 bg-primary text-white rounded-[0.9rem] flex items-center justify-center shadow-[0_10px_20px_-5px_rgba(0,70,155,0.4)] transform rotate-3 transition-transform hover:rotate-0">
                    <Inbox className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-black text-primary leading-none mb-1">
                      Request Quote
                    </h2>
                    <p className="text-[11px] text-primary/40 font-black uppercase tracking-tighter">
                      Premium Service Desk
                    </p>
                  </div>
                </div>

                <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5 group">
                    <label className="text-[9px] font-black text-primary/40 uppercase tracking-widest ml-1 group-focus-within:text-primary transition-colors">
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-gray-50/80 border border-gray-100 rounded-xl focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none text-xs font-bold text-primary transition-all placeholder:text-primary/30 hover:bg-white"
                      placeholder="e.g. John Doe"
                    />
                  </div>
                  <div className="space-y-1.5 group">
                    <label className="text-[9px] font-black text-primary/40 uppercase tracking-widest ml-1 group-focus-within:text-primary transition-colors">
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 bg-gray-50/80 border border-gray-100 rounded-xl focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none text-xs font-bold text-primary transition-all placeholder:text-primary/30 hover:bg-white"
                      placeholder="john@company.com"
                    />
                  </div>
                  <div className="space-y-1.5 group">
                    <label className="text-[9px] font-black text-primary/40 uppercase tracking-widest ml-1 group-focus-within:text-primary transition-colors">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      className="w-full px-4 py-3 bg-gray-50/80 border border-gray-100 rounded-xl focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none text-xs font-bold text-primary transition-all placeholder:text-primary/30 hover:bg-white"
                      placeholder="+91 98XXX XXXXX"
                    />
                  </div>
                  <div className="space-y-1.5 group">
                    <label className="text-[9px] font-black text-primary/40 uppercase tracking-widest ml-1 group-focus-within:text-primary transition-colors">
                      Company Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-gray-50/80 border border-gray-100 rounded-xl focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none text-xs font-bold text-primary transition-all placeholder:text-primary/30 hover:bg-white"
                      placeholder="Company Pvt Ltd"
                    />
                  </div>
                  <div className="space-y-1.5 group md:col-span-2">
                    <label className="text-[9px] font-black text-primary/40 uppercase tracking-widest ml-1 group-focus-within:text-primary transition-colors">
                      Industry Sector
                    </label>
                    <div className="relative">
                      <select className="w-full px-4 py-3 bg-gray-50/80 border border-gray-100 rounded-xl focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none text-xs font-bold text-primary transition-all hover:bg-white appearance-none cursor-pointer">
                        <option value="">Select Industry</option>
                        <option value="automotive">Automotive</option>
                        <option value="aerospace">Aerospace</option>
                        <option value="electronics">Electronics</option>
                        <option value="industrial">
                          Industrial Manufacturing
                        </option>
                        <option value="energy">Energy & Infrastructure</option>
                        <option value="other">Other</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-primary/40">
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="md:col-span-2 relative overflow-hidden group bg-primary text-white py-4 rounded-xl font-black text-[12px] uppercase tracking-widest shadow-[0_15px_30px_-5px_rgba(0,70,155,0.3)] hover:shadow-[0_20px_40px_-5px_rgba(0,70,155,0.4)] active:scale-[0.98] transition-all"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Send Enquiry
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </button>
                </form>
                <p className="text-[8px] text-center text-primary/30 font-black uppercase tracking-widest mt-6 opacity-60">
                  Confidential inquiry • Response within 24h
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Related Products Section */}
      {relatedProducts && relatedProducts.length > 0 && (
        <div className="container mx-auto px-4 max-w-6xl mt-20 relative z-10 pb-12">
          <div className="flex flex-col mb-10 text-center md:text-left">
            <h2 className="text-2xl font-black text-gray-900 mb-2">
              Related Products
            </h2>
            <div className="h-1 w-20 bg-primary rounded-full mx-auto md:mx-0"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((rp: any, idx: number) => (
              <Link
                href={`/products/${rp.slug}`}
                key={rp.id}
                className="group bg-white rounded-3xl p-4 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 animate-in fade-in slide-in-from-bottom-8 fill-mode-forwards"
                style={{ animationDelay: `${idx * 150}ms` }}
              >
                <div className="aspect-square rounded-2xl overflow-hidden bg-gray-50 mb-4 relative">
                  {rp.images && rp.images[0] ? (
                    <img
                      src={rp.images[0]}
                      alt={rp.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <Factory className="w-10 h-10" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
                </div>
                <p className="text-[9px] font-bold text-primary uppercase tracking-widest mb-1 opacity-60 group-hover:opacity-100 transition-opacity">
                  {rp.categoryName}
                </p>
                <h3 className="text-sm font-black text-gray-900 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                  {rp.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
