import Button from './Button';

const scrollToFleet = () => {
    document.getElementById('fleet-section')?.scrollIntoView({ behavior: 'smooth' });
};

function Hero() {
    return (
        <div className="relative min-h-screen flex items-center justify-center text-center overflow-hidden">
            <div className="relative z-10 max-w-4xl mx-auto px-4">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-steel tracking-tight drop-shadow-lg card-animate">
                    Your Adventure on <span className="text-cloud">Two Wheels</span> Starts Here.
                </h1>
                
                <div className="mt-24 space-y-4 max-w-3xl mx-auto">
                    <p 
                        className="text-lg text-space card-animate" 
                        style={{ animationDelay: '200ms' }}
                    >
                        Explore Lisbon with Confidence At Move Rentals, we make getting around Lisbon easy, fun, and worry-free. Located in the heart of the city, we offer reliable, well-maintained scooters for rent — perfect for exploring every corner of this beautiful city at your own pace.
                    </p>
                    <p 
                        className="text-lg text-space card-animate" 
                        style={{ animationDelay: '300ms' }}
                    >
                        Whether you’re here for a day or a week, our local team is here to help you ride safely and smoothly. No hidden fees, no hassle — just freedom on two wheels. Your ride. Your rules. Lisbon awaits.
                    </p>
                </div>

                <div className="mt-10 card-animate" style={{ animationDelay: '400ms' }}>
                    <Button onClick={scrollToFleet} variant="primary" className="text-lg px-8 py-3">
                        Browse Our Fleet
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default Hero;