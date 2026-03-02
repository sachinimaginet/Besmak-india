import Hero from "./home/Hero";
import About from "./home/About";
import FeaturedProducts from "./home/FeaturedProducts";
import AboutHero from "./about/AboutHero";
import AboutContent from "./about/AboutContent";
import EditableWrapper from "../cms/EditableWrapper";

interface SectionRendererProps {
  section: {
    id: string;
    type: string;
    content: any;
  };
  onUpdate?: () => void;
}

export default function SectionRenderer({
  section,
  onUpdate,
}: SectionRendererProps) {
  const renderContent = () => {
    switch (section.type) {
      case "hero":
        return <Hero content={section.content} />;
      case "about":
        return <About content={section.content} />;
      case "about-hero":
        return <AboutHero content={section.content} />;
      case "about-content":
        return <AboutContent content={section.content} />;
      case "featured-products":
        return <FeaturedProducts content={section.content} />;
      default:
        return null;
    }
  };

  return (
    <EditableWrapper
      sectionId={section.id}
      type={section.type}
      content={section.content}
      onUpdate={onUpdate}
    >
      {renderContent()}
    </EditableWrapper>
  );
}
