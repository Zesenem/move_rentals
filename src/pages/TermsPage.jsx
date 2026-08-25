import Seo from "../components/Seo";

function TermsPage() {
  return (
    <>
      <Seo
        title="Terms of Service | Move Rentals"
        description="Read the Terms of Service for road-vehicle and personal-watercraft rentals from Move Rentals in Lisbon."
        path="/terms-and-conditions"
      />
      <div className="container mx-auto px-4 py-12">
        <div className="prose prose-invert mx-auto max-w-4xl">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold text-cloud mb-2">Terms of Service</h1>
            <p className="text-steel font-semibold">
              Move LX Unipessoal LDA (Trading as Move Rentals)
            </p>
            <p className="text-sm text-graphite">
              Registered office: Rua Carlos Reis, nº 63, Lisbon, Portugal
              <br />
              Customer collection garage: Rua da Beneficência 44D, 1600-031 Lisboa, Portugal
            </p>
          </div>

          <div className="space-y-8 text-space">
            <section>
              <h2 className="text-2xl font-bold text-steel mb-3">1. Scope of Agreement</h2>
              <p>
                These Terms of Service govern all rental contracts between the customer (“Client”)
                and Move LX Unipessoal LDA, operating under the brand Move Rentals. By placing a
                reservation, the Client agrees to be bound by these terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-steel mb-3">2. Rental Requirements</h2>
              <p>To rent a vehicle or personal watercraft, the Client must:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>Be at least 21 years old.</li>
                <li>
                  Hold a valid licence appropriate to the selected road vehicle (for example,
                  AM, A1, A2, A or B where applicable).
                </li>
                <li>
                  Hold a valid nautical licence appropriate to the selected personal watercraft.
                </li>
                <li>Provide valid identification (passport or citizen card).</li>
                <li>Provide a valid form of payment and any required security deposit.</li>
              </ul>
              <p>
                Move Rentals reserves the right to refuse service to any client who does not meet
                these conditions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-steel mb-3">3. Reservation & Payment</h2>
              <ul className="list-disc space-y-2 pl-5">
                <li>Reservations must be confirmed by full or partial payment as required.</li>
                <li>
                  Upon payment confirmation, the rental becomes non-refundable (see section 7).
                </li>
                <li>
                  Security deposits are required only where stated for the selected vehicle and
                  rental option, and are payable before the rental begins.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-steel mb-3">4. Vehicle and Watercraft Use</h2>
              <p>The Client agrees to:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  Use the vehicle or watercraft in accordance with applicable traffic,
                  navigation and safety rules.
                </li>
                <li>
                  Not drive under the influence of alcohol, drugs, or medication that impairs
                  driving.
                </li>
                <li>Not allow third parties to use the vehicle unless previously authorized.</li>
                <li>Secure the vehicle or watercraft when not in use, where applicable.</li>
                <li>
                  Follow the fuel arrangements stated for the selected rental option and rental
                  agreement.
                </li>
              </ul>
              <p>Failure to comply may result in additional fees or loss of security deposit.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-steel mb-3">
                4A. Personal-Watercraft / Jet-Ski Rental Conditions
              </h2>
              <p>
                The following conditions apply to personal-watercraft and jet-ski rentals, subject
                to availability and confirmation by Move Rentals:
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>A valid nautical licence appropriate to the selected watercraft is required.</li>
                <li>
                  Daily hire normally runs from 10:00 to 17:00 (7 hours), excludes fuel and
                  requires the security deposit stated for the selected watercraft.
                </li>
                <li>
                  Hourly hire has a minimum duration of 3 hours, includes fuel and does not
                  require a security deposit.
                </li>
                <li>
                  Hourly rates range from €120 to €180 per hour, depending on season and
                  availability.
                </li>
                <li>The final rate and availability are confirmed at the time of booking.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-steel mb-3">5. Security Deposit</h2>
              <p>
                Where a security deposit is required, it is taken as a pre-authorization on a
                valid credit card. The amount varies by vehicle and rental option. This deposit is
                fully refundable upon the safe and timely return of the vehicle or watercraft and
                all included equipment in their original condition, free from damage, loss or
                applicable fines.
              </p>
              <p>
                The hourly personal-watercraft option described in section 4A does not require a
                security deposit. Where a reduced security-deposit package is purchased, the
                renter remains legally responsible for the full security deposit amount in the event
                of damage, loss or violations.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-steel mb-3">6. Insurance & Liability</h2>
              <p>Road-vehicle rentals include:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>Mandatory third-party liability insurance (as per Portuguese law).</li>
                <li>
                  Optional theft protection insurance, available at additional cost during booking.
                </li>
              </ul>
              <p>
                The applicable insurance and liability arrangements for personal-watercraft hire
                are confirmed in the individual rental agreement.
              </p>
              <p>In case of accident:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  If the Client is at fault, the insurance will be triggered and the entire deposit
                  is retained.
                </li>
                <li>
                  If the Client is not at fault, deposit is retained temporarily until liability is
                  confirmed.
                </li>
                <li>
                  If damages exceed the deposit or are not covered (e.g., illegal conduct), the
                  Client is fully responsible.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-steel mb-3">7. Refund Policy</h2>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  No refunds will be issued for cancellations initiated by the Client, regardless of
                  reason.
                </li>
                <li>
                  Reservation changes require 48 hours’ notice and are subject to availability.
                </li>
                <li>
                  In case of cancellation by Move Rentals, the full amount paid will be refunded
                  and/or a replacement offered.
                </li>
                <li>Early returns do not qualify for partial refunds.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-steel mb-3">8. Damage & Breakdown Policy</h2>
              <ul className="list-disc space-y-2 pl-5">
                <li>All damages must be reported immediately.</li>
                <li>
                  Non-accident damage (e.g., scratches, misuses) will be assessed and deducted from
                  the deposit.
                </li>
                <li>
                  If the breakdown is not the Client’s fault, Move Rentals will offer a replacement
                  or refund remaining rental days.
                </li>
                <li>Unauthorized repairs or modifications are strictly prohibited.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-steel mb-3">9. Late Return & Extensions</h2>
              <ul className="list-disc space-y-2 pl-5">
                <li>Late returns may incur penalty fees.</li>
                <li>Extensions are allowed only with prior approval and availability.</li>
                <li>The current rental rate at the time of extension applies.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-steel mb-3">10. Fines & Infractions</h2>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  The Client is fully responsible for any traffic fines or legal violations during
                  the rental period.
                </li>
                <li>
                  If Move Rentals must handle any administrative tasks (e.g., transferring fines), a
                  processing fee may be applied.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-steel mb-3">11. Force Majeure</h2>
              <p>
                Move Rentals is not liable for failure to perform obligations due to external
                causes, including natural disasters, theft, accidents, strikes, or government
                regulations.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-steel mb-3">12. Termination of Contract</h2>
              <p>
                Move Rentals reserves the right to terminate the rental contract without refund if
                the Client:
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>Violates traffic or criminal laws.</li>
                <li>Uses the vehicle in a negligent or abusive manner.</li>
                <li>Fails to comply with these Terms.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-steel mb-3">13. Governing Law & Disputes</h2>
              <p>
                These Terms are governed by the laws of Portugal. In the event of a dispute, the
                parties agree to submit first to amicable resolution, and, if unresolved, to the
                competent courts of Lisbon.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-steel mb-3">14. Contact</h2>
              <p>Move LX Unipessoal LDA</p>
              <p>Registered office: Rua Carlos Reis, nº 63, Lisbon</p>
              <p>Customer collection garage: Rua da Beneficência 44D, 1600-031 Lisboa</p>
              <p>📧 move@move-rentals.com</p>
              <p>📞 +351 920 016 794</p>
            </section>

            <p className="!mt-12 text-sm text-graphite">Last updated: August 25, 2026</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default TermsPage;
