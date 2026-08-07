"use client";

import {
  FaWhatsapp,
  FaPhoneAlt,
  FaFacebookMessenger,
} from "react-icons/fa";
import { TfiHeadphoneAlt } from "react-icons/tfi";

export default function SpeedDial() {
  const phone = "8801822350799";

  const message =
    "Hello! I would like to know more about your products.";

  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(
    message
  )}`;

  const messengerUrl = "https://m.me/mangomartbd11"; // Replace if different
  const callUrl = `tel:+${phone}`;

  return (
    <div className="fab fab-flower fixed bottom-5 right-5 z-50">
      {/* Main Button */}
      <button
        tabIndex={0}
        role="button"
        className="btn btn-circle bg-orange-500 border-orange-500 text-white hover:bg-orange-600 shadow-xl"
      >
        <TfiHeadphoneAlt className="text-xl" />
      </button>

      {/* WhatsApp */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
        className="btn btn-circle bg-green-500 border-green-500 text-white hover:bg-green-600 shadow-lg"
      >
        <FaWhatsapp className="text-2xl" />
      </a>

      {/* Messenger */}
      <a
        href={messengerUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Messenger"
        className="btn btn-circle bg-blue-500 border-blue-500 text-white hover:bg-blue-600 shadow-lg"
      >
        <FaFacebookMessenger className="text-2xl" />
      </a>

      {/* Call */}
      <a
        href={callUrl}
        aria-label="Call"
        className="btn btn-circle bg-orange-500 border-orange-500 text-white hover:bg-orange-600 shadow-lg"
      >
        <FaPhoneAlt />
      </a>
    </div>
  );
}