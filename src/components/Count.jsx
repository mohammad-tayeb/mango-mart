"use client"
import CountUp from "react-countup"

function Count() {
    return (
        <section className="max-w-5xl mx-auto px-4 py-16 text-center">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 bg-amber-500 text-white p-8 rounded-2xl shadow-lg">

                <div>
                    <p className="text-3xl md:text-4xl font-extrabold">
                        <CountUp
                            end={5000}
                            duration={2.5}
                            separator=","
                        />
                        +
                    </p>
                    <p className="text-sm opacity-80 mt-1">সন্তুষ্ট গ্রাহক</p>
                </div>

                <div>
                    <p className="text-3xl md:text-4xl font-extrabold">
                        <CountUp
                            end={10}
                            duration={2.5}
                            enableScrollSpy
                            scrollSpyOnce
                        />
                        + টন
                    </p>
                    <p className="text-sm opacity-80 mt-1">আম সরবরাহ</p>
                </div>

                <div>
                    <p className="text-3xl md:text-4xl font-extrabold">
                        <CountUp
                            end={15}
                            duration={2.5}
                            enableScrollSpy
                            scrollSpyOnce
                        />
                        +
                    </p>
                    <p className="text-sm opacity-80 mt-1">আমের জাত</p>
                </div>

                <div>
                    <p className="text-3xl md:text-4xl font-extrabold">
                        <CountUp
                            end={100}
                            duration={2.5}
                            enableScrollSpy
                            scrollSpyOnce
                        />
                        %
                    </p>
                    <p className="text-sm opacity-80 mt-1">খাঁটি হওয়ার গ্যারান্টি</p>
                </div>

            </div>
        </section>
    )
}
export default Count