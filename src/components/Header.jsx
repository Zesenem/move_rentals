import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { FaWhatsapp } from "react-icons/fa";
import Logo from "./Logo";

function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const phoneNumber = "351920016794";
  const whatsappURL = `https://wa.me/${phoneNumber}?text=Hello!%20I'd%20like%20to%20know%20more%20about%20the%20motorcycle%20rentals.`;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-brand-black/95 border-b border-white/10 backdrop-blur-sm shadow-lg"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link to="/">
          <Logo className="h-20 w-auto text-white" />
        </Link>

        <div className="flex items-center space-x-6 sm:space-x-8">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `animated-link font-semibold pb-1 ${
                isActive ? "active text-brand-orange" : "text-white/70 hover:text-white"
              }`
            }
          >
            Our Fleet
          </NavLink>
          <a
            href={whatsappURL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 bg-brand-orange text-white font-bold py-3 px-5 rounded-lg transition-all duration-300 hover:scale-105 hover:brightness-95"
          >
            <FaWhatsapp size={20} />
            <span className="hidden sm:inline">Contact Us</span>
          </a>
        </div>
      </nav>
    </header>
  );
}

export default Header;
