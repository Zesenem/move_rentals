# **Move Rentals MVP**

This repository contains the Minimum Viable Product (MVP) for "Move Rentals," a motorcycle rental service based in Portugal. The goal of this MVP is to provide a basic online presence to showcase available motorcycles and allow potential customers to express interest.

## **Features (MVP)**

* **Motorcycle Listing:** Displays a list of available motorcycles with essential details.  
* **Basic Details:** Each motorcycle entry includes information such as model, and price.  
* **Contact Information:** Provides a way for users to get in touch for rentals.  
* **Responsive Design:** Optimized for viewing on various devices (mobile, tablet, desktop).  
* **Admin Panel (Local):** Includes a simple interface for managing motorcycle data locally (via JSON Server).

## **Technologies Used**

This project is built using modern web technologies:

* **React:** A JavaScript library for building user interfaces.  
* **Vite:** A fast build tool for modern web projects.  
* **Tailwind CSS:** A utility-first CSS framework for rapid UI development.  
* **JSON Server:** Used for local API mocking to simulate a backend for development purposes.  
* **gh-pages:** An npm package for easily deploying to GitHub Pages.

## **Local Development Setup**

To run this project on your local machine:

1. **Clone the repository:**  
   git clone https://github.com/Zesenem/move_rentals 
   cd move_rentals/move-rental-app

2. **Install dependencies:**  
   npm install

3. **Start the JSON Server (for mock data):**  
   npm run server

   This will start a local server at http://localhost:3000 serving data from db.json.  
4. **Start the development server:**  
   npm run dev

   This will open the application in your browser, typically at http://localhost:5173.

## **Deployment**

This MVP is deployed using GitHub Pages.

* **Live URL:** [https://Zesenem.github.io/move_rentals/]

To deploy updates, ensure your package.json and vite.config.js are configured as per the deployment guide, and then run:

npm run deploy

## **Future Enhancements**

Potential future developments for Move Rentals could include:

* Robust backend for persistent data storage (e.g., Firebase, Node.js with a database).  
* User authentication and personalized dashboards.  
* Booking system with date/time selection and availability checking.  
* Payment gateway integration.  
* More detailed motorcycle specifications and image galleries.  
* Advanced search and filtering options.
