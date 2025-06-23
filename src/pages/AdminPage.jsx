import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function AdminPage() {
  const [motorcycles, setMotorcycles] = useState([]);

  const fetchMotorcycles = () => {
    fetch("http://localhost:3000/motorcycles")
      .then((res) => res.json())
      .then((data) => setMotorcycles(data))
      .catch((error) => console.error("Initial fetch failed:", error));
  };

  useEffect(() => {
    fetchMotorcycles();
  }, []);

  const handleStatusChange = (bikeToUpdate, newStatus) => {
    fetch(`http://localhost:3000/motorcycles/${bikeToUpdate.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Network response was not ok, status: ${res.status}`);
        return res.json();
      })
      .then(() => {
        fetchMotorcycles();
      })
      .catch((error) => {
        console.error("Failed to update status:", error);
        alert("Failed to update status. Check the console for more details.");
      });
  };

  return (
    <div className="text-white">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Admin Panel</h2>
        <Link
          to="/"
          className="bg-brand-orange text-white font-bold py-2 px-4 rounded-lg hover:brightness-95 transition-all"
        >
          &larr; Back to Site
        </Link>
      </div>

      <div className="bg-brand-black/80 border border-white/10 shadow-lg rounded-lg p-4">
        {motorcycles.map((bike) => (
          <div
            key={bike.id}
            className="flex flex-col sm:flex-row items-center justify-between border-b border-white/10 last:border-b-0 py-4 gap-4"
          >
            <div>
              <p className="font-bold text-lg text-white">{bike.name}</p>
              <p className="text-sm text-white/70">
                Current Status:
                <span className="font-semibold ml-1 text-white">
                  {bike.status.charAt(0).toUpperCase() + bike.status.slice(1)}
                </span>
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleStatusChange(bike, "available")}
                disabled={bike.status === "available"}
                className="px-3 py-1 text-sm bg-green-500 text-white rounded disabled:bg-gray-500 disabled:cursor-not-allowed"
              >
                Available
              </button>
              <button
                onClick={() => handleStatusChange(bike, "rented")}
                disabled={bike.status === "rented"}
                className="px-3 py-1 text-sm bg-yellow-500 text-white rounded disabled:bg-gray-500 disabled:cursor-not-allowed"
              >
                Rented
              </button>
              <button
                onClick={() => handleStatusChange(bike, "maintenance")}
                disabled={bike.status === "maintenance"}
                className="px-3 py-1 text-sm bg-red-500 text-white rounded disabled:bg-gray-500 disabled:cursor-not-allowed"
              >
                Maintenance
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminPage;
