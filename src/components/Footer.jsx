import { Link } from "react-router-dom";
import { FaWhatsapp, FaInstagram, FaEnvelope } from "react-icons/fa";
import OpeningHours from "./OpeningHours";

const contactInfo = {
  email: "move@move-rentals.com",
  whatsappUrl: "https://wa.me/351920016794",
  instagramUrl: "https://www.instagram.com/move.rentals/",
};

const quickLinks = [
  { name: "Our Fleet", to: "/" },
  { name: "Contact Us", to: "/contact" },
  { name: "Terms & Conditions", to: "/terms-and-conditions" },
  { name: "Privacy Policy", to: "/privacy-policy" },
];

const SocialLink = ({ href, ariaLabel, icon }) => {
  const IconComponent = icon;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className="text-steel transition-transform duration-300 hover:scale-110 hover:text-cloud"
    >
      <IconComponent size={22} />
    </a>
  );
};

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="footer-section" className="relative z-10 mt-20 bg-phantom">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-10 py-12 text-center md:grid-cols-3 md:text-left">
          <div className="md:col-span-1">
            <h3 className="mb-4 text-lg font-bold text-steel">About Us</h3>
            <div className="mx-auto max-w-xs space-y-4 text-space md:mx-0">
              <p>
                MOVE is Lisbon's go-to scooter rental company - combining unbeatable prices,
                friendly service, and the freedom to ride your way.
              </p>

              <br />

              <p>
                <strong>Your ride. Your rules. Lisbon awaits.</strong>
              </p>
            </div>
          </div>

          <div className="md:col-span-1">
            <h3 className="mb-4 text-lg font-bold text-steel">Quick Links</h3>
            <ul className="space-y-3 text-space">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  {link.href ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-colors hover:text-cloud hover:underline underline-offset-4"
                    >
                      {link.name}
                    </a>
                  ) : (
                    <Link
                      to={link.to}
                      className="transition-colors hover:text-cloud hover:underline underline-offset-4"
                    >
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-1">
            <h3 className="mb-4 text-lg font-bold text-steel">Opening Hours</h3>
            <div className="flex justify-center md:justify-start">
              <OpeningHours />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-arsenic py-6 sm:flex-row">
          <div className="flex items-center space-x-6">
            <SocialLink href={contactInfo.whatsappUrl} ariaLabel="WhatsApp" icon={FaWhatsapp} />
            <SocialLink href={contactInfo.instagramUrl} ariaLabel="Instagram" icon={FaInstagram} />
            <SocialLink href={`mailto:${contactInfo.email}`} ariaLabel="Email" icon={FaEnvelope} />
          </div>
          <Link to="/" aria-label="Back to home">
            <img
              src="/32x32.png"
              alt="Move Rentals Symbol"
              className="h-8 w-auto filter invert transition-opacity hover:opacity-80"
            />
          </Link>
          <p className="order-first text-sm text-graphite sm:order-last">
            &copy; {currentYear} Move Rentals
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
