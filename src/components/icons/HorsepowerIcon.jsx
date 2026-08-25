import { FaHorseHead, FaTachometerAlt } from "react-icons/fa";

function HorsepowerIcon({ className = "" }) {
  return (
    <span className={`relative inline-flex h-[1.15em] w-[1.15em] ${className}`} aria-hidden="true">
      <FaHorseHead className="absolute top-[-0.08em] right-[-0.04em] h-[0.72em] w-[0.72em]" />
      <FaTachometerAlt className="absolute bottom-[-0.04em] left-[-0.04em] h-[0.7em] w-[0.7em]" />
    </span>
  );
}

export default HorsepowerIcon;
