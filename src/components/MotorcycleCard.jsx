import { Link } from "react-router-dom";
import { FaTachometerAlt, FaLeaf, FaStar, FaGem } from "react-icons/fa";
import { PiSteeringWheelFill, PiGasCanFill } from "react-icons/pi";
import Button from "./Button";

const glanceIconMap = {
  engine: <FaTachometerAlt />,
  license: <PiSteeringWheelFill />,
  gas: <PiGasCanFill />,
};

const badgeMap = {
  ECO: { icon: FaLeaf, color: "bg-green-500" },
  "Best Seller": { icon: FaStar, color: "bg-yellow-500" },
  "Best Value": { icon: FaStar, color: "bg-yellow-500" },
  Premium: { icon: FaGem, color: "bg-purple-500" },
};

const QuickGlance = ({ stats }) => (
  <div className="my-4 flex items-center space-x-4 text-space">
    {stats?.map((stat) => (
      <div key={stat.label} className="flex items-center gap-2 text-sm">
        {glanceIconMap[stat.icon]}
        <span>{stat.label}</span>
      </div>
    ))}
  </div>
);

const Badges = ({ badges }) => (
  <div className="absolute top-3 right-3 flex flex-col items-end gap-2">
    {badges?.map((badge) => {
      const badgeInfo = badgeMap[badge];
      if (!badgeInfo) return null;
      const Icon = badgeInfo.icon;
      return (
        <div
          key={badge}
          className={`flex items-center rounded-full p-1.5 text-white shadow-lg transition-all duration-300 ease-in-out ${badgeInfo.color} group-hover:px-2.5 group-hover:py-1`}
        >
          <Icon className="h-4 w-4 flex-shrink-0" />
          <span
            className="whitespace-nowrap text-xs font-bold transition-all duration-300 ease-in-out max-w-0 opacity-0 group-hover:ml-1.5 group-hover:max-w-full group-hover:opacity-100"
          >
            {badge}
          </span>
        </div>
      );
    })}
  </div>
);


function MotorcycleCard({ bike, index }) {
  const isAvailable = bike.status === "available";
  const imageUrl =
    bike.image_urls?.[0] || `https://placehold.co/600x400/2A2D35/EDEFF7?text=${bike.name}`;

  return (
    <Link
      to={`/motorcycle/${bike.slug}`}
      className="group card-animate block w-full max-w-sm"
      style={{ animationDelay: `${index * 150}ms` }}
    >
      <div className="flex h-full flex-col overflow-hidden rounded-lg border border-graphite/50 bg-arsenic shadow-lg transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:border-cloud/50 hover:shadow-xl hover:shadow-cloud/10">
        <div className="relative aspect-video overflow-hidden bg-phantom">
          <img
            src={imageUrl}
            alt={bike.name}
            className="h-full w-full object-cover opacity-0 transition-opacity duration-500"
            onLoad={(e) => (e.target.style.opacity = "1")}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://placehold.co/600x400/2A2D35/EDEFF7?text=Image+Not+Found`;
            }}
          />
          <Badges badges={bike.badges} />
        </div>
        <div className="flex flex-grow flex-col p-5">
          <h3 className="min-h-[56px] text-xl font-bold tracking-tight text-cloud">{bike.name}</h3>

          <QuickGlance stats={bike.quick_glance} />

          <div className="mt-auto space-y-4 border-t border-graphite/30 pt-4">
            <div className="flex items-baseline text-cloud">
              <span className="text-3xl font-bold tracking-tight">
                €{bike.price_per_day.toFixed(2)}
              </span>
              <span className="ml-1 text-sm font-semibold text-space">/day</span>
            </div>

            <div className="flex items-center justify-between">
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  isAvailable
                    ? "bg-status-bg-available text-status-available"
                    : "bg-status-bg-booked"
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
