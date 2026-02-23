import Hero from "@/components/sections/home/Hero";
import About from "@/components/sections/home/About";
import FeaturedProducts from "@/components/sections/home/FeaturedProducts";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <About />
      <FeaturedProducts />
    </div>
  );
}
