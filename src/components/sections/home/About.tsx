interface AboutProps {
  content?: {
    title?: string;
    description?: string;
  };
}

export default function About({ content }: AboutProps) {
  const {
    title = "About Besmak India",
    description = "We are a leading manufacturer specializing in industrial parts with over 20 years of experience. Our commitment to quality and precision makes us the preferred partner for businesses worldwide.",
  } = content || {};

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">{title}</h2>
          <p className="text-gray-600 leading-relaxed whitespace-pre-line">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}
