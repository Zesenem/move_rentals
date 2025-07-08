import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchProductBySlug, fetchExtras } from "../services/twice.js";

import AccordionItem from "../components/AccordionItem";
import ImageCarousel from "../components/ImageCarousel";
import BookingWidget from "../components/BookingWidget";
import ExtrasSelector from "../components/ExtrasSelector";
import { iconMap } from "../utils/iconMap.jsx";
import { FaExclamationTriangle } from "react-icons/fa";

const TechnicalFeaturesList = ({ features }) => (
  <ul className="text-base space-y-1">
    {features?.map((feature, index) => (
      <li key={index} className="flex justify-between py-2 border-b border-graphite/50">
        <span className="text-space">{feature.label}:</span>
        <span className="font-semibold text-cloud text-right">{feature.value}</span>
      </li>
    ))}
  </ul>
);

const IncludedInRentalList = ({ items, deposit }) => (
  <>
    <p className="mb-4 text-sm text-steel">
      Security Deposit: <span className="font-semibold text-cloud">€{deposit}</span>
    </p>
    <ul className="text-base space-y-2.5 text-steel">
      {items?.map((item, index) => (
        <li key={index} className="flex items-center gap-2">
          {iconMap[item.icon] || iconMap["default-check"]}
          {item.item}
        </li>
      ))}
    </ul>
  </>
);

const RequirementsList = ({ items }) => (
  <ul className="text-base space-y-2.5 text-steel">
    {items?.map((req, index) => (
      <li key={index} className="flex items-center gap-2">
        {iconMap[req.icon]}
        {req.item}
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
          <div className="h-96 bg-graphite/50 rounded-lg"></div>
        </div>
      </div>
    </div>
  </div>
);

function MotorcyclePage() {
  const { slug } = useParams();
  const [selectedExtras, setSelectedExtras] = useState({});

  const {
    data,
    isLoading: isLoadingBike,
    error: bikeError,
  } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => fetchProductBySlug(slug),
    enabled: !!slug,
  });

  const {
    data: extras,
    isLoading: isLoadingExtras,
    error: extrasError,
  } = useQuery({
    queryKey: ["extras"],
    queryFn: fetchExtras,
  });

  if (isLoadingBike || isLoadingExtras) {
    return <MotorcyclePageSkeleton />;
  }

  if (bikeError || extrasError) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <FaExclamationTriangle className="text-red-500 text-5xl mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-cloud mb-2">Could Not Load Details</h2>
        <p className="text-space">{bikeError?.message || extrasError?.message}</p>
      </div>
    );
  }

  const { bike, commonData } = data || {};

  return (
    <div className="container mx-auto px-4 py-12">
      <Link to="/" className="text-steel hover:text-cloud mb-8 inline-block font-semibold">
        &larr; Back to Our Fleet
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-x-12 gap-y-10">
        <div className="md:col-span-3">
          <div className="w-full aspect-video mb-12">
            <ImageCarousel images={bike?.image_urls} />
          </div>
          <div className="space-y-2">
            {bike?.technical_features?.length > 0 && (
              <AccordionItem title="Technical Features">
                <TechnicalFeaturesList features={bike.technical_features} />
              </AccordionItem>
            )}
            <AccordionItem title="Included in Rental">
              <IncludedInRentalList items={commonData?.included} deposit={bike?.security_deposit} />
            </AccordionItem>
            <AccordionItem title="Requirements">
              <RequirementsList items={commonData?.requirements} />
            </AccordionItem>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="sticky top-24 space-y-6">
            <div>
              <h1 className="text-4xl font-extrabold text-cloud tracking-tight">{bike?.name}</h1>
              <p className="mt-4 text-space">{bike?.description}</p>
            </div>

            <ExtrasSelector
              extras={extras || []}
              selectedExtras={selectedExtras}
              onExtrasChange={setSelectedExtras}
            />

            {bike && <BookingWidget bike={bike} selectedExtras={selectedExtras} />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MotorcyclePage;
