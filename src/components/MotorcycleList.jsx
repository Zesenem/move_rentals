import { useState, useEffect } from 'react';

function MotorcycleList() {
  const [motorcycles, setMotorcycles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleRentNow = (bike) => {
    const phoneNumber = '351920016794';
    const message = `Hello! I would like to rent the ${bike.name}.`;
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, '_blank');
  };

  useEffect(() => {
    fetch('http://localhost:3000/motorcycles')
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then(data => {
        setMotorcycles(data);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center text-slate-300">Loading motorcycles...</p>;
  if (error) return <p className="text-center text-red-500">Error fetching data: {error.message}</p>;

  return (
    <div className="flex flex-wrap justify-center gap-8">
      {motorcycles.map((bike, index) => (
        <div
          key={bike.id}
          className="w-full max-w-sm bg-slate-800 border border-slate-700 rounded-lg shadow-lg flex flex-col overflow-hidden transition-all duration-300 hover:shadow-brand-orange/20 hover:border-slate-600 card-animate"
          style={{ animationDelay: `${index * 150}ms` }}
        >
          <div className="aspect-video">
            <img src={bike.image_url} alt={bike.name} className="w-full h-full object-cover" />
          </div>
          <div className="p-5 flex flex-col flex-grow">
            <h3 className="text-xl font-bold tracking-tight text-white h-14">{bike.name}</h3>
            <div className="flex items-center mt-2.5 mb-5">
              <span className={`px-3 py-1 text-xs font-semibold text-white rounded-full ${bike.status === 'available' ? 'bg-green-500' : bike.status === 'rented' ? 'bg-yellow-500' : 'bg-red-500'}`}>
                {bike.status.charAt(0).toUpperCase() + bike.status.slice(1)}
              </span>
            </div>
            <div className="mt-auto flex items-center justify-between">
              <div className="flex items-baseline text-white">
                <span className="text-3xl font-bold tracking-tight">€{bike.price_per_day.toFixed(2)}</span>
                <span className="text-sm font-semibold ml-1 text-slate-400">/day</span>
              </div>
              <button
                onClick={() => handleRentNow(bike)}
                className="text-white bg-brand-orange hover:bg-brand-orange-dark focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                Rent Now
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MotorcycleList;
