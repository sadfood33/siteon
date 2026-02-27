import { MainLayout } from '../components/layout/MainLayout';
import { HeroSection } from '../components/home/HeroSection';
import { PromotionsSection } from '../components/home/PromotionsSection';
import { BestSellersSection } from '../components/home/BestSellersSection';
import { BusinessLunchSection } from '../components/home/BusinessLunchSection';
import { DeliverySection } from '../components/home/DeliverySection';
import { AppSection } from '../components/home/AppSection';
import { Footer } from '../components/Footer';

export const HomePage = () => {
  return (
    <MainLayout variant="landing">
      <HeroSection />
      <PromotionsSection />
      <BestSellersSection />
      <BusinessLunchSection />
      <DeliverySection />
      <AppSection />
      <Footer />
    </MainLayout>
  );
};
