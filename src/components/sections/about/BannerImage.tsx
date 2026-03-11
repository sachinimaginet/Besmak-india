import Link from 'next/link';

interface BannerImageProps {
  content?: {
    title?: string;
    breadcrumbs?: Array<{ label: string; url?: string }>;
    bgImageUrl?: string;
  };
}

export default function BannerImage({ content }: BannerImageProps) {
  const {
    title = "About",
    breadcrumbs = [
      { label: "Home", url: "/" },
      { label: "About" }
    ],
    bgImageUrl = "https://cvnvhpmvk12hdosq.public.blob.vercel-storage.com/besmak-about-banner.png"
  } = content || {};

  return (
    <div
      className="w-full h-[450px] flex items-end pb-[100px] relative bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bgImageUrl})` }}
    >
      <div className="absolute inset-0 bg-[#1a2327]/80 z-0"></div>

      <div className="container mx-auto px-4 md:px-6 max-w-7xl relative z-10">
        <div className="text-[16px] mb-2 flex items-center gap-2">
          {breadcrumbs.map((crumb, index) => (
            <span key={index} className="flex items-center gap-2">
              {index > 0 && <span className="text-white mx-1">/</span>}
              {crumb.url ? (
                <Link
                  href={crumb.url}
                  className="text-white font-bold hover:text-[#00B259] transition-colors cursor-pointer"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-[#00B259] font-medium">{crumb.label}</span>
              )}
            </span>
          ))}
        </div>

        <h1 className="!text-[45px] font-bold text-white tracking-tight mt-2">
          {title}
        </h1>
      </div>
    </div>
  );
}