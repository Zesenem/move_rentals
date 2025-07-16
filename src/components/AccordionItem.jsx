import { useState, useId } from "react";
import { FaChevronDown } from "react-icons/fa";

function AccordionItem({ title, children, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const contentId = useId();

  return (
    <div className="border-b border-graphite/50">
      <h2>
        <button
          onClick={() => setIsOpen(!isOpen)}
          id={`accordion-header-${contentId}`}
          aria-expanded={isOpen}
          aria-controls={`accordion-content-${contentId}`}
          className="
            flex w-full items-center justify-between rounded-md p-5 text-left 
            transition-colors duration-300 hover:bg-arsenic/50 
            focus:outline-none focus-visible:ring-2 focus-visible:ring-cloud/50
          "
        >
          <span
            className={`
              text-lg font-semibold transition-colors duration-300 
              ${isOpen ? "text-cloud" : "text-steel"}
            `}
          >
            {title}
          </span>
          <FaChevronDown
            aria-hidden="true"
            className={`
              transform text-steel transition-transform duration-300 
              ${isOpen ? "rotate-180" : "rotate-0"}
            `}
          />
        </button>
      </h2>

      <div
        id={`accordion-content-${contentId}`}
        role="region"
        aria-labelledby={`accordion-header-${contentId}`}
        className={`
          grid overflow-hidden transition-all duration-300 ease-in-out
          ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}
        `}
      >
        <div className="overflow-hidden">
          <div
            className={`
              p-5 pt-0 text-space transition-opacity duration-300
              ${isOpen ? "opacity-100" : "opacity-0"}
            `}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccordionItem;
