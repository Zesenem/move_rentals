import { Link } from "react-router-dom";
import { FaWhatsapp, FaInstagram, FaEnvelope } from "react-icons/fa";

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
            <IconComponent size={22} />
        </a>
    );
};

const quickLinks = [
    { name: 'Our Fleet', to: '/' },
    { name: 'Contact Us', href: whatsappURL, isExternal: true },
    { name: 'View Cart', to: '/checkout' },
];

function Footer() {
    return (
        <footer id="footer-section" className="bg-phantom mt-20 relative z-10">
            <div className="container mx-auto px-4 sm:px-6">
                <div className="py-12 flex flex-col md:flex-row text-center md:text-left justify-between gap-8">
                    <div>
                        <h3 className="font-bold text-lg text-steel mb-4">About Us</h3>
                        <div className="text-space max-w-xs mx-auto md:mx-0">
                           <p>MOVE is Lisbon's go-to scooter rental company - combining unbeatable prices, friendly service, and the freedom to ride your way.</p>
                           <br/>
                           <p><b>Your ride. Your rules. Lisbon awaits.</b></p>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-steel mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-space">
                            {quickLinks.map((link) => (
                                <li key={link.name}>
                                    {link.isExternal ? (
                                        <a href={link.href} target="_blank" rel="noopener noreferrer" className="hover:text-cloud transition-colors">{link.name}</a>
                                    ) : (
                                        <Link to={link.to} className="hover:text-cloud transition-colors">{link.name}</Link>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 border-t border-arsenic">
                    <div className="flex items-center space-x-6">
                        <SocialLink href={whatsappURL} ariaLabel="WhatsApp" icon={FaWhatsapp} />
                        <SocialLink href={instagramURL} ariaLabel="Instagram" icon={FaInstagram} />
                        <SocialLink href={`mailto:${emailAddress}`} ariaLabel="Email" icon={FaEnvelope} />
                    </div>
                    <Link to="/" aria-label="Back to top">
                        <img 
                            src="/images/favicon.png" 
                            alt="Move Rentals Symbol" 
                            className="h-8 w-auto transition-opacity hover:opacity-80 filter invert brightness-0" 
                        />
                    </Link>
                    <p className="text-sm text-graphite order-first sm:order-last">
                        &copy; {currentYear} Move Rentals
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
