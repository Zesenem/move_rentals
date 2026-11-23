import AccordionItem from "./AccordionItem.jsx";
import { FAQ_ITEMS } from "../data/faq.js";

function FaqSection() {
  return (
    <section className="py-16 sm:py-20" aria-labelledby="faq-heading">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-cloud">Helpful information</p>
          <h2 id="faq-heading" className="mt-3 text-3xl font-extrabold text-steel sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-space">
            A quick guide to licences, protection, vehicle choice, and contacting the team.
          </p>
        </div>
        <div className="mt-10 overflow-hidden rounded-2xl border border-graphite/50 bg-arsenic/60">
          {FAQ_ITEMS.map((item) => (
            <AccordionItem key={item.question} title={item.question}>
              <p>{item.answer}</p>
            </AccordionItem>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FaqSection;
