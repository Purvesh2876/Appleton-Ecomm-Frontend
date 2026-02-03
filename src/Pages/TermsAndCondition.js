// About.js

import { Container } from "@chakra-ui/react";
import React from "react";

const TermsAndCondition = () => {
  return (
    <main>
      {/* <PageHero title="Termsandconditions" /> */}
      <Container className="page section section-center" style={{ maxWidth: '80vw' }}>
        <h1 style={{ fontWeight: 'bold' }}>Terms and Conditions</h1>
        <br />
        <p>
          {" "}
          Welcome to The Earth Natural. By accessing our website and placing orders, you agree to the following terms and conditions:
        </p>

        <p>
          <strong>*1. Use of the Website*</strong>
        </p>
        <p>
          You agree to use our website for lawful purposes only and not to disrupt its operations or security.
        </p>

        <p>
          <strong>*2. Products & Services*</strong>
        </p>

        <p>
          Product descriptions and prices are accurate to the best of our knowledge.

          All products are made with natural ingredients; however, please read labels for allergies or dietary restrictions before consumption.
        </p>

        <p>
          <strong>*3. Orders & Payments*</strong>
        </p>

        <p>
          Orders are processed after successful payment.

          Payment transactions are handled securely through our payment partners.
        </p>

        <p>
          <strong>*4. Shipping and Delivery*</strong>
        </p>

        <p>
          We aim to deliver within the time mentioned on the website.

          Delays due to unforeseen circumstances (e.g., weather, courier issues) will be communicated promptly.F
        </p>

        <p>
          <strong>*5. Returns and Exchanges*</strong>
        </p>

        <p>
         Please refer to our Return & Exchange Policy page for detailed information..{" "}
        </p>

        <p>
          <strong>*6. Limitation of Liability*</strong>
        </p>
        <p>
          We are not responsible for any damages arising from the misuse of our products or allergic reactions.
        </p>

        <p>
          <strong>*7. Governing Law*</strong>
        </p>
        <p>
          These terms are governed by Indian laws.
        </p>

        <p>
          <strong>Contact Us</strong>
        </p>
        <p>
          <a href="https://theearthnatural.in" className="blue" target="_blank">
            theearthnatural.in
          </a>
        </p>
      </Container>
    </main>
  );
};

export default TermsAndCondition;
