import { useState, useId } from "react";
import { FaChevronDown } from "react-icons/fa";

function AccordionItem({ title, children, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const contentId = useId();

  return (
    <div className="border-b border-graphite/50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full p-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-cloud/50 rounded-md hover:bg-arsenic/50 transition-colors duration-200"
        aria-expanded={isOpen}
        aria-controls={contentId}
      >
        <span
          className={`text-lg font-semibold transition-colors duration-200 ${
            isOpen ? "text-cloud" : "text-steel"
          }`}
        >
          {title}
        </span>
        <FaChevronDown
          className={`transform transition-transform duration-300 text-steel ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
          aria-hidden="true"
        />
      </button>

      <div
        id={contentId}
        className={`grid overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="pt-0 pb-5 px-5 text-space">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default AccordionItem;
