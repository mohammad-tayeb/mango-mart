"use client";

import Marquee from "react-fast-marquee";

function HomeMarquee() {
  const items = [
    "🥭 সরাসরি বাগান থেকে টাটকা আম",
    "🚚 সারা বাংলাদেশে হোম ডেলিভারি",
    "🎁 নির্দিষ্ট শর্তে ফ্রি ডেলিভারি",
    "💳 নিরাপদ পেমেন্ট সুবিধা",
    "📞 ২৪/৭ কাস্টমার সাপোর্ট",
    "✅ ১০০% মানসম্মত ও প্রাকৃতিক আম",
    "📦 নিরাপদ ও আকর্ষণীয় প্যাকেজিং",
    "❤️ হাজারো গ্রাহকের আস্থা",
  ];

  return (
    <div className="bg-[#FE7704] text-white py-2 w-full">
      <Marquee speed={45} gradient={false}>
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-center mx-8 text-sm md:text-base font-medium"
          >
            <span>{item}</span>
            <span className="mx-8 text-yellow-200">•</span>
          </div>
        ))}
      </Marquee>
    </div>
  );
}

export default HomeMarquee;