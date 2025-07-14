import { Link } from "react-router-dom";
import { FaTachometerAlt } from "react-icons/fa";
import { PiSteeringWheelFill, PiGasCanFill } from "react-icons/pi";
import Button from "./Button";

const glanceIconMap = {
  engine: <FaTachometerAlt />,
  license: <PiSteeringWheelFill />,
  gas: <PiGasCanFill />,
};

const QuickGlance = ({ stats }) => (
  <div className="flex items-center space-x-4 my-4 text-space">
    {stats?.map((stat) => (
      <div key={stat.label} className="flex items-center text-sm gap-2">
        {glanceIconMap[stat.icon]}
        <span>{stat.label}</span>
      </div>
    ))}
  </div>
);

function MotorcycleCard({ bike, index }) {
  const isAvailable = bike.status === "available";
  const imageUrl =
    bike.image_urls?.[0] || `https://placehold.co/600x400/2A2D35/EDEFF7?text=${bike.name}`;

  return (
    <Link
      to={`/motorcycle/${bike.slug}`}
      className="block card-animate w-full max-w-sm"
      style={{ animationDelay: `${index * 150}ms` }}
    >
      <div className="bg-arsenic border border-graphite/50 rounded-lg shadow-lg flex flex-col overflow-hidden h-full transition-all duration-300 hover:border-cloud/50 hover:shadow-xl hover:shadow-cloud/10 hover:-translate-y-1 hover:scale-[1.02]">
        <div className="aspect-video bg-phantom overflow-hidden">
          <img
            src={imageUrl}
            alt={bike.name}
            className="w-full h-full object-cover transition-opacity duration-500 opacity-0"
            onLoad={(e) => (e.target.style.opacity = 1)}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://placehold.co/600x400/2A2D35/EDEFF7?text=Image+Not+Found`;
            }}
          />
        </div>
        <div className="p-5 flex flex-col flex-grow">
          <h3 className="text-xl font-bold tracking-tight text-cloud min-h-[56px]">{bike.name}</h3>

          <QuickGlance stats={bike.quick_glance} />

          <div className="mt-auto pt-4 border-t border-graphite/30 space-y-4">
            <div className="flex items-baseline text-cloud">
              <span className="text-3xl font-bold tracking-tight">
                €{bike.price_per_day.toFixed(2)}
              </span>
              <span className="text-sm font-semibold ml-1 text-space">/day</span>
            </div>

            <div className="flex items-center justify-between">
              <span
                className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  isAvailable
                    ? "bg-status-bg-available text-status-available"
                    : "bg-status-bg-booked text-status-booked"
                }`}
              >
                {bike.status.charAt(0).toUpperCase() + bike.status.slice(1)}
              </span>
              <Button as="span" variant="primary" className="text-sm">
                Book Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default MotorcycleCard;
