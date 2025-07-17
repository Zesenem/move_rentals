import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom"; // Import useNavigate
import { FaBars, FaTimes, FaShoppingCart } from "react-icons/fa";
import { useCartStore } from "../store/cartStore";
import Logo from "./Logo";
import Button from "./Button";

function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const itemCount = useCartStore((state) => state.getItemCount());
  const navigate = useNavigate(); 

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  const closeMenu = (action) => {
    setIsMenuOpen(false);
    if (action) action();
  };

  const handleOurFleetClick = () => {
    closeMenu();
    if (window.location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document.getElementById("fleet-section")?.scrollIntoView({ behavior: "smooth" });
      }, 100); 
    } else {
      document.getElementById("fleet-section")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const navItems = [
    {
      name: "Our Fleet",
      onClick: handleOurFleetClick, 
    },
    { name: "Contact", to: "/contact" },
  ];

  const NavLinks = () => (
    <>
      {navItems.map((item) =>
        item.onClick ? ( 
          <button
            key={item.name}
            onClick={item.onClick} 
            className="rounded-md px-3 py-2 font-semibold text-steel transition-colors duration-300 hover:bg-arsenic"
          >
            {item.name}
          </button>
        ) : (
          <NavLink
            key={item.name}
            to={item.to}
            onClick={() => closeMenu()}
            className={({ isActive }) =>
              `rounded-md px-3 py-2 font-semibold transition-colors duration-300 ${
                isActive ? "bg-cloud text-phantom" : "text-steel hover:bg-arsenic"
              }`
            }
          >
            {item.name}
          </NavLink>
        )
      )}
      <NavLink
        to="/checkout"
        onClick={() => closeMenu()}
        className={({ isActive }) =>
          `flex items-center gap-2 rounded-md px-3 py-2 font-semibold transition-colors duration-300 ${
            isActive ? "bg-cloud text-phantom" : "text-steel hover:bg-arsenic"
          }`
        }
      >
        <FaShoppingCart />
        <span>Cart</span>
        {itemCount > 0 && (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cloud text-xs font-bold text-phantom">
            {itemCount}
          </span>
        )}
      </NavLink>
    </>
  );

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled || isMenuOpen ? "bg-phantom shadow-lg" : "bg-transparent"
      }`}
    >
      <nav className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex h-full items-center" onClick={() => closeMenu()}>
          <Logo className="h-10 text-cloud" />
        </Link>

        <div className="hidden items-center space-x-2 md:flex">
          <NavLinks />
        </div>

        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-cloud"
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </nav>

      <div
        id="mobile-menu"
        className={`overflow-hidden bg-phantom transition-all duration-300 ease-in-out md:hidden ${
          isMenuOpen ? "max-h-screen" : "max-h-0"
        }`}
      >
        <div className="flex flex-col items-center gap-4 px-4 pt-2 pb-8">
          <NavLinks />
        </div>
      </div>
    </header>
  );
}

export default Header;
