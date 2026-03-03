interface AboutContentProps {
  content?: {
    title?: string;
    description1?: string;
    description2?: string;
  };
}

export default function AboutContent({ content }: AboutContentProps) {
  const {
    title = "Our Story",
    description1 = "Founded in 2004, Besmak India has grown from a small workshop to a leading name in precision manufacturing. We specialize in high-quality industrial components that meet the rigorous standards of B2B clients worldwide.",
    description2 = "Our state-of-the-art facility and experienced team ensure that every part we produce is a testament to our commitment to excellence.",
  } = content || {};

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">{title}</h2>
            <p className="text-gray-600 mb-4 leading-relaxed whitespace-pre-line">
              {description1}
            </p>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
              {description2}
            </p>
          </div>
          <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center">
            <span className="text-gray-400">Our Facility Image</span>
          </div>
        </div>
      </div>
    </section>
  );
}
