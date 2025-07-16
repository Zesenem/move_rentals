import { Helmet } from "react-helmet-async";

function TermsPage() {
  return (
    <>
      <Helmet>
        <title>Terms & Conditions | Move Rentals</title>
        <meta
          name="description"
          content="Read the terms and conditions for renting a scooter or motorcycle from Move Rentals in Lisbon."
        />
      </Helmet>
      <div className="container mx-auto px-4 py-12">
        <div className="prose prose-invert mx-auto max-w-4xl">
          <h1 className="text-4xl font-extrabold text-cloud mb-8">Terms & Conditions</h1>

          <div className="space-y-8 text-space">
            <section>
              <h2 className="text-2xl font-bold text-steel mb-3">1. Introduction</h2>
              <p>
                Welcome to Move Rentals. These terms and conditions outline the rules and
                regulations for the use of our scooter rental services. By booking a scooter with
                us, you agree to comply with and be bound by these terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-steel mb-3">2. Rental Requirements</h2>
              <p>
                To rent a scooter from Move Rentals, all renters must meet the following criteria:
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Minimum Age:</strong> Renters must be at least 18 years of age.
                </li>
                <li>
                  <strong>Driving License:</strong> A valid driving license is mandatory. For 50cc
                  scooters, a standard car license (Category B) or a moped license (Category AM) is
                  required. For 125cc scooters, a valid A1, A2, or A category motorcycle license is
                  required, or a Category B license held for more than 3 years, depending on local
                  regulations.
                </li>
                <li>
                  <strong>Identification:</strong> A valid passport or national ID card is required
                  at the time of rental.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-steel mb-3">3. Security Deposit</h2>
              <p>
                A security deposit of €200 is required for each scooter rental. This deposit is
                taken as a pre-authorization on a valid credit card and is fully refundable upon the
                safe and timely return of the scooter and all equipment in its original condition,
                without damage or fines.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-steel mb-3">
                4. Bookings, Payments, and Cancellations
              </h2>
              <p>
                <strong>Bookings:</strong> All bookings must be made through our website. A booking
                is considered confirmed only after full payment has been received.
              </p>
              <p>
                <strong>Cancellations:</strong> Our cancellation policy is as follows:
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  Full refund for cancellations made more than 7 days before the rental start date.
                </li>
                <li>
                  50% refund for cancellations made between 48 hours and 7 days before the rental
                  start date.
                </li>
                <li>
                  No refund for cancellations made less than 48 hours before the rental start date
                  or for no-shows.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-steel mb-3">5. Renter's Obligations</h2>
              <p>The renter is responsible for:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  Operating the scooter safely and in accordance with all Portuguese traffic laws.
                </li>
                <li>Ensuring the mandatory use of the provided helmet(s).</li>
                <li>All traffic and parking fines incurred during the rental period.</li>
                <li>Returning the scooter with the same level of fuel as when it was picked up.</li>
                <li>
                  Immediately reporting any accident, damage, or theft to Move Rentals and the
                  appropriate authorities.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-steel mb-3">6. Insurance and Liability</h2>
              <p>
                All rentals include basic third-party liability insurance as required by Portuguese
                law. This insurance covers damages to third parties but does NOT cover damage to the
                rented scooter, theft of the scooter, or personal injury to the rider. The renter is
                fully liable for the cost of any damages to or theft of the scooter up to the full
                value of the vehicle.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-steel mb-3">7. Governing Law</h2>
              <p>
                This agreement shall be governed by and construed in accordance with the laws of
                Portugal. Any disputes arising from this agreement shall be subject to the exclusive
                jurisdiction of the courts of Lisbon.
              </p>
            </section>

            <p className="!mt-12 text-sm text-graphite">Last updated: July 16, 2025</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default TermsPage;
