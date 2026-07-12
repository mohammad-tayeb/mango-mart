import Link from 'next/link';
import Image from 'next/image';
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-900 font-sans">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-6">

          {/* Column 1: Brand Logo & Contact Info */}
          <div className="space-y-4 text-center md:text-left">
            <div className="flex justify-center md:justify-start">
              <Image
                src="/logo.png" // Ensure your logo file is in the public folder
                alt="Mango Lovers Logo"
                width={150}
                height={60}
                className="object-contain"
              />
            </div>
            <p className="text-gray-900 text-sm font-semibold ms-2">
              সেরা আম, সবার জন্য।
            </p>
            <div className="text-sm space-y-2 pt-2 leading-relaxed">
              <p>Chattogram, Bangladesh 4202 Bangladesh</p>
              <p>
                <a href="mailto:official.mangomartbd@gmail.com" className="hover:text-gray-900 transition-colors">
                  official.mangomartbd@gmail.com
                </a>
              </p>
              <p>
                <a href="tel:01822-350799" className="hover:text-gray-900 transition-colors">
                  01822-350799
                </a>
              </p>
            </div>
          </div>

          {/* Column 2: Help Links */}
          <div className='text-center md:text-left'>
            <h3 className="text-gray-900 font-bold tracking-wider uppercase text-sm mb-6 ">
              Help
            </h3>
            <ul className="space-y-4 text-sm">
              <li>
                <Link href="/contact" className="hover:text-gray-900 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/trackParcel" className="hover:text-gray-900 transition-colors">
                  Track Parcel
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Information Links */}
          <div className='text-center md:text-left'>
            <h3 className="text-gray-900 font-bold tracking-wider uppercase text-sm mb-6">
              Information
            </h3>
            <ul className="space-y-4 text-sm">
              <li>
                <Link href="/about" className="hover:text-gray-900 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/privacyPolicy" className="hover:text-gray-900 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/termsConditions" className="hover:text-gray-900 transition-colors">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Social Icons */}
          <div className='text-center md:text-left'>
            <h3 className="text-gray-900 font-bold tracking-wider uppercase text-sm mb-6">
              Follow Us
            </h3>

            <div className="flex justify-center md:justify-start gap-3">
              <a
                href="https://www.facebook.com/mangomartbd11"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-orange-500 text-white hover:bg-blue-600 hover:text-white transition-all duration-300"
              >
                <FaFacebookF className="text-lg" />
              </a>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-orange-500 text-white hover:bg-pink-600 hover:text-white transition-all duration-300"
              >
                <FaInstagram className="text-lg" />
              </a>
            </div>
          </div>

        </div>

        {/* Divider Line */}
        <hr className="border-orange-500 border my-8" />

        {/* Bottom Bar: Copyright & Payment Badges */}
        <div className=' text-center'>
          &copy; 2026 Mango Mart BD. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
export default Footer