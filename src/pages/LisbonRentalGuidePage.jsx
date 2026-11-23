import { Link } from "react-router-dom";
import Seo, { SITE_URL } from "../components/Seo.jsx";
import { buildWhatsAppUrl } from "../utils/whatsapp.js";

const sections = [
  {
    id: "licence",
    title: "Choose the right licence category",
    text: "Scooters and motorcycles list their accepted categories on every vehicle page. Bring your original licence and check the exact category before travelling. Visitors should also confirm whether an international driving permit applies to their issuing country.",
  },
  {
    id: "areas",
    title: "Best areas to start your ride",
    text: "Move is centrally located, making it practical to begin in Lisbon, follow the river west, or head towards Sintra and the coast. Lisbon streets can be narrow and hilly, so a compact scooter is often the simplest choice for city-only travel.",
  },
  {
    id: "parking",
    title: "Parking and practical city rules",
    text: "Use marked motorcycle and scooter spaces, keep pavements and entrances clear, and check local signs before leaving a vehicle. Always store valuables and removable equipment securely, especially in busy visitor areas.",
  },
  {
    id: "packing",
    title: "What to bring for collection",
    text: "Bring your identity document, original driving licence, and the card needed for the security deposit. Wear suitable closed shoes; the Move team can explain the included equipment and model-specific requirements before collection.",
  },
  {
    id: "day-trips",
    title: "Popular day-trip directions",
    text: "For a short coastal route, consider the riverfront towards Belém and Cascais. For a longer day, Sintra offers a very different landscape but requires more planning around traffic, weather, parking, and the chosen vehicle’s intended use.",
  },
];

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Lisbon Motorcycle and Scooter Rental Guide",
  description:
    "Practical guidance for renting a scooter or motorcycle in Lisbon, including licence, parking, collection, and route planning.",
  mainEntityOfPage: `${SITE_URL}/lisbon-rental-guide`,
  author: { "@type": "Organization", name: "Move Rentals" },
  publisher: {
    "@type": "Organization",
    name: "Move Rentals",
    logo: { "@type": "ImageObject", url: `${SITE_URL}/32x32.png` },
  },
};

function LisbonRentalGuidePage() {
  const whatsappUrl = buildWhatsAppUrl(
    "Hello! I have read the Lisbon rental guide and would like help choosing a vehicle.",
  );

  return (
    <>
      <Seo
        title="Lisbon Motorcycle & Scooter Rental Guide | Move Rentals"
        description="Plan a scooter or motorcycle rental in Lisbon with guidance on licences, parking, collection, routes, and choosing the right vehicle."
        path="/lisbon-rental-guide"
        structuredData={structuredData}
      />
      <article className="container mx-auto max-w-5xl px-4 py-14 sm:py-20">
        <nav aria-label="Breadcrumb" className="mb-8 text-sm text-space">
          <Link to="/" className="font-semibold hover:text-cloud">
            Home
          </Link>
          <span className="mx-2" aria-hidden="true">
            /
          </span>
          <span aria-current="page">Lisbon rental guide</span>
        </nav>

        <header className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-cloud">Local guide</p>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-cloud sm:text-6xl">
            Renting a scooter or motorcycle in Lisbon
          </h1>
          <p className="mt-6 text-lg leading-8 text-space">
            A practical starting point for choosing a vehicle, preparing your documents, parking
            responsibly, and planning a comfortable ride around Lisbon.
          </p>
        </header>

        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="space-y-12">
            {sections.map((section) => (
              <section key={section.id} id={section.id} aria-labelledby={`${section.id}-heading`}>
                <h2
                  id={`${section.id}-heading`}
                  className="text-2xl font-extrabold text-steel sm:text-3xl"
                >
                  {section.title}
                </h2>
                <p className="mt-4 text-lg leading-8 text-space">{section.text}</p>
              </section>
            ))}
          </div>

          <aside className="h-fit rounded-2xl border border-graphite/50 bg-arsenic p-6 lg:sticky lg:top-24">
            <h2 className="text-lg font-extrabold text-cloud">On this page</h2>
            <ul className="mt-4 space-y-3 text-sm text-steel">
              {sections.map((section) => (
                <li key={section.id}>
                  <a href={`#${section.id}`} className="hover:text-cloud hover:underline">
                    {section.title}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-6 border-t border-graphite/50 pt-6">
              <p className="text-sm text-steel">
                Not sure which vehicle fits your plans? Ask the local team.
              </p>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-cloud px-4 py-2 text-sm font-extrabold text-phantom hover:bg-cloud/90"
              >
                Ask on WhatsApp
              </a>
              <Link
                to="/#fleet-section"
                className="mt-3 inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-graphite/60 px-4 py-2 text-sm font-bold text-steel hover:border-cloud hover:text-cloud"
              >
                Browse the fleet
              </Link>
            </div>
          </aside>
        </div>
      </article>
    </>
  );
}

export default LisbonRentalGuidePage;
