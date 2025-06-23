import { FaWhatsapp, FaInstagram, FaEnvelope } from "react-icons/fa";

function Footer() {
  const currentYear = new Date().getFullYear();
  const phoneNumber = "351920016794";
  const whatsappURL = `https://wa.me/${phoneNumber}`;
  const emailAddress = "move@move-rentals.com";

  return (
    <footer className="bg-brand-black border-t border-white/10 mt-12">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <p className="text-sm text-white/50 order-last sm:order-first">
            &copy; {currentYear} Move LX. All Rights Reserved.
          </p>

          <div className="flex space-x-6">
            <a
              href={whatsappURL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="text-white/70 hover:text-brand-orange hover:scale-110 transform transition-all duration-300"
            >
              <FaWhatsapp size={24} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-white/70 hover:text-brand-orange hover:scale-110 transform transition-all duration-300"
            >
              <FaInstagram size={24} />
            </a>
            <a
              href={`mailto:${emailAddress}`}
              aria-label="Email"
              className="text-white/70 hover:text-brand-orange hover:scale-110 transform transition-all duration-300"
            >
              <FaEnvelope size={24} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
