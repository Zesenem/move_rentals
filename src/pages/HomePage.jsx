// src/pages/HomePage.jsx
import Hero from '../components/Hero'; // Import the new Hero component
import MotorcycleList from '../components/MotorcycleList';

function HomePage() {
  return (
    <>
      <Hero />
      {/* We add an ID here for the scroll-to function to find */}
      <div id="fleet-section" className="pt-12">
        <h2 className="text-3xl font-bold text-slate-200 mb-8 text-center">Our Fleet</h2>
        <MotorcycleList />
      </div>
    </>
  );
}

export default HomePage;