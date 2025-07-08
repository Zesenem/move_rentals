import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { FaWhatsapp, FaBars, FaTimes, FaShoppingCart } from "react-icons/fa";
import { useCartStore } from '../store/cartStore';
import Logo from "./Logo";
import Button from "./Button";

function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const itemCount = useCartStore((state) => state.getItemCount());

  const scrollToFooter = () => {
    document.getElementById("footer-section")?.scrollIntoView({ behavior: "smooth" });
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinkClasses = "font-semibold py-2 px-3 transition-colors duration-300 rounded-md";

  const getNavLinkStyle = ({ isActive }) =>
    `${navLinkClasses} ${isActive ? "bg-cloud text-phantom" : "text-steel hover:bg-arsenic"}`;
  
  const navLinks = (
    <>
      <NavLink to="/" className={getNavLinkStyle} onClick={() => setIsMenuOpen(false)}>
        Our Fleet
      </NavLink>
      <button onClick={scrollToFooter} className={`${navLinkClasses} text-steel hover:bg-arsenic`}>
        About Us
      </button>
      <NavLink 
        to="/checkout" 
        className={`${navLinkClasses} text-steel hover:bg-arsenic flex items-center gap-2`}
        onClick={() => setIsMenuOpen(false)}
      >
        <FaShoppingCart />
        Cart
        {itemCount > 0 && (
          <span className="bg-cloud text-phantom text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {itemCount}
          </span>
        )}
      </NavLink>
      <Button 
        as="a"
        href="https://wa.me/351920016794"
        target="_blank" 
        rel="noopener noreferrer"
        variant="primary" 
        icon={FaWhatsapp}
      >
        Contact Us
      </Button>
    </>
  );

  return (
    <header className={`sticky top-0 z-50 transition-colors duration-300 ${isScrolled || isMenuOpen ? "bg-phantom shadow-lg" : "bg-transparent"}`}>
      <nav className="container mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
        <Link to="/" onClick={() => setIsMenuOpen(false)}>
          <Logo className="h-12 w-auto text-cloud" />
        </Link>
        <div className="hidden md:flex items-center space-x-2">{navLinks}</div>
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-cloud p-2">
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </nav>
      {isMenuOpen && (
        <div className="md:hidden bg-phantom">
          <div className="px-4 pt-2 pb-4 space-y-2 flex flex-col items-center">
            {navLinks}
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
