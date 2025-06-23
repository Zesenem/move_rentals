import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import AccordionItem from "../components/AccordionItem";
import { FaIdCard, FaCreditCard, FaCheckCircle, FaWhatsapp } from "react-icons/fa";
import { PiSteeringWheelFill } from "react-icons/pi";

const iconMap = {
  "id-card": <FaIdCard className="text-brand-orange mr-3 flex-shrink-0 text-lg" />,
  license: <PiSteeringWheelFill className="text-brand-orange mr-3 flex-shrink-0 text-lg" />,
  "credit-card": <FaCreditCard className="text-brand-orange mr-3 flex-shrink-0 text-lg" />,
};

function MotorcyclePage() {
  const { slug } = useParams();
  const [bike, setBike] = useState(null);
  const [commonData, setCommonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const phoneNumber = "351920016794";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/db.json");
        if (!response.ok) throw new Error("Could not fetch the data file.");
        const data = await response.json();
        const currentBike = data.motorcycles.find((m) => m.slug === slug);
        if (!currentBike) throw new Error("Motorcycle not found");
        setBike(currentBike);
        setCommonData(data.common_data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  if (loading) return <p className="text-center text-slate-300 py-20">Loading Details...</p>;
  if (error) return <p className="text-center text-red-500 py-20">Error: {error}</p>;
  if (!bike || !commonData) return null;

  const whatsappMessage = `Hello! I'm interested in booking the ${bike.name}.`;
  const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="py-12">
      <Link to="/" className="text-brand-orange hover:text-orange-400 mb-8 inline-block">
        &larr; Back to Our Fleet
      </Link>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
        <div className="w-full">
          <img
            src={`${bike.image_url}`}
            alt={bike.name}
            className="w-full rounded-lg shadow-xl"
          />
        </div>
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">{bike.name}</h1>
          <p className="text-2xl font-bold text-brand-orange mt-2">
            €{bike.price_per_day.toFixed(2)} / day
          </p>
          <p className="mt-4 text-slate-300">{bike.description}</p>
          <div className="mt-8">
            <a
              href={whatsappURL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-center bg-brand-orange text-white font-bold py-4 px-8 rounded-lg text-lg hover:brightness-95 transition-all duration-300 inline-flex justify-center items-center gap-3"
            >
              <FaWhatsapp size={20} />
              Book via WhatsApp
            </a>
          </div>
          <div className="mt-10">
            <AccordionItem title="Technical Features">
              <ul className="text-base space-y-1">
                {bike.technical_features.map((feature, index) => (
                  <li key={index} className="flex justify-between py-2 border-b border-white/10">
                    {" "}
                    <span className="text-slate-300">{feature.label}:</span>{" "}
                    <span className="font-semibold text-white text-right">{feature.value}</span>{" "}
                  </li>
                ))}
              </ul>
            </AccordionItem>
            <AccordionItem title="Included in Rental">
              <p className="mb-4 text-base">
                Security Deposit:{" "}
                <span className="font-semibold text-white">€{bike.security_deposit}</span>
              </p>
              <ul className="text-base space-y-2.5">
                {commonData.included.map((item, index) => (
                  <li key={index} className="flex items-center">
                    <FaCheckCircle className="text-green-500 mr-3 flex-shrink-0" /> {item.item}
                  </li>
                ))}
              </ul>
            </AccordionItem>
            <AccordionItem title="Optional Extras">
              <ul className="text-base space-y-3">
                <li className="p-3 bg-white/5 rounded-md">
                  <span className="font-semibold text-white">{bike.extras_specific.item}:</span>
                  <span className="block text-slate-300 mt-1">{bike.extras_specific.price}</span>
                </li>
                {commonData.extras.map((extra, index) => (
                  <li key={index}>
                    <span className="font-semibold text-white">{extra.item}:</span>
                    <span className="block text-slate-300 mt-1">{extra.price}</span>
                  </li>
                ))}
              </ul>
            </AccordionItem>
            <AccordionItem title="Requirements">
              <ul className="text-base space-y-2.5">
                {commonData.requirements.map((req, index) => (
                  <li key={index} className="flex items-center">
                    {iconMap[req.icon]}
                    {req.item}
                  </li>
                ))}
              </ul>
            </AccordionItem>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MotorcyclePage;
