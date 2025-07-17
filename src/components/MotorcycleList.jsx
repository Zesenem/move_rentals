import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { FaExclamationTriangle } from "react-icons/fa";
import { fetchProducts } from "../services/twice.js";
import MotorcycleCard from "./MotorcycleCard";
import ComingSoonCard from "./ComingSoonCard";
import MotorcycleCardSkeleton from "./MotorcycleCardSkeleton.jsx";
import useIsMobile from "../hooks/useIsMobile";

function MotorcycleList() {
  const isMobile = useIsMobile();
  const {
    data: motorcycles = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const filteredAndSortedMotorcycles = useMemo(() => {
    let bikesToShow = motorcycles;

    if (isMobile) {
      bikesToShow = bikesToShow.filter((bike) => bike.price_per_day <= 998);
    }

    return [...bikesToShow].sort((a, b) => a.price_per_day - b.price_per_day);
  }, [motorcycles, isMobile]);

  const renderContent = () => {
    if (isLoading) {
      return [...Array(3)].map((_, i) => <MotorcycleCardSkeleton key={i} />);
    }

    if (isError) {
      return (
        <div className="flex max-w-sm flex-col items-center justify-center rounded-lg bg-phantom p-8 text-center">
          <FaExclamationTriangle className="mb-4 text-5xl text-red-500" />
          <h3 className="mb-2 text-xl font-bold text-cloud">Could Not Load Fleet</h3>
          <p className="text-space">{error.message}</p>
        </div>
      );
    }

    return (
      <>
        {filteredAndSortedMotorcycles.map((bike, index) => (
          <MotorcycleCard key={bike.id} bike={bike} index={index} />
        ))}
        <ComingSoonCard />
      </>
    );
  };

  return (
    <section id="fleet-section" className="py-16 sm:py-24">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-extrabold text-steel">Our Fleet</h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-space">
          Affordable, reliable, and ready for your Lisbon adventure. Pick your ride.
        </p>

        <div className="mt-12 flex flex-wrap justify-center gap-8">{renderContent()}</div>
      </div>
    </section>
  );
}

export default MotorcycleList;
