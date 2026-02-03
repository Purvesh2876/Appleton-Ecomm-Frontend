// Shipping.js

import { Container } from "@chakra-ui/react";
import React from "react";

const Shipping = () => {
  return (
    <main>
      <Container className="page section section-center" style={{ maxWidth: '80vw' }}>
        <h2 style={{ fontWeight: 'bold' }}>Shipping Policy</h2>
        <br />
        <p>
          At The Earth Natural, we are committed to delivering your orders quickly and efficiently, ensuring that our products reach you in the best condition.
        </p>

        <p>
          <strong>*1. Shipping Locations*</strong>
        </p>
        <p>
          We currently ship to most locations within India through our trusted delivery partners. If your location is not serviceable, you will be notified at checkout.
        </p>

        <p>
          <strong>*2. Processing Time*</strong>
        </p>
        <p>
          Orders are usually processed within 1–2 business days after receiving full payment. Orders placed on weekends or public holidays are processed on the next working day.
        </p>

        <p>
          <strong>*3. Shipping Time*</strong>
        </p>
        <p>
          Once dispatched, orders typically arrive within 3–7 business days, depending on your location. Delays due to weather or courier issues will be communicated via email or SMS.
        </p>

        <p>
          <strong>*4. Shipping Charges*</strong>
        </p>
        <p>
          Shipping charges (if applicable) are calculated at checkout. We may offer free shipping on specific promotions or order value thresholds.
        </p>

        <p>
          <strong>*5. Order Tracking*</strong>
        </p>
        <p>
          Once your order is shipped, a tracking link will be sent via email or SMS. You can use this to track your shipment.
        </p>

        <p>
          <strong>*6. Damaged or Missing Items*</strong>
        </p>
        <p>
          If you receive a damaged, tampered, or missing item, please notify us within 24 hours of delivery with clear photos so that we can resolve the issue promptly.
        </p>

        <p>
          <strong>*7. Delayed Deliveries*</strong>
        </p>
        <p>
          While we strive to deliver on time, delays caused by third-party logistics or unforeseen events are beyond our control. We will keep you informed of significant delays.
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

export default Shipping;
