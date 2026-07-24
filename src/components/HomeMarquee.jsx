"use client";

import Marquee from "react-fast-marquee";
import { BsFillShieldLockFill } from "react-icons/bs";
import { 
  FiBox, 
  FiCheckCircle, 
  FiGift, 
  FiHeadphones, 
  FiHeart, 
  FiTruck,
  FiSun 
} from "react-icons/fi";

const marqueeItems = [
  { icon: <FiSun className="text-yellow-200" />, text: "সরাসরি বাগান থেকে টাটকা আম" },
  { icon: <FiTruck className="text-yellow-200" />, text: "সারা বাংলাদেশে হোম ডেলিভারি" },
  { icon: <FiGift className="text-yellow-200" />, text: "নির্দিষ্ট শর্তে ফ্রি ডেলিভারি" },
  { icon: <BsFillShieldLockFill className="text-yellow-200" />, text: "নিরাপদ পেমেন্ট সুবিধা" },
  { icon: <FiHeadphones className="text-yellow-200" />, text: "২৪/৭ কাস্টমার সাপোর্ট" },
  { icon: <FiCheckCircle className="text-yellow-200" />, text: "১০০% মানসম্মত ও প্রাকৃতিক আম" },
  { icon: <FiBox className="text-yellow-200" />, text: "নিরাপদ ও আকর্ষণীয় প্যাকেজিং" },
  { icon: <FiHeart className="text-yellow-200" />, text: "হাজারো গ্রাহকের আস্থা" },
];

export default function HomeMarquee() {
  return (
    <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white py-2.5 w-full overflow-hidden shadow-sm">
      <Marquee 
        speed={35} 
        pauseOnHover={true}
        gradient={false}
      >
        {marqueeItems.map((item, index) => (
          <div 
            key={index} 
            className="flex items-center gap-2.5 mx-6 text-xs md:text-sm font-medium tracking-wide"
          >
            <span className="text-lg flex items-center justify-center">
              {item.icon}
            </span>
            <span>{item.text}</span>
            <span className="ml-6 text-yellow-200/80">•</span>
          </div>
        ))}
      </Marquee>
    </div>
  );
}