import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchProductBySlug } from '../services/twice.js';

import AccordionItem from '../components/AccordionItem';
import ImageCarousel from '../components/ImageCarousel';
import BookingWidget from '../components/BookingWidget';
import { iconMap } from '../utils/iconMap.jsx';

// Sub-component for the "Technical Features" list
const TechnicalFeaturesList = ({ features }) => (
  <ul className="text-base space-y-1">
    {features.map((feature, index) => (
      <li key={index} className="flex justify-between py-2 border-b border-graphite/50">
        <span className="text-space">{feature.label}:</span>
        <span className="font-semibold text-cloud text-right">{feature.value}</span>
      </li>
    ))}
  </ul>
);

// Sub-component for the "Included in Rental" list
const IncludedInRentalList = ({ items, deposit }) => (
  <>
    <p className="mb-4 text-sm text-steel">
      Security Deposit: <span className="font-semibold text-cloud">€{deposit}</span>
    </p>
    <ul className="text-base space-y-2.5 text-steel">
      {items.map((item, index) => (
        <li key={index} className="flex items-center">
          {iconMap[item.icon] || iconMap['default-check']}
          {item.item}
        </li>
      ))}
    </ul>
  </>
);

// Sub-component for the "Optional Extras" list
const OptionalExtrasList = ({ specificExtra, commonExtras }) => (
  <ul className="text-base space-y-3">
    <li className="p-3 bg-arsenic/50 rounded-md">
      <span className="font-semibold text-cloud">{specificExtra.item}:</span>
      <span className="block text-space mt-1">{specificExtra.price}</span>
    </li>
    {commonExtras.map((extra, index) => (
      <li key={index} className="flex items-center">
        {iconMap[extra.icon]}
        <div>
          <span className="font-semibold text-cloud">{extra.item}:</span>
          <span className="block text-space text-sm">{extra.price}</span>
        </div>
      </li>
    ))}
  </ul>
);

// Sub-component for the "Requirements" list
const RequirementsList = ({ items }) => (
  <ul className="text-base space-y-2.5 text-steel">
    {items.map((req, index) => (
      <li key={index} className="flex items-center">
        {iconMap[req.icon]}
        {req.item}
      </li>
    ))}
  </ul>
);


function MotorcyclePage() {
  const { slug } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => fetchProductBySlug(slug),
    enabled: !!slug,
  });

  if (isLoading) {
    return <p className="text-center text-space py-20">Loading Details...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 py-20">Error: {error.message}</p>;
  }

  const { bike, commonData } = data;

  return (
    <div className="container mx-auto px-4 py-12">
      <Link to="/" className="text-steel hover:text-cloud mb-8 inline-block font-semibold">
        &larr; Back to Our Fleet
      </Link>
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-x-12 gap-y-10">
        <div className="md:col-span-3">
          <div className="w-full aspect-video mb-12">
            <ImageCarousel images={bike.image_urls} />
          </div>
          <div className="space-y-2">
            <AccordionItem title="Technical Features">
              <TechnicalFeaturesList features={bike.technical_features} />
            </AccordionItem>

            <AccordionItem title="Included in Rental" defaultOpen={true}>
              <IncludedInRentalList items={commonData.included} deposit={bike.security_deposit} />
            </AccordionItem>

            <AccordionItem title="Optional Extras">
              <OptionalExtrasList specificExtra={bike.extras_specific} commonExtras={commonData.extras} />
            </AccordionItem>

            <AccordionItem title="Requirements">
              <RequirementsList items={commonData.requirements} />
            </AccordionItem>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="sticky top-24 space-y-6">
            <div>
              <h1 className="text-4xl font-extrabold text-cloud tracking-tight">{bike.name}</h1>
              <p className="mt-4 text-space">{bike.description}</p>
            </div>
            <BookingWidget bike={bike} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MotorcyclePage;