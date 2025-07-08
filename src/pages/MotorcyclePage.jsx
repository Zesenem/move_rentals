import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import AccordionItem from '../components/AccordionItem';
import ImageCarousel from '../components/ImageCarousel';
import Modal from '../components/Modal';
import { 
  FaIdCard, FaCreditCard, FaCheckCircle, FaWhatsapp, FaShieldAlt, FaUsers, 
  FaInfinity, FaLock, FaRoad, FaPlaneDeparture 
} from 'react-icons/fa';
import { 
  PiSteeringWheelFill, PiMotorcycleFill, PiPantsFill, PiPercentFill,
  PiCoatHangerBold 
} from 'react-icons/pi';
import { 
  GiFullMotorcycleHelmet, GiGloves, GiLeatherBoot 
} from "react-icons/gi";
import { GrTag } from "react-icons/gr";

const iconMap = {
  "id-card": <FaIdCard className="text-steel mr-3 flex-shrink-0 text-lg" />,
  "license": <PiSteeringWheelFill className="text-steel mr-3 flex-shrink-0 text-lg" />,
  "credit-card": <FaCreditCard className="text-steel mr-3 flex-shrink-0 text-lg" />,
  "experience": <PiMotorcycleFill className="text-steel mr-3 flex-shrink-0 text-lg" />,
  "tax": <PiPercentFill className="text-green-400 mr-3 flex-shrink-0" />,
  "shield": <FaShieldAlt className="text-green-400 mr-3 flex-shrink-0" />,
  "users": <FaUsers className="text-green-400 mr-3 flex-shrink-0" />,
  "road": <FaRoad className="text-green-400 mr-3 flex-shrink-0" />,
  "infinity": <FaInfinity className="text-green-400 mr-3 flex-shrink-0" />,
  "helmet": <GiFullMotorcycleHelmet className="text-steel mr-3 flex-shrink-0 text-lg" />,
  "lock": <FaLock className="text-green-400 mr-3 flex-shrink-0" />,
  "gloves": <GiGloves className="text-steel mr-3 flex-shrink-0 text-lg" />,
  "jacket": <PiCoatHangerBold className="text-steel mr-3 flex-shrink-0 text-lg" />,
  "trousers": <PiPantsFill className="text-steel mr-3 flex-shrink-0 text-lg" />,
  "boots": <GiLeatherBoot className="text-steel mr-3 flex-shrink-0 text-lg" />,
  "toll": <GrTag className="text-steel mr-3 flex-shrink-0 text-lg" />,
  "delivery": <PiMotorcycleFill className="text-steel mr-3 flex-shrink-0 text-lg" />,
  "airport": <FaPlaneDeparture className="text-steel mr-3 flex-shrink-0 text-lg" />,
};

function MotorcyclePage() {
  const { slug } = useParams();
  const [bike, setBike] = useState(null);
  const [commonData, setCommonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  if (loading) return <p className="text-center text-space py-20">Loading Details...</p>;
  if (error) return <p className="text-center text-red-500 py-20">Error: {error}</p>;
  if (!bike || !commonData) return null;

  return (
    <>
      <div className="py-12">
        <Link to="/" className="text-steel hover:text-cloud mb-8 inline-block">&larr; Back to Our Fleet</Link>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 mb-12">
          <div className="w-full aspect-video">
            <ImageCarousel images={bike.image_urls} />
          </div>
          
          <div>
            <h1 className="text-4xl font-extrabold text-cloud tracking-tight">{bike.name}</h1>
            <p className="text-2xl font-bold text-steel mt-2">€{bike.price_per_day.toFixed(2)} / day</p>
            <p className="mt-4 text-space">{bike.description}</p>
            <div className="mt-8">
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full text-center bg-cloud text-phantom font-bold py-4 px-8 rounded-lg text-lg hover:brightness-95 transition-all duration-300 inline-flex justify-center items-center gap-3"
              >
                Book Now
              </button>
            </div>
            <div className="mt-10">
              <AccordionItem title="Technical Features">
                <ul className="text-base space-y-1">{bike.technical_features.map((feature, index) => (<li key={index} className="flex justify-between py-2 border-b border-graphite/50"> <span className="text-space">{feature.label}:</span> <span className="font-semibold text-cloud text-right">{feature.value}</span> </li>))}</ul>
              </AccordionItem>
              <AccordionItem title="Optional Extras">
                <ul className="text-base space-y-3"><li className="p-3 bg-arsenic/50 rounded-md"><span className="font-semibold text-cloud">{bike.extras_specific.item}:</span><span className="block text-space mt-1">{bike.extras_specific.price}</span></li>{commonData.extras.map((extra, index) => (<li key={index} className="flex items-center"> {iconMap[extra.icon]} <div> <span className="font-semibold text-cloud">{extra.item}:</span> <span className="block text-space text-sm">{extra.price}</span> </div> </li>))}</ul>
              </AccordionItem>
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2">
          <div className="grid grid-cols-1 md:grid-cols-1 ">
            <AccordionItem title="Included in Rental">
              <p className="mb-4 text-sm text-steel">Security Deposit: <span className="font-semibold text-cloud">€{bike.security_deposit}</span></p>
              <ul className="text-base space-y-2.5 text-steel">{commonData.included.map((item, index) => (<li key={index} className="flex items-center"> {iconMap[item.icon] || <FaCheckCircle className="text-green-400 mr-3 flex-shrink-0" />} {item.item} </li>))}</ul>
            </AccordionItem>
            <AccordionItem title="Requirements">
               <ul className="text-base space-y-2.5 text-steel">{commonData.requirements.map((req, index) => (<li key={index} className="flex items-center"> {iconMap[req.icon]} {req.item} </li>))}</ul>
            </AccordionItem>
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <iframe
          title={`${bike.name} Booking`}
          src={bike.booking_url} 
          style={{ width: '100%', height: '80vh', border: 'none' }}
        >
        </iframe>
      </Modal>
    </>
  );
}

export default MotorcyclePage;