import React from "react";

interface ContactBannerProps {
  content?: {
    imageUrl?: string;
    altText?: string;
  };
}

export default function ContactBanner({ content }: ContactBannerProps) {
  const {
    imageUrl = "",
    altText = "Contact Banner",
  } = content || {};
  console.log(imageUrl);
  debugger;
  if (!imageUrl) {
    return (
      <section className="w-full min-h-[200px] bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">Please provide a banner image URL in the CMS</p>
      </section>
    );
  }

  return (
    <section className="w-full">
      <img
        src={imageUrl}
        alt={altText}
        className="w-full h-auto block"
        loading="eager"
      />
    </section>
  );
}
