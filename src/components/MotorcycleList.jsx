import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FaExclamationTriangle } from "react-icons/fa";
import { fetchProducts } from "../services/twice.js";
import {
  filterFleetVehicles,
  getActiveFleetFilterCount,
  getFleetFilterOptions,
  hasActiveFleetFilters,
} from "../utils/fleetFilters.js";
import FleetFilters from "./FleetFilters.jsx";
import MotorcycleCard from "./MotorcycleCard";
import ComingSoonCard from "./ComingSoonCard";
import MotorcycleCardSkeleton from "./MotorcycleCardSkeleton.jsx";

function MotorcycleList() {
  const fleetSectionRef = useRef(null);
  const hasAutoOpenedFilters = useRef(false);
  const [isFleetVisible, setIsFleetVisible] = useState(false);
  const [isDesktopFiltersOpen, setIsDesktopFiltersOpen] = useState(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    types: [],
    licences: [],
    badges: [],
    priceRange: null,
    displacementRange: null,
  });
  const {
    data: motorcycles = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  useEffect(() => {
    if (!fleetSectionRef.current) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setIsFleetVisible(entry.isIntersecting),
      { threshold: 0.08 },
    );

    observer.observe(fleetSectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isFleetVisible && !hasAutoOpenedFilters.current) {
      setIsDesktopFiltersOpen(true);
      hasAutoOpenedFilters.current = true;
    }
  }, [isFleetVisible]);

  const filterOptions = useMemo(() => getFleetFilterOptions(motorcycles), [motorcycles]);
  const isFilterActive = hasActiveFleetFilters(filters, filterOptions);
  const activeFilterCount = getActiveFleetFilterCount(filters, filterOptions);

  const handleFilterToggle = (field, value) => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [field]: currentFilters[field].includes(value)
        ? currentFilters[field].filter((item) => item !== value)
        : [...currentFilters[field], value],
    }));
  };

  const handleRangeChange = (field, bound, value) => {
    const availableRange = field === "priceRange" ? filterOptions.priceRange : filterOptions.displacementRange;

    if (!availableRange) {
      return;
    }

    setFilters((currentFilters) => {
      const currentRange = currentFilters[field] || availableRange;
      const nextRange = { ...currentRange, [bound]: value };

      if (nextRange.min > nextRange.max) {
        nextRange[bound === "min" ? "max" : "min"] = value;
      }

      return { ...currentFilters, [field]: nextRange };
    });
  };

  const clearFilters = () => {
    setFilters({
      types: [],
      licences: [],
      badges: [],
      priceRange: null,
      displacementRange: null,
    });
  };

  const filteredAndSortedMotorcycles = useMemo(() => {
    const getSortValue = (bike) =>
      typeof bike.price_per_day === "number" && bike.price_per_day > 0
        ? bike.price_per_day
        : Number.POSITIVE_INFINITY;

    return [...filterFleetVehicles(motorcycles, filters)].sort((a, b) => {
      const priceDifference = getSortValue(a) - getSortValue(b);

      if (priceDifference !== 0) {
        return priceDifference;
      }

      return a.name.localeCompare(b.name);
    });
  }, [filters, motorcycles]);

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

    if (!filteredAndSortedMotorcycles.length && isFilterActive) {
      return (
        <div className="max-w-md rounded-2xl border border-dashed border-graphite/60 bg-phantom/60 p-8 text-center">
          <h3 className="text-xl font-bold text-cloud">No matching vehicles</h3>
          <p className="mt-2 text-space">Try widening the filters to see more of the fleet.</p>
          <button
            type="button"
            onClick={clearFilters}
            className="mt-5 rounded-xl border border-cloud/50 px-4 py-2 text-sm font-bold text-cloud transition-colors hover:bg-cloud hover:text-phantom"
          >
            Clear filters
          </button>
        </div>
      );
    }

    return (
      <>
        {filteredAndSortedMotorcycles.map((bike, index) => (
          <MotorcycleCard key={bike.id} bike={bike} index={index} />
        ))}
        {!isFilterActive && <ComingSoonCard />}
      </>
    );
  };

  return (
    <section ref={fleetSectionRef} id="fleet-section" className="py-16 sm:py-24">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-extrabold text-steel">Our Fleet</h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-space">
          From city scooters to premium bikes and special vehicles, pick the ride that fits your plan.
        </p>

        {!isLoading && !isError && (
          <FleetFilters
            isDesktopVisible={isFleetVisible}
            isDesktopOpen={isDesktopFiltersOpen}
            onDesktopToggle={() => setIsDesktopFiltersOpen((isOpen) => !isOpen)}
            isMobileOpen={isMobileFiltersOpen}
            onMobileOpen={() => setIsMobileFiltersOpen(true)}
            onMobileClose={() => setIsMobileFiltersOpen(false)}
            activeFilterCount={activeFilterCount}
            options={filterOptions}
            filters={filters}
            onToggle={handleFilterToggle}
            onRangeChange={handleRangeChange}
            onClear={clearFilters}
            resultCount={filteredAndSortedMotorcycles.length}
          />
        )}

        <div className="mt-12 flex flex-wrap justify-center gap-8">{renderContent()}</div>
      </div>
    </section>
  );
}

export default MotorcycleList;
