import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchProductBySlug } from "../services/twice.js";

import AccordionItem from "../components/AccordionItem";
import ImageCarousel from "../components/ImageCarousel";
import Button from "../components/Button";
import Seo, { SITE_URL } from "../components/Seo";
import { trackWhatsAppClick } from "../services/analytics.js";
import { buildWhatsAppUrl } from "../utils/whatsapp.js";
import { iconMap } from "../utils/iconMap.jsx";
import { FaExclamationTriangle, FaWhatsapp } from "react-icons/fa";

const formatDisplayValue = (value) => {
  if (typeof value === "number") {
    return `€${value.toFixed(0)}`;
  }

  return value;
};

const getListIcon = (icon) => iconMap[icon] || iconMap["default-check"];

const getVehicleStructuredData = (bike, path) => {
  const url = `${SITE_URL}${path}`;
  const images = (bike.image_urls || []).filter((image) => typeof image === "string" && image);
  const specifications = (bike.technical_features || [])
    .filter((feature) => feature?.label && feature?.value)
    .map((feature) => ({
      "@type": "PropertyValue",
      name: feature.label,
      value: feature.value,
    }));
  const hasDailyPrice = typeof bike.price_per_day === "number" && bike.price_per_day > 0;

  const vehicle = {
    "@type": "Vehicle",
    "@id": `${url}#vehicle`,
    name: bike.name,
    description: bike.description,
    url,
    ...(images.length > 0 && { image: images }),
    ...(specifications.length > 0 && { additionalProperty: specifications }),
  };

  if (hasDailyPrice) {
    vehicle.offers = {
      "@type": "Offer",
      url,
      price: bike.price_per_day,
      priceCurrency: "EUR",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: bike.price_per_day,
        priceCurrency: "EUR",
        unitText: "DAY",
      },
      seller: {
        "@type": "Organization",
        name: "Move Rentals",
        url: SITE_URL,
      },
    };
  }

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: `${SITE_URL}/`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: bike.name,
            item: url,
          },
        ],
      },
      vehicle,
    ],
  };
};

const SpecsTable = ({ features }) => {
  if (!features || features.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 border-t border-graphite/50 pt-6">
      <h3 className="text-xl font-bold text-cloud mb-4">Specifications</h3>
      <ul className="text-base space-y-1">
        {features.map((feature) => (
          <li key={feature.label} className="flex justify-between py-2 border-b border-graphite/50">
            <span className="text-space">{feature.label}:</span>
            <span className="font-semibold text-cloud text-right">{feature.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const IncludedInRentalList = ({ items }) => (
  <ul className="text-base space-y-2.5 text-steel">
    {items?.map((item, index) => (
      <li key={index} className="flex items-center gap-2">
        {getListIcon(item.icon)}
        {item.item}
      </li>
    ))}
  </ul>
);

const RequirementsList = ({ items, deposit }) => (
  <>
    {items?.length > 0 && (
      <ul className="text-base space-y-2.5 text-steel">
        {items.map((req, index) => (
          <li key={index} className="flex items-center gap-2">
            {getListIcon(req.icon)}
            {req.item}
          </li>
        ))}
      </ul>
    )}
    {deposit !== undefined && deposit !== null && deposit !== "" && (
      <p className="mt-2 text-sm text-steel">
        Security Deposit:{" "}
        <span className="font-semibold text-cloud">{formatDisplayValue(deposit)}</span>
      </p>
    )}
  </>
);

const ImportantNotesList = ({ items }) => (
  <ul className="text-base space-y-2.5 text-steel">
    {items?.map((note, index) => (
      <li key={index} className="flex items-center gap-2">
        {getListIcon(note.icon)}
        {note.item}
      </li>
    ))}
  </ul>
);

const MotorcyclePageSkeleton = () => (
  <div className="container mx-auto px-4 py-12 animate-pulse">
    <div className="h-6 bg-graphite/50 rounded w-48 mb-8"></div>
    <div className="grid grid-cols-1 md:grid-cols-5 gap-x-12 gap-y-10">
      <div className="md:col-span-3">
        <div className="w-full aspect-video bg-graphite/50 rounded-lg mb-12"></div>
        <div className="space-y-2">
          <div className="h-12 bg-graphite/50 rounded-lg"></div>
          <div className="h-12 bg-graphite/50 rounded-lg"></div>
        </div>
      </div>
      <div className="md:col-span-2">
        <div className="sticky top-24 space-y-6">
          <div className="h-10 bg-graphite/50 rounded w-3/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-graphite/50 rounded"></div>
            <div className="h-4 bg-graphite/50 rounded w-5/6"></div>
          </div>
          <div className="h-12 bg-graphite/50 rounded-lg"></div>
          <div className="mt-8 space-y-4 border-t border-graphite/50 pt-6">
            <div className="h-6 w-1/2 rounded bg-graphite/50 mb-4"></div>
            <div className="h-8 rounded bg-graphite/50"></div>
            <div className="h-8 rounded bg-graphite/50"></div>
            <div className="h-8 rounded bg-graphite/50"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

function MotorcyclePage() {
  const { slug } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => fetchProductBySlug(slug),
    enabled: !!slug,
  });

  if (isLoading) {
    return <MotorcyclePageSkeleton />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <Seo
          title="Vehicle Not Found | Move Rentals"
          description="This vehicle could not be found."
          noIndex
        />
        <FaExclamationTriangle className="text-red-500 text-5xl mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-cloud mb-2">Could Not Load Details</h2>
        <p className="text-space">{error.message}</p>
      </div>
    );
  }

  const { bike, commonData } = data || {};

  const whatsappMessage = `Hello! I'm interested in renting the ${bike?.name}. Could you provide more information?`;
  const whatsappUrl = buildWhatsAppUrl(whatsappMessage);
  const includedItems = Array.isArray(bike?.included) ? bike.included : commonData?.included || [];
  const requirementItems = Array.isArray(bike?.requirements)
    ? bike.requirements
    : commonData?.requirements || [];
  const importantNotes = bike?.important_notes || [];
  const hasDeposit = bike?.security_deposit !== undefined && bike?.security_deposit !== null;
  const hasDailyPrice = typeof bike?.price_per_day === "number" && bike.price_per_day > 0;
  const vehiclePath = `/motorcycle/${encodeURIComponent(slug)}`;
  const vehicleStructuredData = getVehicleStructuredData(bike, vehiclePath);
  const titleAndDescription = (
    <div>
      <h1 className="text-4xl font-extrabold text-cloud tracking-tight">{bike?.name}</h1>
      <p className="mt-4 text-space">{bike?.description}</p>
      {hasDailyPrice && (
        <div className="mt-5 flex items-baseline gap-1.5 border-l-2 border-emerald-400 pl-3">
          <span className="text-3xl font-extrabold tracking-tight text-cloud">
            &euro;{bike.price_per_day.toFixed(2)}
          </span>
          <span className="text-sm font-semibold text-space">/ day</span>
        </div>
      )}
    </div>
  );
  const whatsappCallToAction = (
    <div className="pt-2">
      <Button
        as="a"
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() =>
          trackWhatsAppClick({
            placement: "motorcycle_page_cta",
            url: whatsappUrl,
            vehicleName: bike?.name,
          })
        }
        variant="primary"
        className="w-full py-3 text-lg"
        icon={FaWhatsapp}
      >
        Contact on WhatsApp
      </Button>
      <p className="text-center text-xs text-graphite mt-2">
        Click to open a chat with us for booking and inquiries.
      </p>
    </div>
  );

  return (
    <>
      <Seo
        title={bike?.name ? `${bike.name} | Move Rentals` : "Vehicle Details | Move Rentals"}
        description={bike?.description || "Find details and book your vehicle rental in Lisbon."}
        path={vehiclePath}
        image={bike?.image_urls?.[0]}
        structuredData={vehicleStructuredData}
      />
      <div className="container mx-auto px-4 py-12">
        <Link to="/" className="text-steel hover:text-cloud mb-8 inline-block font-semibold">
          &larr; Back to Our Fleet
        </Link>

        <div className="mb-8 md:hidden">{titleAndDescription}</div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-x-12 gap-y-10">
          <div className="md:col-span-3">
            <div className="w-full aspect-video mb-12">
              <ImageCarousel images={bike?.image_urls} vehicleName={bike?.name} />
            </div>

            <div className="mb-8 md:hidden">{whatsappCallToAction}</div>

            <div className="space-y-2">
              {includedItems.length > 0 && (
                <AccordionItem title="Included in Rental">
                  <IncludedInRentalList items={includedItems} />
                </AccordionItem>
              )}
              {(requirementItems.length > 0 || hasDeposit) && (
                <AccordionItem title="Requirements">
                  <RequirementsList items={requirementItems} deposit={bike?.security_deposit} />
                </AccordionItem>
              )}
              {importantNotes.length > 0 && (
                <AccordionItem title="Important Notes">
                  <ImportantNotesList items={importantNotes} />
                </AccordionItem>
              )}
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="sticky top-24 space-y-6">
              <div className="hidden md:block">{titleAndDescription}</div>

              <div className="hidden md:block">{whatsappCallToAction}</div>

              <SpecsTable features={bike?.technical_features} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MotorcyclePage;
