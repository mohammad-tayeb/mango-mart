
import CategorySlider from "@/components/CategorySlider";
import FeaturedProducts from "@/components/FeaturedProducts";
import HeroCarousel from "@/components/HeroCarousel";
import HomeMarquee from "@/components/HomeMarquee";
import Reviews from "@/components/Reviews";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <HeroCarousel></HeroCarousel>
      <HomeMarquee></HomeMarquee>
      {/* Sticky Category Slider */}
      <div className="sticky md:top-12 top-14 z-40 w-full">
        <CategorySlider />
      </div>
      <FeaturedProducts></FeaturedProducts>
      <Link href="/products" className="btn border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white">সব পণ্য দেখুন</Link>
      <Reviews></Reviews>
    </div>
  );
}