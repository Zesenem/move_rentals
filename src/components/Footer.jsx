import { FaWhatsapp, FaInstagram, FaEnvelope } from "react-icons/fa";
import Logo from "./Logo";

const currentYear = new Date().getFullYear();
const phoneNumber = "351920016794";
const whatsappURL = `https://wa.me/${phoneNumber}`;
const emailAddress = "move@move-rentals.com";
const instagramURL = "https://www.instagram.com/move.rentals/";

const SocialLink = ({ href, ariaLabel, icon }) => {
  const IconComponent = icon;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className="text-steel hover:text-cloud hover:scale-110 transform transition-transform duration-300"
    >
      <IconComponent size={24} />
    </a>
  );
};

function Footer() {
  return (
    <footer id="footer-section" className="bg-phantom mt-12 border-t border-arsenic">
      <div className="container mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
          <div className="h-10">
            <Logo className="h-full w-auto text-graphite" />
          </div>
          <div className="text-center md:flex-1">
            <p className="text-sm text-graphite">
              &copy; {currentYear} Move Rentals. All Rights Reserved.
            </p>
          </div>
          <div className="flex items-center space-x-6">
            <SocialLink href={whatsappURL} ariaLabel="WhatsApp" icon={FaWhatsapp} />
            <SocialLink href={instagramURL} ariaLabel="Instagram" icon={FaInstagram} />
            <SocialLink href={`mailto:${emailAddress}`} ariaLabel="Email" icon={FaEnvelope} />
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
