interface AboutHeroProps {
  content?: {
    title?: string;
    description?: string;
  };
}

export default function AboutHero({ content }: AboutHeroProps) {
  const {
    title = "About Besmak India",
    description = "Delivering precision and quality in industrial manufacturing for over two decades.",
  } = content || {};

  return (
    <section className="bg-blue-900 text-white py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">{title}</h1>
        <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
          {description}
        </p>
      </div>
    </section>
  );
}
