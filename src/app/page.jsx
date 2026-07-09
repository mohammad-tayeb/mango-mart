import FeaturedProducts from "@/components/FeaturedProducts";
import HeroCarousel from "@/components/HeroCarousel";
import HomeMarquee from "@/components/HomeMarquee";
import Reviews from "@/components/Reviews";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <HeroCarousel></HeroCarousel>
      <HomeMarquee></HomeMarquee>
      <FeaturedProducts></FeaturedProducts>
      <Link href="/products" className="btn border-[#FE7704] text-[#FE7704] hover:bg-[#FE7704] hover:text-white">সব পণ্য দেখুন</Link>
      <Reviews></Reviews>
    </div>
  );
}