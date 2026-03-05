import Link from "next/link";

interface CardGridProps {
  content?: {
    title?: string;
    card1Title?: string;
    card2Title?: string;
    card3Title?: string;
  };
}

export default function CardGrid({ content }: CardGridProps) {
  const {
    title = "Precision Engineered Components",
    card1Title = "Connectors",
    card2Title = "Fuse Box",
    card3Title = "Dummy Plugs",
  } = content || {};

  const cardBase =
    "bg-white rounded-lg shadow-md overflow-hidden transform transition-transform duration-300";

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          {title}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {[card1Title, card2Title, card3Title].map((text, i) => (
            <div
              key={i}
              className={`${cardBase} group hover:scale-105`}
              style={{ minHeight: "16rem" }}
            >
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400">{text}</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{text}</h3>
                <p className="text-gray-600 mb-4">
                  Description for {text}.
                </p>
                <Link
                  href="#"
                  className="text-primary font-medium hover:underline"
                >
                  View More
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
