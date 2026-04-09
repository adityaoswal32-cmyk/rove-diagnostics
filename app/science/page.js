import ScienceHero from '@/components/ScienceHero';
import Biomarkers from '@/components/Biomarkers';
import HormoneWave from '@/components/HormoneWave';
import ClinicalRelevance from '@/components/ClinicalRelevance';
import Product from '@/components/Product';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Science — Rove Diagnostics',
  description: 'Explore the science behind Rove Diagnostics. Learn about FSH, LH, E3G, and PDG biomarkers, hormone dynamics across the menstrual cycle, and clinical relevance for PCOS, fertility, and cycle health.',
};

export default function SciencePage() {
  return (
    <>
      <ScienceHero />
      <Biomarkers />
      <HormoneWave />
      <ClinicalRelevance />
      <Product />
      <Footer />
    </>
  );
}
