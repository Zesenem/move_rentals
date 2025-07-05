import { useState } from "react";

function AccordionItem({ title, children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-white/10">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full p-5 text-left rounded-md hover:bg-white/5 transition-colors duration-200"
      >
        <span
          className={`text-lg font-semibold transition-colors duration-200 ${
            isOpen ? "text-brand-orange" : "text-white"
          }`}
        >
          {title}
        </span>
        <span
          className={`transform transition-transform duration-300 ${
            isOpen ? "rotate-45" : "rotate-0"
          }`}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 3V17M3 10H17"
              stroke="#F97316"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>
      <div
        className={`grid overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="pt-0 pb-5 px-5 text-slate-300">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default AccordionItem;
