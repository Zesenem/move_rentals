import { Helmet } from "react-helmet-async";
import { FaWhatsapp, FaEnvelope, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import OpeningHours from "../components/OpeningHours"; 

const ContactInfoCard = ({ icon, title, children }) => {
  const IconComponent = icon;
  return (
    <div className="flex items-start gap-4 rounded-lg bg-arsenic p-6 h-full">
      <IconComponent className="mt-1 text-2xl text-cloud flex-shrink-0" />
      <div>
        <h3 className="text-xl font-bold text-cloud">{title}</h3>
        <div className="mt-1 text-space">{children}</div>
      </div>
    </div>
  );
};

const contactInfo = {
  address: "Rua da Beneficência 44D, Lisboa, Portugal",
  phone: "+351 920 016 794",
  email: "move@move-rentals.com",
  get whatsappUrl() {
    return `https://wa.me/${this.phone.replace(/\s/g, "")}`;
  },
  get directionsUrl() {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(this.address)}`;
  },
};

function ContactPage() {
  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const embedMapUrl = `https://www.google.com/maps/embed/v1/place?key=${googleMapsApiKey}&q=${encodeURIComponent(
    contactInfo.address
  )}`;

  const contactMethods = [
    {
      icon: FaMapMarkerAlt,
      title: "Our Location",
      content: (
        <>
          <p>{contactInfo.address}</p>
          <a
            href={contactInfo.directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-emerald-400 hover:underline"
          >
            Get Directions
          </a>
        </>
      ),
    },
    {
      icon: FaClock,
      title: "Opening Hours",
      content: <OpeningHours />,
    },
    {
      icon: FaWhatsapp,
      title: "WhatsApp",
      content: (
        <>
          <p>{contactInfo.phone}</p>
          <a
            href={contactInfo.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-emerald-400 hover:underline"
          >
            Send a Message
          </a>
        </>
      ),
    },
    {
      icon: FaEnvelope,
      title: "Email",
      content: (
        <>
          <p>{contactInfo.email}</p>
          <a
            href={`mailto:${contactInfo.email}`}
            className="mt-2 inline-block text-emerald-400 hover:underline"
          >
            Send an Email
          </a>
        </>
      ),
    },
  ];

  return (
    <>
      <Helmet>
        <title>Contact Us | Move Rentals</title>
        <meta
          name="description"
          content="Get in touch with Move Rentals. Find our address, contact details, and location in Lisbon."
        />
      </Helmet>
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-8 text-center text-4xl font-extrabold text-cloud sm:text-5xl">
            Contact Us
          </h1>
          <p className="mb-12 text-center text-lg text-space">
            Have a question or need assistance? We're here to help.
          </p>

          <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {contactMethods.map((method) => (
              <ContactInfoCard key={method.title} icon={method.icon} title={method.title}>
                {method.content}
              </ContactInfoCard>
            ))}
          </div>

          <div className="aspect-video w-full overflow-hidden rounded-lg border-2 border-graphite/50">
            <iframe
              src={embedMapUrl}
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
