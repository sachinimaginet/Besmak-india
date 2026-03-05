"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

interface Vertical {
  id: string;
  title: string;
  description: string;
  image: string;
  href: string;
}

interface StrategicVerticalsProps {
  content?: {
    heading?: string;
    subheading?: string;
    verticals?: Vertical[];
  };
}

const defaultVerticals: Vertical[] = [
  {
    id: "connectors",
    title: "Connectors",
    description: "High-reliability automotive and industrial connectors.",
    image: "https://cvnvhpmvk12hdosq.public.blob.vercel-storage.com/167574675e2d8b125fbaaaf1b9a7dd028a95e6f5.png",
    href: "/products/connectors",
  },
  {
    id: "fuse-box",
    title: "Fuse Box",
    description: "Precision engineered thermal management solutions.",
    image: "https://cvnvhpmvk12hdosq.public.blob.vercel-storage.com/1f7673b32195506c3e16ca7fedc10f5d3a08d3b0.png",
    href: "/products/fuse-box",
  },
  {
    id: "dummy-plugs",
    title: "Dummy Plugs",
    description: "Secure sealing solutions for connection systems.",
    image: "https://cvnvhpmvk12hdosq.public.blob.vercel-storage.com/6bbf541a3751e6d87bb11f101e191a95e5d24d58.png",
    href: "/products/dummy-plugs",
  },
  {
    id: "relay",
    title: "Relay",
    description: "Advanced switching components for control systems.",
    image: "https://cvnvhpmvk12hdosq.public.blob.vercel-storage.com/6420af06203961d21746289b7e874ff9a58f9440.png",
    href: "/products/relay",
  },
];

const containerVariants: any = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants: any = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

export default function StrategicVerticals({
  content,
}: StrategicVerticalsProps) {
  const {
    heading = "Precision Engineered Components",
    verticals = defaultVerticals,
  } = content || {};

  return (
    <section className="strategic-verticals py-24 bg-[#f8fafc] overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#0b327b] tracking-tight mb-4">
            {heading}
          </h2>
          <div className="w-24 h-1.5 bg-[#0b327b] mx-auto rounded-full" />
        </motion.div>

        {/* Verticals Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {verticals.map((vertical) => (
            <motion.div
              key={vertical.id}
              variants={itemVariants}
              whileHover={{ y: -10 }}
              className="group relative cursor-pointer"
            >
              <Link href={vertical.href} className="block">
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm transition-shadow duration-500 group-hover:shadow-2xl group-hover:shadow-blue-900/10">
                  {/* Image Container */}
                  <div className="absolute inset-0 p-8 flex items-center justify-center transition-transform duration-700 ease-out group-hover:scale-110">
                    <div className="relative w-full h-full">
                      <Image
                        src={vertical.image}
                        alt={vertical.title}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    </div>
                  </div>

                  {/* Gradient Overlay for Title readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Title Overlay */}
                  <div className="absolute bottom-0 inset-x-0 p-6">
                    <div className="backdrop-blur-md bg-white/80 border border-white/20 rounded-xl p-4 shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                      <h3 className="text-[#0b327b] text-xl font-bold text-center group-hover:text-blue-700 transition-colors duration-300">
                        {vertical.title}
                      </h3>
                    </div>
                  </div>

                  {/* Interactive Glow Effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-700">
                    <div className="absolute -inset-[100%] bg-gradient-to-tr from-blue-400/0 via-blue-400/10 to-blue-400/0 rotate-45 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <style jsx>{`
        .strategic-verticals {
          position: relative;
        }
        
        /* Subtle background patterns if needed */
        .strategic-verticals::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, #0b327b/10, transparent);
        }
      `}</style>
    </section>
  );
}
