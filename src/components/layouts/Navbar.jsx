"use client";

import useCartStore from "@/app/store/cartStore";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {  useState } from "react";
import { FaCartShopping } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import SearchBar from "../SearchBar";


function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false); // Controls Modal Visibility

  const cartItems = useCartStore((state) => state.cart);

  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const removeFromCart = useCartStore(
    (state) => state.removeFromCart
  );


  const pathname = usePathname();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/products' },
    { name: 'Reviews', href: '/reviews' },
    { name: 'Contact Us', href: '/contact' },
    { name: 'Track Parcel', href: '/trackParcel' },
    { name: 'About Us', href: '/about' },
  ];

  return (
    <>
      <nav className="bg-white shadow-md w-full sticky top-0 z-50 md:py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">

            {/* Logo Section */}
            <div className="shrink-0 flex items-center">
              <Link href="/" className="flex items-center">
                <Image
                  src="/logo2.png"
                  alt="Logo"
                  width={100}
                  height={100}
                  className="object-contain"
                />
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex space-x-8 items-center">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${isActive
                      ? 'text-orange-500 font-semibold'
                      : 'text-gray-600 hover:text-orange-500'
                      }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>

            {/* Right Side Actions (Cart & Mobile Toggle) */}
            <div className="flex items-center space-x-4">
              {/* search bar component*/}
              <SearchBar></SearchBar>
              {/* Cart Button Interceptor */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-gray-600 hover:text-orange-500 transition-colors duration-200 focus:outline-none"
                aria-label="Shopping Cart"
              >
                <FaCartShopping className="text-2xl" />

                {/* Badge */}
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white transform translate-x-1/3 -translate-y-1/3 bg-red-500 rounded-full min-w-[18px] h-[18px]">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Mobile Menu Button */}
              <div className="flex md:hidden">
                <button
                  onClick={toggleMenu}
                  type="button"
                  className="text-gray-600 hover:text-orange-500 focus:outline-none p-2"
                  aria-label="Toggle menu"
                >
                  {isOpen ? (
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  )}
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <div
          className={`${isOpen ? 'block opacity-100' : 'hidden opacity-0'
            } md:hidden bg-white border-t border-gray-100 transition-opacity duration-300 ease-in-out`}
        >
          <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3 shadow-inner">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`block px-3 py-2.5 rounded-md text-base font-medium transition-colors duration-150 ${isActive
                    ? 'bg-orange-50 text-orange-500 font-semibold'
                    : 'text-gray-600 hover:bg-orange-50 hover:text-orange-500'
                    }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Cart Modal Overlay Side Drawer */}
      <div
        className={`fixed inset-0 z-[100] transition-opacity duration-300 ${isCartOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
      >
        {/* Dark Backdrop Shadow */}
        <div
          className="absolute inset-0 bg-black/50"
          onClick={() => setIsCartOpen(false)}
        />

        {/* Drawer Container Panel */}
        <div
          className={`absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col transition-transform duration-300 ${isCartOpen ? "translate-x-0" : "translate-x-full"
            }`}
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between px-4 py-5 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <FaCartShopping className="text-orange-500" /> Your Cart ({cartCount})
            </h2>
            <button
              onClick={() => setIsCartOpen(false)}
              className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <IoClose className="text-2xl" />
            </button>
          </div>

          {/* Modal Items List Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-2">
                <FaCartShopping className="text-5xl opacity-40 text-gray-300" />
                <p className="text-sm">Your shopping cart is empty.</p>
              </div>
            ) : (
              cartItems.map((item, index) => {
                const unitPrice = item.price;
                const itemTotal = unitPrice * item.quantity;

                return (
                  <div
                    key={index}
                    className="flex items-center gap-4 bg-gray-50 p-3 rounded-lg border border-gray-100"
                  >
                    <div className="relative w-16 h-16 shrink-0 bg-white rounded border border-gray-200 overflow-hidden flex items-center justify-center">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={50}
                        height={50}
                        className="object-contain"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-800 truncate">
                        {item.name}
                      </h3>

                      <p className="text-xs text-gray-500">
                        Weight: {item.variant.quantity}
                      </p>

                      <p className="text-xs text-gray-500">
                        Qty: {item.quantity}
                      </p>

                      <p className="text-xs text-gray-500">
                        Unit Price: ৳{unitPrice.toLocaleString()}
                      </p>

                      <p className="text-sm font-semibold text-orange-500 mt-1">
                        ৳{itemTotal.toLocaleString()}
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        removeFromCart(item._id, item.variant.quantity)
                      }
                      className="text-gray-400 hover:text-red-500 p-1 transition-colors text-xs"
                    >
                      Remove
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Modal Footer (Checkout Actions) */}
          {cartItems.length > 0 && (
            <div className="border-t border-gray-100 p-4 bg-gray-50/50 space-y-4">
              <div className="flex justify-between items-center text-base font-semibold text-gray-800">
                <span>Subtotal:</span>
                <span className="text-orange-500 text-lg">৳{totalPrice.toLocaleString()}</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="w-full border border-gray-300 text-gray-700 font-medium py-2.5 rounded-md text-sm text-center bg-white hover:bg-gray-50 transition-colors"
                >
                  Continue Shopping
                </button>
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full bg-orange-500 text-white font-medium py-2.5 rounded-md text-sm text-center hover:bg-[#e06600] transition-colors shadow-md block"
                >
                  Proceed
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Navbar;