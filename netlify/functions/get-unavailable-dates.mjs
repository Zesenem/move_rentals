import { Buffer } from "buffer";
import process from "process";

export const handler = async (event) => {
  const { bikeId } = event.queryStringParameters;
  
  console.log("Received request for bikeId:", bikeId);
  
  if (!bikeId) {
    return { statusCode: 400, body: JSON.stringify({ error: "bikeId is required." }) };
  }

  const API_BASE_URL = "https://api.twicecommerce.com/admin";
  const API_ID = process.env.TWICE_API_ID;
  const API_SECRET = process.env.TWICE_API_SECRET;

  if (!API_ID || !API_SECRET) {
    console.error("Missing API credentials");
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "API credentials are not configured." }),
    };
  }

  const encodedCredentials = Buffer.from(`${API_ID}:${API_SECRET}`).toString("base64");
  const twiceHeaders = {
    "Content-Type": "application/json",
    Authorization: `Basic ${encodedCredentials}`,
    "x-rentle-version": "2023-02-01",
  };

  try {
    let allOrders = [];
    let nextPageToken = null;
    let requestCount = 0;
    const maxRequests = 10; // Prevent infinite loops
    
    do {
      requestCount++;
      console.log(`Making request ${requestCount} to fetch orders`);
      
      const url = new URL(`${API_BASE_URL}/orders`);
      if (nextPageToken) {
        url.searchParams.append("pageToken", nextPageToken);
      }
      
      console.log("Fetching URL:", url.toString());
      
      const response = await fetch(url.toString(), { headers: twiceHeaders });
      
      console.log("Response status:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response:", errorText);
        return { 
          statusCode: response.status, 
          body: JSON.stringify({ 
            error: `API request failed with status ${response.status}`,
            details: errorText 
          }) 
        };
      }
      
      const responseData = await response.json();
      console.log("Response data structure:", {
        hasData: !!responseData.data,
        dataLength: responseData.data?.length || 0,
        hasNextPageToken: !!responseData.nextPageToken,
        nextPageToken: responseData.nextPageToken
      });
      
      // Handle different response structures
      if (responseData.data && Array.isArray(responseData.data)) {
        allOrders = allOrders.concat(responseData.data);
      } else if (Array.isArray(responseData)) {
        // In case the response is directly an array
        allOrders = allOrders.concat(responseData);
      } else {
        console.error("Unexpected response structure:", responseData);
        return {
          statusCode: 500,
          body: JSON.stringify({ error: "Unexpected API response structure" })
        };
      }
      
      nextPageToken = responseData.nextPageToken;
      
      // Safety check to prevent infinite loops
      if (requestCount >= maxRequests) {
        console.warn("Max requests reached, breaking pagination loop");
        break;
      }
      
    } while (nextPageToken);

    console.log(`Total orders fetched: ${allOrders.length}`);

    // Filter orders for the specific bike
    const bookingsForBike = allOrders.filter(
      (order) => {
        const isNotCancelled = order.state !== "cancelled";
        const hasTargetBike = order.items && order.items.some((item) => item.productId === bikeId);
        
        console.log(`Order ${order.id}: cancelled=${order.state === "cancelled"}, hasTargetBike=${hasTargetBike}`);
        
        return isNotCancelled && hasTargetBike;
      }
    );

    console.log(`Bookings for bike ${bikeId}: ${bookingsForBike.length}`);

    // Format the bookings
    const formattedBookings = bookingsForBike.map((order) => {
      try {
        const startDate = new Date(order.startDate);
        const endDate = new Date(startDate);
        
        // Add the duration to get the end date
        if (order.duration && order.duration.value) {
          endDate.setDate(startDate.getDate() + (order.duration.value - 1));
        } else {
          console.warn(`Order ${order.id} missing duration, using start date as end date`);
          endDate.setTime(startDate.getTime());
        }

        const booking = {
          orderId: order.id,
          startDate: order.startDate,
          endDate: endDate.toISOString(),
          pickupTime: order.meta?.pickupTime || "10:00",
          state: order.state
        };
        
        console.log(`Formatted booking:`, booking);
        return booking;
      } catch (error) {
        console.error(`Error formatting order ${order.id}:`, error);
        return null;
      }
    }).filter(Boolean); // Remove null entries

    console.log(`Returning ${formattedBookings.length} formatted bookings`);
    
    return { 
      statusCode: 200, 
      body: JSON.stringify(formattedBookings) 
    };
    
  } catch (error) {
    console.error("Unexpected error:", error);
    console.error("Error stack:", error.stack);
    return { 
      statusCode: 500, 
      body: JSON.stringify({ 
        error: "Internal server error",
        message: error.message 
      }) 
    };
  }
};
