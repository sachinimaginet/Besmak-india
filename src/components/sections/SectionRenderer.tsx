import NewsSection from "./home/NewsSection";
import Hero from "./home/Hero";
import About from "./home/About";
import FeaturedProducts from "./home/FeaturedProducts";
import VideoSection from "./home/VideoSection";
import TextImageSection from "./home/TextImageSection";
import StatsSection from "./home/StatsSection";
import CardGrid from "./home/CardGrid";
import StrategicVerticals from "./home/StrategicVerticals";
import ClientsSection from "./home/ClientsSection";
import EventsAchievements from "./home/EventsAchievements";
import TwoCardsSection from "./home/TwoCardsSection";
import AboutHero from "./about/AboutHero";
import AboutContent from "./about/AboutContent";
import BannerImage from "./about/BannerImage";
import IconBoxes from "./about/IconBoxes";
import AboutCapabilities from "./about/AboutCapabilities";
import AboutFeatureCards from "./about/AboutFeatureCards";
import ProductSearchSection from "./home/ProductSearchSection";
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
      case "about-banner-image":
        return <BannerImage content={section.content} />;
      case "about-icon-boxes":
        return <IconBoxes content={section.content} />;
      case "about-capabilities":
        return <AboutCapabilities content={section.content} />;
      case "about-feature-cards":
        return <AboutFeatureCards content={section.content} />;
      case "featured-products":
        return <FeaturedProducts content={section.content} />;
      case "card-grid":
        return <CardGrid content={section.content} />;
      case "video-section":
        return <VideoSection content={section.content} />;
      case "text-image-section":
        return <TextImageSection content={section.content} />;
      case "stats-section":
        return <StatsSection content={section.content} />;
      case "strategic-verticals":
        return <StrategicVerticals content={section.content} />;
      case "clients-section":
        return <ClientsSection content={section.content} />;
      case "events-achievements":
        return <EventsAchievements content={section.content} />;
      case "dual-cards-section":
        return <TwoCardsSection content={section.content} />;
      case "news-section":
        return <NewsSection content={section.content} />;
      case "product-search":
        return <ProductSearchSection />;
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
