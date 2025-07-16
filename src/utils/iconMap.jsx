import {
  FaIdCard,
  FaCreditCard,
  FaCheckCircle,
  FaShieldAlt,
  FaUsers,
  FaInfinity,
  FaLock,
  FaRoad,
  FaPlaneDeparture,
} from "react-icons/fa";
import {
  PiSteeringWheelFill,
  PiMotorcycleFill,
  PiPantsFill,
  PiPercentFill,
  PiCoatHangerBold,
} from "react-icons/pi";
import { GiFullMotorcycleHelmet, GiGloves, GiLeatherBoot } from "react-icons/gi";
import { GrTag } from "react-icons/gr";

const createIcon = (IconComponent, colorClass = "text-steel") => {
  const baseClasses = "flex-shrink-0 text-lg";
  return <IconComponent className={`${baseClasses} ${colorClass}`} />;
};

export const iconMap = {
  "id-card": createIcon(FaIdCard),
  license: createIcon(PiSteeringWheelFill),
  "credit-card": createIcon(FaCreditCard),
  experience: createIcon(PiMotorcycleFill),
  helmet: createIcon(GiFullMotorcycleHelmet, "text-status-available"),
  gloves: createIcon(GiGloves),
  jacket: createIcon(PiCoatHangerBold),
  trousers: createIcon(PiPantsFill),
  boots: createIcon(GiLeatherBoot),
  toll: createIcon(GrTag),
  delivery: createIcon(PiMotorcycleFill),
  airport: createIcon(FaPlaneDeparture),
  lock: createIcon(FaLock, "text-status-available"),
  tax: createIcon(PiPercentFill, "text-status-available"),
  shield: createIcon(FaShieldAlt, "text-status-available"),
  users: createIcon(FaUsers, "text-status-available"),
  road: createIcon(FaRoad, "text-status-available"),
  infinity: createIcon(FaInfinity, "text-status-available"),
  "default-check": createIcon(FaCheckCircle, "text-status-available"),
};
