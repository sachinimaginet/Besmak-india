import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function DivisionsList() {
  const divisions = [
    {
      title: "Connection Systems",
      slug: "connection-systems",
      description:
        "Leading providers of high-performance electrical connectors and wiring solutions for automotive and industrial applications.",
      features: [
        "Custom Wiring Harnesses",
        "Automotive Connectors",
        "Precision Molding",
      ],
    },
    {
      title: "Engineering Products Division",
      slug: "engineering-products",
      description:
        "Specialized engineering solutions for complex industrial challenges, focused on durability and performance.",
      features: ["Prototyping", "Material Testing", "Industrial Design"],
    },
    {
      title: "Precision Stamping Manufacturing",
      slug: "precision-stamping",
      description:
        "High-volume precision metal stamping services with micron-level accuracy for diverse global industries.",
      features: ["Metal Stamping", "Die Design", "Surface Finishing"],
    },
    {
      title: "CNH Moulds",
      slug: "cnh-moulds",
      description:
        "Expert mold design and manufacturing for plastic injection molding and die-casting processes.",
      features: ["Injection Molding", "Mold Maintenance", "High-Tech Tooling"],
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {divisions.map((division) => (
            <div
              key={division.slug}
              className="bg-white p-8 rounded-xl shadow-sm border hover:shadow-md transition-shadow flex flex-col h-full"
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                {division.title}
              </h3>
              <p className="text-gray-600 mb-6 flex-grow">
                {division.description}
              </p>
              <div className="mb-8">
                <h4 className="text-sm font-bold  tracking-wider text-blue-600 mb-3">
                  Core Expertise
                </h4>
                <ul className="grid grid-cols-1 gap-2">
                  {division.features.map((feature, index) => (
                    <li
                      key={index}
                      className="text-sm text-gray-500 flex items-center"
                    >
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                href={`/verticals/${division.slug}`}
                className="inline-flex items-center text-blue-900 font-bold hover:text-blue-700 transition-colors"
              >
                Learn More
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
