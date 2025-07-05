import Hero from "../components/Hero";
import MotorcycleList from "../components/MotorcycleList";

function HomePage() {
  return (
    <>
      <Hero />
      <div id="fleet-section" className="pt-12">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">Our Fleet</h2>
        <MotorcycleList />
      </div>
    </>
  );
}

export default HomePage;
