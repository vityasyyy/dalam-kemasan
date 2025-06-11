import Footer from "@/modules/home/footer";
import Hero from "@/modules/home/hero";
import Navbar from "@/modules/home/navbar";
import NavbarResolver from "@/modules/home/navbar-resolver";
import { PageLayout } from "@/components/layouts/page-layout";

export default function Home() {
  return (
    <PageLayout className="border-x border-accent">
      <Navbar />
      <NavbarResolver />
      <Hero />
      <Footer />
    </PageLayout>
  );
}
