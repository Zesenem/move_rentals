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

const iconBaseClass = "mr-3 flex-shrink-0 text-lg";

export const iconMap = {
  "id-card": <FaIdCard className={`${iconBaseClass} text-steel`} />,
  license: <PiSteeringWheelFill className={`${iconBaseClass} text-steel`} />,
  "credit-card": <FaCreditCard className={`${iconBaseClass} text-steel`} />,
  experience: <PiMotorcycleFill className={`${iconBaseClass} text-steel`} />,
  helmet: <GiFullMotorcycleHelmet className={`${iconBaseClass} text-status-available`} />,
  gloves: <GiGloves className={`${iconBaseClass} text-steel`} />,
  jacket: <PiCoatHangerBold className={`${iconBaseClass} text-steel`} />,
  trousers: <PiPantsFill className={`${iconBaseClass} text-steel`} />,
  boots: <GiLeatherBoot className={`${iconBaseClass} text-steel`} />,
  toll: <GrTag className={`${iconBaseClass} text-steel`} />,
  delivery: <PiMotorcycleFill className={`${iconBaseClass} text-steel`} />,
  airport: <FaPlaneDeparture className={`${iconBaseClass} text-steel`} />,
  tax: <PiPercentFill className={`${iconBaseClass} text-status-available`} />,
  shield: <FaShieldAlt className={`${iconBaseClass} text-status-available`} />,
  users: <FaUsers className={`${iconBaseClass} text-status-available`} />,
  road: <FaRoad className={`${iconBaseClass} text-status-available`} />,
  infinity: <FaInfinity className={`${iconBaseClass} text-status-available`} />,
  lock: <FaLock className={`${iconBaseClass} text-status-available`} />,
  
  "default-check": <FaCheckCircle className={`${iconBaseClass} text-status-available`} />,
};
