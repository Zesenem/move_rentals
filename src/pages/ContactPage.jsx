import { Helmet } from 'react-helmet-async';
import { FaWhatsapp, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const ContactInfoCard = ({ title, children }) => (
  <div className="bg-arsenic p-6 rounded-lg flex items-start gap-4">
    <div>
      <h3 className="text-xl font-bold text-cloud">{title}</h3>
      <div className="text-space mt-1">{children}</div>
    </div>
  </div>
);

function ContactPage() {
    const address = "Rua Carlos Reis 63, Lisboa";
    const mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(address)}`;
    const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    return (
        <>
            <Helmet>
                <title>Contact Us | Move Rentals</title>
                <meta name="description" content="Get in touch with Move Rentals. Find our address, contact details, and location in Lisbon." />
            </Helmet>
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-cloud mb-8 text-center">Contact Us</h1>
                    <p className="text-center text-lg text-space mb-12">
                        Have a question or need assistance? We're here to help.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                        <ContactInfoCard icon={FaMapMarkerAlt} title="Our Location">
                            <p>{address}</p>
                            <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline mt-2 inline-block">
                                Get Directions
                            </a>
                        </ContactInfoCard>
                        <ContactInfoCard icon={FaWhatsapp} title="WhatsApp">
                            <p>+351 920 016 794</p>
                            <a href="https://wa.me/351920016794" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline mt-2 inline-block">
                                Send a Message
                            </a>
                        </ContactInfoCard>
                        <ContactInfoCard icon={FaEnvelope} title="Email">
                            <p>move@move-rentals.com</p>
                             <a href="mailto:move@move-rentals.com" className="text-emerald-400 hover:underline mt-2 inline-block">
                                Send an Email
                            </a>
                        </ContactInfoCard>
                    </div>

                    <div className="w-full aspect-video rounded-lg overflow-hidden border-2 border-graphite/50">
                        <iframe
                            src={`https://www.google.com/maps/embed/v1/place?key=${googleMapsApiKey}&q=${encodeURIComponent(address)}`}
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Move Rentals Location"
                        ></iframe>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ContactPage;

