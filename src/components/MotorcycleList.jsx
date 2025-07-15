import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "../services/twice.js";
import MotorcycleCard from "./MotorcycleCard";
import ComingSoonCard from "./ComingSoonCard";
import MotorcycleCardSkeleton from "./MotorcycleCardSkeleton.jsx";
import { FaExclamationTriangle } from "react-icons/fa";

function MotorcycleList() {
  const {
    data: motorcycles = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const sortedMotorcycles = motorcycles.sort((a, b) => a.price_per_day - b.price_per_day);

  if (isLoading) {
    return (
      <div id="fleet-section" className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-extrabold text-center text-steel mb-12">Our Fleet</h2>
        <div className="flex flex-wrap justify-center gap-8">
          {[...Array(3)].map((_, i) => (
            <MotorcycleCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <FaExclamationTriangle className="text-red-500 text-5xl mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-cloud mb-2">Could Not Load Fleet</h2>
        <p className="text-space">{error.message}</p>
      </div>
    );
  }

  return (
    <div id="fleet-section" className="container mx-auto px-4 py-16">
      <h2 className="text-4xl font-extrabold text-center text-steel mb-12">Our Fleet</h2>

      <div className="flex flex-wrap justify-center gap-8">
        {sortedMotorcycles.map((bike, index) => (
          <MotorcycleCard key={bike.id} bike={bike} index={index} />
        ))}
      </div>

      <div className="mt-8">
        <ComingSoonCard />
      </div>
    </div>
  );
}

export default MotorcycleList;
