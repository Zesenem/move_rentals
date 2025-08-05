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
  GPS: {
    icon: function GPSIcon(props) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 576 512"
          className={props.className}
          fill="currentColor"
        >
          <path d="M408 120c0 54.6-73.1 151.9-105.2 192c-7.7 9.6-22 9.6-29.6 0C241.1 271.9 168 174.6 168 120C168 53.7 221.7 0 288 0s120 53.7 120 120zm8 80.4c3.5-6.9 6.7-13.8 9.6-20.6c.5-1.2 1-2.5 1.5-3.7l116-46.4C558.9 123.4 576 135 576 152l0 270.8c0 9.8-6 18.6-15.1 22.3L416 503l0-302.6zM137.6 138.3c2.4 14.1 7.2 28.3 12.8 41.5c2.9 6.8 6.1 13.7 9.6 20.6l0 251.4L32.9 502.7C17.1 509 0 497.4 0 480.4L0 209.6c0-9.8 6-18.6 15.1-22.3l122.6-49zM327.8 332c13.9-17.4 35.7-45.7 56.2-77l0 249.3L192 449.4 192 255c20.5 31.3 42.3 59.6 56.2 77c20.5 25.6 59.1 25.6 79.6 0zM288 152a40 40 0 1 0 0-80 40 40 0 1 0 0 80z" />
        </svg>
      );
    },
    color: "bg-blue-500",
  },
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
          className={`group flex cursor-pointer items-center rounded-full p-1.5 text-white shadow-lg transition-all duration-300 ease-out ${badgeInfo.color} hover:px-2.5 hover:py-1`}
        >
          <Icon className="h-4 w-4 flex-shrink-0" />
          <span className="whitespace-nowrap text-xs font-bold transition-all duration-300 ease-out max-w-0 opacity-0 group-hover:ml-1.5 group-hover:max-w-[100px] group-hover:opacity-100">
            {badge}
          </span>
        </div>
      );
    })}
  </div>
);

function MotorcycleCard({ bike, index }) {
  const isAvailable = bike.status === "available";
  const isPlaceholder = bike.price_per_day > 998;
  const isClickable = isAvailable && !isPlaceholder;

  const CardWrapper = isClickable ? Link : "div";

  const imageUrl =
    bike.image_urls?.[0] || `https://placehold.co/600x400/2A2D35/EDEFF7?text=${bike.name}`;

  const wrapperProps = {
    className: `card-animate block w-full max-w-sm ${isPlaceholder ? "hidden sm:block" : ""}`,
    style: { animationDelay: `${index * 150}ms` },
    ...(isClickable && { to: `/motorcycle/${bike.slug}` }),
  };

  return (
    <CardWrapper {...wrapperProps}>
      <div
        className={`flex h-full flex-col overflow-hidden rounded-lg border border-graphite/50 bg-arsenic shadow-lg transition-all duration-300 ${
          !isClickable
            ? "opacity-80 cursor-not-allowed"
            : "hover:-translate-y-1 hover:scale-[1.02] hover:border-cloud/50 hover:shadow-xl hover:shadow-cloud/10"
        }`}
      >
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
                {isPlaceholder ? '€ --.-' : `€${bike.price_per_day.toFixed(2)}`}
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
                {isPlaceholder
                  ? "Coming Soon"
                  : bike.status.charAt(0).toUpperCase() + bike.status.slice(1)}
              </span>
              <Button as="span" variant="primary" disabled={!isClickable} className="text-sm">
  {isPlaceholder ? "Unavailable" : "View Details"}
</Button>
            </div>
          </div>
        </div>
      </div>
    </CardWrapper>
  );
}

export default MotorcycleCard;
