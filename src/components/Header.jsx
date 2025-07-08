import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FaWhatsapp } from 'react-icons/fa';
import Logo from './Logo'; // Assuming you still have the Logo.jsx component

function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const phoneNumber = '351920016794';
  const whatsappURL = `https://wa.me/${phoneNumber}?text=Hello!%20I'd%20like%20to%20know%20more%20about%20the%20motorcycle%20rentals.`;

  const scrollToFooter = () => {
    const footerSection = document.getElementById('footer-section');
    if (footerSection) {
      footerSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinkStyle = "font-semibold py-2 px-4 rounded-md transition-all duration-300 border";

  return (
    <header className={`sticky top-0 z-50 transition-colors duration-300 ${isScrolled ? 'bg-gradient-to-r from-phantom to-brand-black shadow-lg' : 'bg-transparent'}`}>
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/">
          {/* Using your custom Logo component is cleaner, assuming it's up to date */}
          <Logo className="h-12 w-auto text-cloud" />
        </Link>
        <div className="flex items-center space-x-2">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${navLinkStyle} ${isActive ? 'bg-cloud text-phantom border-cloud' : 'text-steel border-transparent hover:text-cloud hover:border-cloud'}`
            }
          >
            Our Fleet
          </NavLink>
          <button
            onClick={scrollToFooter}
            className={`${navLinkStyle} text-steel border-transparent hover:text-cloud hover:border-cloud`}
          >
            About Us
          </button>
          <a
            href={whatsappURL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 bg-cloud text-phantom font-bold py-2 px-4 rounded-md transition-all duration-300 hover:scale-105 hover:brightness-95"
          >
            <FaWhatsapp size={18} />
            <span className="hidden sm:inline">Contact Us</span>
          </a>
        </div>
      </nav>
    </header>
  );
}

export default Header;