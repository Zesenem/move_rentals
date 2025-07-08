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

const iconClassName = "text-steel mr-3 flex-shrink-0 text-lg";
const includedIconClassName = "text-status-available mr-3 flex-shrink-0";

export const iconMap = {
  "id-card": <FaIdCard className={iconClassName} />,
  license: <PiSteeringWheelFill className={iconClassName} />,
  "credit-card": <FaCreditCard className={iconClassName} />,
  experience: <PiMotorcycleFill className={iconClassName} />,
  helmet: <GiFullMotorcycleHelmet className={iconClassName} />,
  gloves: <GiGloves className={iconClassName} />,
  jacket: <PiCoatHangerBold className={iconClassName} />,
  trousers: <PiPantsFill className={iconClassName} />,
  boots: <GiLeatherBoot className={iconClassName} />,
  toll: <GrTag className={iconClassName} />,
  delivery: <PiMotorcycleFill className={iconClassName} />,
  airport: <FaPlaneDeparture className={iconClassName} />,
  tax: <PiPercentFill className={includedIconClassName} />,
  shield: <FaShieldAlt className={includedIconClassName} />,
  users: <FaUsers className={includedIconClassName} />,
  road: <FaRoad className={includedIconClassName} />,
  infinity: <FaInfinity className={includedIconClassName} />,
  lock: <FaLock className={includedIconClassName} />,
  "default-check": <FaCheckCircle className={includedIconClassName} />,
};
