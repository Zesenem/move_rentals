import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import AccordionItem from '../components/AccordionItem';

function MotorcyclePage() {
  const { slug } = useParams();

  const [bike, setBike] = useState(null);
  const [commonData, setCommonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/move_rentals/db.json');
        
        if (!response.ok) throw new Error('Could not fetch the data file.');
        const data = await response.json();
        const currentBike = data.motorcycles.find(m => m.slug === slug);
        if (!currentBike) throw new Error('Motorcycle not found');

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

  return (
    <div className="py-12">
      <Link to="/" className="text-brand-orange hover:text-orange-400 mb-8 inline-block">&larr; Back to Our Fleet</Link>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="w-full">
          <img src={`/move_rentals${bike.image_url}`} alt={bike.name} className="w-full rounded-lg shadow-xl" />
        </div>
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">{bike.name}</h1>
          <p className="text-2xl font-bold text-brand-orange mt-2">€{bike.price_per_day.toFixed(2)} / day</p>
          <p className="mt-4 text-slate-300">{bike.description}</p>
          <div className="mt-8">
            <a href="https://calendly.com/" target="_blank" rel="noopener noreferrer" className="w-full text-center bg-brand-orange text-white font-bold py-4 px-8 rounded-lg text-lg hover:bg-brand-orange-dark transition-all duration-300 inline-block">
              Check Availability & Rent
            </a>
          </div>
          <div className="mt-10">
            <AccordionItem title="Technical Features"><ul>{bike.technical_features.map((feature, index) => (<li key={index} className="flex justify-between py-1"><span>{feature.label}:</span><span className="font-bold text-white">{feature.value}</span></li>))}</ul></AccordionItem>
            <AccordionItem title="Included in Rental"><p className="mb-4">Security Deposit: <span className="font-bold text-white">€{bike.security_deposit}</span></p><ul>{commonData.included.map((item, index) => (<li key={index} className="flex items-center py-1">&#10003; {item.item}</li>))}</ul></AccordionItem>
            <AccordionItem title="Optional Extras"><ul className="space-y-2"><li><span className="font-bold text-white">{bike.extras_specific.item}:</span><span className="block text-sm">{bike.extras_specific.price}</span></li>{commonData.extras.map((extra, index) => (<li key={index}><span className="font-bold text-white">{extra.item}:</span><span className="block text-sm">{extra.price}</span></li>))}</ul></AccordionItem>
            <AccordionItem title="Requirements"><ul>{commonData.requirements.map((req, index) => (<li key={index} className="flex items-center py-1">&#8227; {req.item}</li>))}</ul></AccordionItem>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MotorcyclePage;