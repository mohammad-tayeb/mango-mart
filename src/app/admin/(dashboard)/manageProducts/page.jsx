function page() {
    return (
        <div className="bg-slate-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="w-full bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center relative overflow-hidden">

                {/* Top Decorative Amber/Orange Bar */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 to-orange-500"></div>

                {/* Dynamic Animated Icon Area */}
                <div className="mx-auto w-20 h-20 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center text-4xl mb-6 border border-orange-100 animate-bounce">
                    📦
                </div>

                {/* Content Section */}
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">
                    প্রোডাক্ট ম্যানেজমেন্ট (Coming Soon)
                </h2>

                <p className="text-sm text-slate-500 leading-relaxed mb-6">
                    এই সেকশনের ডেভেলপমেন্টের কাজ বর্তমানে চলমান রয়েছে। খুব শীঘ্রই এখান থেকে আপনি নতুন আম যুক্ত করা, স্টক আপডেট করা এবং মূল্য পরিবর্তন করার মতো সব ফিচার লাইভ পরিচালনা করতে পারবেন।
                </p>

                {/* Feature Roadmap / Preview List */}
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-left mb-6 space-y-2.5">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                        আসন্ন ফিচারসমূহ:
                    </p>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                        <span className="text-orange-500">✦</span> নতুন আমের জাত ও ছবি আপলোড
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                        <span className="text-orange-500">✦</span> রিয়েল-টাইম স্টক (কেজি/কার্টন) কন্ট্রোল
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                        <span className="text-orange-500">✦</span> ডিসকাউন্ট এবং অফার প্রাইস সেটআপ
                    </div>
                </div>

                {/* Status Badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                    In Development
                </div>

            </div>
        </div>
    )
}
export default page