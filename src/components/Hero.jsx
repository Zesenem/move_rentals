import Button from "./Button";

function Hero() {
  const scrollToFleet = () => {
    document.getElementById("fleet-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden text-center">
      <div className="relative z-20 mx-auto max-w-4xl px-4">
        <h1 className="card-animate text-4xl font-extrabold tracking-tight text-steel drop-shadow-lg sm:text-5xl md:text-6xl">
          Your Adventure on <span className="text-cloud">Two Wheels</span> Starts Here.
        </h1>
        <div
          className="card-animate mx-auto mt-24 max-w-3xl space-y-4 text-lg text-space"
          style={{ animationDelay: "200ms" }}
        >
          <p>
            Explore Lisbon with Confidence! At Move, we make getting around Lisbon <strong>easy,
            fun, and worry-free.</strong>{" "}
          </p>
          <p>
            Located in the heart of the city, we offer reliable, well-maintained scooters for rent —
            perfect for exploring every corner of this beautiful city at your own pace.
          </p>
          <p>
            Whether you’re here for a day or a week, our local team is here to help you ride safely
            and smoothly. No hidden fees, no hassle — <strong>just freedom on two wheels.</strong>
          </p>
        </div>
        <div className="card-animate mt-10" style={{ animationDelay: "400ms" }}>
          <Button onClick={scrollToFleet} variant="primary" size="large">
            Browse Our Fleet
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Hero;
