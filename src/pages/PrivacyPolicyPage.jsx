import { Helmet } from "react-helmet-async";

function PrivacyPolicyPage() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | Move Rentals</title>
        <meta
          name="description"
          content="Learn how Move Rentals collects, uses, and protects your personal data."
        />
      </Helmet>
      <div className="container mx-auto px-4 py-12">
        <div className="prose prose-invert mx-auto max-w-4xl">
          <h1 className="text-4xl font-extrabold text-cloud mb-8">Privacy Policy</h1>

          <div className="space-y-8 text-space">
            <p>
              Your privacy is important to us. It is Move Rentals' policy to respect your privacy
              regarding any information we may collect from you across our website, and other sites
              we own and operate.
            </p>

            <section>
              <h2 className="text-2xl font-bold text-steel mb-3">1. Information We Collect</h2>
              <p>We collect information in the following ways:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Information you provide to us:</strong> This includes personal details you
                  provide when you make a booking, such as your full name, email address, phone
                  number, and a copy of your driving license.
                </li>
                <li>
                  <strong>Payment Information:</strong> To process payments, we use a third-party
                  payment processor (Revolut). We do not store your full credit card details on our
                  servers.
                </li>
                <li>
                  <strong>Usage and Technical Data:</strong> When you visit our site, we may
                  automatically log standard data provided by your web browser. This may include
                  your device’s Internet Protocol (IP) address, your browser type and version, the
                  pages you visit, the time and date of your visit, the time spent on each page, and
                  other details about your visit. With your consent, we may also record your session
                  for debugging and service improvement purposes.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-steel mb-3">2. How We Use Your Information</h2>
              <p>We use the information we collect for various purposes, including to:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>Process and manage your bookings and rentals.</li>
                <li>
                  Communicate with you about your booking, including sending confirmations and
                  updates.
                </li>
                <li>Provide customer support.</li>
                <li>Ensure the security of our services and prevent fraud.</li>
                <li>Comply with legal obligations, such as verifying driving licenses.</li>
                <li>Improve our website and services, based on usage patterns and feedback.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-steel mb-3">3. Data Sharing and Disclosure</h2>
              <p>
                We do not sell your personal information. We may share your data with third-party
                service providers who perform services on our behalf, such as:
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Payment Processors:</strong> To securely handle payments (e.g., Revolut).
                </li>
                <li>
                  <strong>Booking Management Platforms:</strong> To manage our rental inventory
                  (e.g., Twice Commerce).
                </li>
                <li>
                  <strong>Error and Performance Monitoring:</strong> To help us identify and fix
                  issues with our website (e.g., Sentry).
                </li>
              </ul>
              <p>
                We only share the information necessary for them to perform their functions and
                require them to protect your data in a manner consistent with this policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-steel mb-3">4. Your Rights Under GDPR</h2>
              <p>
                As we operate in the European Union, you have rights under the General Data
                Protection Regulation (GDPR), including:
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>The right to access, update, or delete the information we have on you.</li>
                <li>The right of rectification.</li>
                <li>The right to object to our processing of your personal data.</li>
                <li>The right to data portability.</li>
              </ul>
              <p>
                To exercise these rights, please contact us at the email address provided below.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-steel mb-3">5. Cookies</h2>
              <p>
                We use cookies to help improve your experience on our website. A cookie is a small
                piece of data that our website stores on your computer. We use "strictly necessary"
                cookies for essential functions like managing your shopping cart. For all other
                cookies, such as those used for analytics and session recording, we will ask for
                your explicit consent via a consent banner.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-steel mb-3">6. Contact Us</h2>
              <p>
                For any questions or concerns regarding your privacy, you may contact us using the
                following details: [Your Contact Email Address]
              </p>
            </section>

            <p className="!mt-12 text-sm text-graphite">Last updated: July 16, 2025</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default PrivacyPolicyPage;
