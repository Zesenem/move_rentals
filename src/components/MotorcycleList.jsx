import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "../services/twice.js";
import MotorcycleCard from "./MotorcycleCard";
import ComingSoonCard from "./ComingSoonCard";

function MotorcycleList() {
  const {
    data: motorcycles = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  if (isLoading) {
    return <p className="text-center text-space py-20">Loading motorcycles...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 py-20">Error fetching data: {error.message}</p>;
  }

  return (
    <div id="fleet-section" className="container mx-auto px-4 py-16">
      <h2 className="text-4xl font-extrabold text-center text-steel mb-12">Our Fleet</h2>
      <div className="flex flex-wrap justify-center gap-8">
        {motorcycles.map((bike, index) => (
          <MotorcycleCard key={bike.id} bike={bike} index={index} />
        ))}
        <ComingSoonCard delay={`${motorcycles.length * 150}ms`} />
      </div>
    </div>
  );
}

export default MotorcycleList;
