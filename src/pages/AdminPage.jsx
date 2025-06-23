import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function AdminPage() {
  const [motorcycles, setMotorcycles] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/motorcycles")
      .then((res) => res.json())
      .then((data) => setMotorcycles(data))
      .catch((error) => console.error("Initial fetch failed:", error));
  }, []);

  const handleStatusChange = (bikeToUpdate, newStatus) => {
    fetch(`http://localhost:3000/motorcycles/${bikeToUpdate.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: newStatus,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Network response was not ok, status: ${res.status}`);
        }
        return res.json();
      })
      .then((updatedBikeFromServer) => {
        setMotorcycles((currentMotorcycles) =>
          currentMotorcycles.map((bike) =>
            bike.id === bikeToUpdate.id ? updatedBikeFromServer : bike
          )
        );
      })
      .catch((error) => {
        console.error("Failed to update status:", error);
        alert("Failed to update status. Check the console for more details.");
      });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-700">Admin Panel</h2>
        <Link
          to="/"
          className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700"
        >
          &larr; Back to Site
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg p-4">
        {motorcycles.map((bike) => (
          <div
            key={bike.id}
            className="flex items-center justify-between border-b last:border-b-0 py-4"
          >
            <div>
              <p className="font-bold text-lg">{bike.name}</p>
              <p className="text-sm text-gray-600">
                Current Status:
                <span className="font-semibold ml-1">
                  {bike.status.charAt(0).toUpperCase() + bike.status.slice(1)}
                </span>
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleStatusChange(bike, "available")}
                disabled={bike.status === "available"}
                className="px-3 py-1 text-sm bg-green-500 text-white rounded disabled:bg-gray-300"
              >
                Available
              </button>
              <button
                onClick={() => handleStatusChange(bike, "rented")}
                disabled={bike.status === "rented"}
                className="px-3 py-1 text-sm bg-yellow-500 text-white rounded disabled:bg-gray-300"
              >
                Rented
              </button>
              <button
                onClick={() => handleStatusChange(bike, "maintenance")}
                disabled={bike.status === "maintenance"}
                className="px-3 py-1 text-sm bg-red-500 text-white rounded disabled:bg-gray-300"
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
