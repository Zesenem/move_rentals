import Button from './Button';

const scrollToFleet = () => {
  document.getElementById('fleet-section')?.scrollIntoView({ behavior: 'smooth' });
};

function Hero() {
  return (
    <div className="text-center py-32 sm:py-40">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-steel tracking-tight drop-shadow-lg card-animate">
          Your Adventure on{' '}
          <span className="text-cloud">Two Wheels</span> Starts Here.
        </h1>
        <p 
          className="mt-6 max-w-2xl mx-auto text-lg text-space card-animate" 
          style={{ animationDelay: '200ms' }}
        >
          The easiest way to rent a scooter in the heart of Portugal. Simple, fast, and ready for the road.
        </p>
        <div className="mt-10 card-animate" style={{ animationDelay: '400ms' }}>
          <Button onClick={scrollToFleet} variant="primary" className="text-lg">
            Browse Our Fleet
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Hero;
