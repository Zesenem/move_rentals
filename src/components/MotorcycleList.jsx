import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaTachometerAlt } from "react-icons/fa";
import { PiSteeringWheelFill, PiGasCanFill } from "react-icons/pi";

const glanceIconMap = {
  engine: <FaTachometerAlt />,
  license: <PiSteeringWheelFill />,
  gas: <PiGasCanFill />,
};

function MotorcycleList() {
  const [motorcycles, setMotorcycles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/db.json")
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then((data) => {
        setMotorcycles(data.motorcycles);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center text-white/70 py-20">Loading motorcycles...</p>;
  if (error)
    return <p className="text-center text-red-500 py-20">Error fetching data: {error.message}</p>;

  return (
    <div className="flex flex-wrap justify-center gap-8">
      {motorcycles.map((bike, index) => (
        <Link
          to={`/motorcycle/${bike.slug}`}
          key={bike.id}
          className="block card-animate"
          style={{ animationDelay: `${index * 150}ms` }}
        >
          <div className="w-full max-w-md bg-brand-black border border-white/10 rounded-lg shadow-lg flex flex-col overflow-hidden transition-all duration-300 hover:shadow-brand-orange/20 hover:border-brand-orange/50 h-full">
            <div className="aspect-video bg-black/20">
              <img
                src={`${bike.image_url}`}
                alt={bike.name}
                className="w-full h-full object-cover transition-opacity duration-500 opacity-0"
                onLoad={(e) => (e.target.style.opacity = 1)}
              />
            </div>
            <div className="p-5 flex flex-col flex-grow">
              <h3 className="text-xl font-bold tracking-tight text-white h-14">{bike.name}</h3>
              <div className="flex items-center space-x-4 my-3 text-white/60">
                {bike.quick_glance?.map((stat) => (
                  <div key={stat.label} className="flex items-center text-sm gap-2">
                    {glanceIconMap[stat.icon]}
                    <span>{stat.label}</span>
                  </div>
                ))}
              </div>
              <div className="mt-auto pt-2 flex items-center justify-between">
                <div className="flex items-baseline text-white">
                  <span className="text-3xl font-bold tracking-tight">
                    €{bike.price_per_day.toFixed(2)}
                  </span>
                  <span className="text-sm font-semibold ml-1 text-white/70">/day</span>
                </div>
                <div
                  className={`px-3 py-1 text-sm font-semibold text-white rounded-full ${
                    bike.status === "available" ? "bg-green-500/90" : "bg-yellow-500/90"
                  }`}
                >
                  {bike.status.charAt(0).toUpperCase() + bike.status.slice(1)}
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default MotorcycleList;
