import { lazy, Suspense, useEffect, useRef, useState } from "react";

const MotorcycleList = lazy(() => import("./MotorcycleList.jsx"));

function LazyMotorcycleList() {
  const containerRef = useRef(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if (!containerRef.current || shouldLoad) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "500px 0px" },
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [shouldLoad]);

  return (
    <div ref={containerRef} id="fleet-section">
      {shouldLoad ? (
        <Suspense
          fallback={
            <section className="py-16 sm:py-24">
              <div className="container mx-auto px-4 text-center">
                <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-graphite border-t-cloud" />
                <span className="sr-only">Loading fleet</span>
              </div>
            </section>
          }
        >
          <MotorcycleList />
        </Suspense>
      ) : (
        <section className="min-h-[50vh]" aria-label="Fleet section" />
      )}
    </div>
  );
}

export default LazyMotorcycleList;
