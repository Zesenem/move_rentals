import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FaRoad } from "react-icons/fa";
import { fetchFleetMetadata } from "../services/fleetMetadata.js";

const formatKilometres = (value) =>
  new Intl.NumberFormat("en-GB", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

const WEEK_IN_MILLISECONDS = 7 * 24 * 60 * 60 * 1000;

const getProjectedKilometres = (metadata, now = Date.now()) => {
  const commonData = metadata?.common_data;
  const verifiedKilometres = Number(commonData?.kilometres_driven) || 0;
  const weeklyEstimate = Number(commonData?.kilometres_weekly_estimate) || 0;
  const projectionStartedAt = Date.parse(commonData?.kilometres_projection_started_at || "");

  if (weeklyEstimate <= 0 || !Number.isFinite(projectionStartedAt)) {
    return verifiedKilometres;
  }

  const elapsed = Math.min(Math.max(now - projectionStartedAt, 0), WEEK_IN_MILLISECONDS);
  return verifiedKilometres + weeklyEstimate * (elapsed / WEEK_IN_MILLISECONDS);
};

function MileageCounter() {
  const counterRef = useRef(null);
  const displayedKilometresRef = useRef(0);
  const [hasEnteredView, setHasEnteredView] = useState(false);
  const [displayedKilometres, setDisplayedKilometres] = useState(0);
  const [now, setNow] = useState(Date.now());
  const { data: metadata } = useQuery({
    queryKey: ["fleet-metadata"],
    queryFn: fetchFleetMetadata,
  });
  const verifiedKilometres = Number(metadata?.common_data?.kilometres_driven) || 0;
  const weeklyEstimate = Number(metadata?.common_data?.kilometres_weekly_estimate) || 0;
  const projectedKilometres = getProjectedKilometres(metadata, now);
  const isCounterVisible = projectedKilometres > 0;
  displayedKilometresRef.current = displayedKilometres;

  useEffect(() => {
    if (!counterRef.current) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasEnteredView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(counterRef.current);
    return () => observer.disconnect();
  }, [verifiedKilometres, weeklyEstimate]);

  useEffect(() => {
    if (!hasEnteredView || projectedKilometres <= 0) {
      return undefined;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplayedKilometres(projectedKilometres);
      return undefined;
    }

    const duration = 1200;
    const startTime = performance.now();
    const startValue = displayedKilometresRef.current;
    let animationFrame;

    const animate = (currentTime) => {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      setDisplayedKilometres(
        startValue + (projectedKilometres - startValue) * easedProgress,
      );

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [hasEnteredView, projectedKilometres]);

  useEffect(() => {
    if (!hasEnteredView || !isCounterVisible) {
      return undefined;
    }

    const interval = window.setInterval(() => setNow(Date.now()), 5000);
    return () => window.clearInterval(interval);
  }, [hasEnteredView, isCounterVisible]);

  if (projectedKilometres <= 0) {
    return null;
  }

  return (
    <section ref={counterRef} aria-label="Kilometres ridden with Move" className="border-y border-graphite/40 bg-arsenic/60">
      <div className="container mx-auto flex items-center justify-center gap-4 px-4 py-7 text-center sm:gap-6">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cloud/10 text-xl text-cloud">
          <FaRoad aria-hidden="true" />
        </span>
        <p className="text-space">
          <span className="block text-3xl font-extrabold tabular-nums text-cloud sm:inline sm:text-4xl">
            {formatKilometres(displayedKilometres)} km
          </span>
          <span className="ml-0 block text-sm font-semibold uppercase tracking-[0.16em] sm:ml-4 sm:inline">
            explored together · and counting
          </span>
        </p>
      </div>
    </section>
  );
}

export default MileageCounter;
