import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { FaWhatsapp, FaBars, FaTimes, FaShoppingCart } from "react-icons/fa";
import { useCartStore } from "../store/cartStore";
import Logo from "./Logo";
import Button from "./Button";

function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const itemCount = useCartStore((state) => state.getItemCount());

  const navItems = [
    { name: "Our Fleet", to: "/" },
    {
      name: "About Us",
      type: "button",
      action: () =>
        document.getElementById("footer-section")?.scrollIntoView({ behavior: "smooth" }),
    },
    { name: "Contact", to: "/contact" },
  ];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll, { passive: true });
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => (document.body.style.overflow = "unset");
  }, [isMenuOpen]);

  const handleLinkClick = (action) => {
    if (action) action();
    setIsMenuOpen(false);
  };

  const navLinkClasses = "font-semibold py-2 px-3 transition-colors duration-300 rounded-md";
  const getNavLinkStyle = ({ isActive }) =>
    `${navLinkClasses} ${isActive ? "bg-cloud text-phantom" : "text-steel hover:bg-arsenic"}`;

  const navLinks = (
    <>
      {navItems.map((item) =>
        item.type === "button" ? (
          <button
            key={item.name}
            onClick={() => handleLinkClick(item.action)}
            className={`${navLinkClasses} text-steel hover:bg-arsenic`}
          >
            {item.name}
          </button>
        ) : (
          <NavLink
            key={item.name}
            to={item.to}
            className={getNavLinkStyle}
            onClick={() => handleLinkClick()}
          >
            {item.name}
          </NavLink>
        )
      )}
      <NavLink
        to="/checkout"
        className={`${getNavLinkStyle({ isActive: false })} flex items-center gap-2`}
        onClick={() => handleLinkClick()}
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
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled || isMenuOpen ? "bg-phantom shadow-lg" : "bg-transparent"
      }`}
    >
      <nav className="container mx-auto px-4 sm:px-6 flex justify-between items-center h-20">
        <Link to="/" className="h-full flex items-center" onClick={() => setIsMenuOpen(false)}>
          <Logo className="h-10 text-cloud" />
        </Link>
        <div className="hidden md:flex items-center space-x-2">{navLinks}</div>
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-cloud p-2"
            aria-controls="mobile-menu"
            aria-expanded={isMenuOpen}
          >
            <span className="sr-only">Open main menu</span>
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </nav>
      <div
        id="mobile-menu"
        className={`transition-all duration-500 ease-in-out md:hidden bg-phantom overflow-hidden ${
          isMenuOpen ? "max-h-screen" : "max-h-0"
        }`}
      >
        <div className="px-4 pt-2 pb-8 space-y-2 flex flex-col items-center">{navLinks}</div>
      </div>
    </header>
  );
}

export default Header;
