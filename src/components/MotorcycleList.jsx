import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaTachometerAlt } from 'react-icons/fa';
import { PiSteeringWheelFill, PiGasCanFill } from 'react-icons/pi';
import { MdConstruction } from 'react-icons/md';

const glanceIconMap = {
  "engine": <FaTachometerAlt />,
  "license": <PiSteeringWheelFill />,
  "gas": <PiGasCanFill />,
};

function MotorcycleList() {
  const [motorcycles, setMotorcycles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/db.json') 
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then(data => {
        setMotorcycles(data.motorcycles);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center text-space py-20">Loading motorcycles...</p>;
  if (error) return <p className="text-center text-red-500 py-20">Error fetching data: {error.message}</p>;

  return (
    <div className="flex flex-wrap justify-center gap-6">
      {motorcycles.map((bike, index) => (
        <Link to={`/motorcycle/${bike.slug}`} key={bike.id} className="block card-animate" style={{ animationDelay: `${index * 150}ms` }}>
          <div className="w-full max-w-lg bg-arsenic border border-graphite/50 rounded-lg shadow-lg flex flex-col overflow-hidden h-full transition-all duration-300 hover:border-cloud/50 hover:shadow-lg hover:shadow-cloud/20">
            <div className="aspect-video bg-phantom">
              <img 
                src={bike.image_urls[0]} 
                alt={bike.name} 
                className="w-full h-full object-cover transition-opacity duration-500 opacity-0"
                onLoad={(e) => e.target.style.opacity = 1}
              />
            </div>
            <div className="p-5 flex flex-col flex-grow">
              <h3 className="text-xl font-bold tracking-tight text-cloud h-14">{bike.name}</h3>
              <div className="flex items-center space-x-4 my-3 text-space">
                {bike.quick_glance?.map((stat) => (
                  <div key={stat.label} className="flex items-center text-sm gap-2">
                    {glanceIconMap[stat.icon]}
                    <span>{stat.label}</span>
                  </div>
                ))}
              </div>
              <div className="mt-auto pt-4 space-y-4">
                <div className="flex items-baseline text-cloud">
                  <span className="text-3xl font-bold tracking-tight">€{bike.price_per_day.toFixed(2)}</span>
                  <span className="text-sm font-semibold ml-1 text-space">/day</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${bike.status === 'available' ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
                    {bike.status.charAt(0).toUpperCase() + bike.status.slice(1)}
                  </span>
                  <span className="bg-cloud text-phantom font-bold py-2 px-4 rounded-md text-sm">
                    Book Now
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}

      <div 
        className="w-full max-w-lg border-2 border-dashed border-graphite/60 rounded-lg flex flex-col items-center justify-center p-8 text-center h-full card-animate" 
        style={{ animationDelay: `${motorcycles.length * 150}ms` }}
      >
        <MdConstruction className="text-5xl text-space" />
        <h3 className="mt-4 text-2xl font-bold text-steel">More Bikes</h3>
        <p className="mt-2 text-space">Coming Soon</p>
      </div>
    </div>
  );
}

export default MotorcycleList;