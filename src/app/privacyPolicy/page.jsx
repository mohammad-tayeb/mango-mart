function page() {
    return (
        <div className=" bg-slate-50 py-4 px-4 sm:px-6 lg:px-8 flex justify-center">
            <div className="max-w-2xl w-full bg-white rounded-2xl border border-slate-100 shadow-sm p-8 sm:p-12 text-slate-800">

                {/* Main Heading */}
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-6">
                    Privacy Policy
                </h1>

                <p className="text-sm text-slate-600 leading-relaxed mb-8">
                    This Privacy Policy explains how we collect, use, and protect the information you share with us when shopping on our website.
                </p>

                {/* Section 1 */}
                <section className="mb-8">
                    <h2 className="text-lg font-bold text-slate-900 mb-3">
                        Information We Collect
                    </h2>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600 leading-relaxed">
                        <li>
                            <strong className="text-slate-900">Contact details:</strong> name, phone number, email, and delivery address — required to process and deliver your order.
                        </li>
                        <li>
                            <strong className="text-slate-900">Payment info:</strong> we do not store full card numbers. Transaction IDs for bKash, Nagad, or bank transfers are kept for order verification.
                        </li>
                        <li>
                            <strong className="text-slate-900">Usage data:</strong> anonymous analytics (page views, product views) to improve the shopping experience.
                        </li>
                    </ul>
                </section>

                {/* Section 2 */}
                <section className="mb-8">
                    <h2 className="text-lg font-bold text-slate-900 mb-3">
                        How We Use Your Information
                    </h2>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600 leading-relaxed">
                        <li>To process, deliver, and track your orders</li>
                        <li>To communicate with you about your order (SMS, email, WhatsApp)</li>
                        <li>To prevent fraud and improve our service</li>
                        <li>To send marketing updates (only if you opt in)</li>
                    </ul>
                </section>

                {/* Section 3 */}
                <section className="mb-8">
                    <h2 className="text-lg font-bold text-slate-900 mb-3">
                        Information Sharing
                    </h2>
                    <p className="text-sm text-slate-600 leading-relaxed">
                        We share your delivery address and phone number only with our courier partner (e.g., Steadfast) to fulfill your order. We never sell your personal data to third parties.
                    </p>
                </section>

                {/* Section 4 */}
                <section className="mb-8">
                    <h2 className="text-lg font-bold text-slate-900 mb-3">
                        Your Rights
                    </h2>
                    <p className="text-sm text-slate-600 leading-relaxed">
                        You may request deletion of your personal information at any time by contacting us. We retain order records for tax and legal compliance.
                    </p>
                </section>

                {/* Section 5 */}
                <section className="mb-8">
                    <h2 className="text-lg font-bold text-slate-900 mb-3">
                        Cookies
                    </h2>
                    <p className="text-sm text-slate-600 leading-relaxed">
                        We use essential cookies to keep your cart working and analytics cookies to understand how visitors use our site. You can disable non-essential cookies in your browser.
                    </p>
                </section>

                {/* Section 6 */}
                <section className="mb-8">
                    <h2 className="text-lg font-bold text-slate-900 mb-3">
                        Contact
                    </h2>
                    <p className="text-sm text-slate-600 leading-relaxed">
                        For privacy-related questions, contact us via the{' '}
                        <a href="/contact" className="text-red-500 hover:underline font-medium">
                            Contact page
                        </a>
                        .
                    </p>
                </section>

                {/* Footer Admin Note */}
                <p className="text-xs italic text-slate-500 mb-8">
                    Edit this template from Admin → Pages to match your business practices.
                </p>

                {/* Divider and Timestamp */}
                <hr className="border-slate-100 mb-4" />
                <p className="text-xs text-slate-400">
                    Last updated: 28/04/2026
                </p>

            </div>
        </div>
    )
}
export default page