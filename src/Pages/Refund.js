// About.js

import { Container } from "@chakra-ui/react";
import React from "react";

const Refund = () => {
  return (
    <main>
      <Container className="page section section-center" style={{ maxWidth: '80vw' }}>
        <h2 style={{ fontWeight: 'bold' }}>Return & Exchange Policy</h2>
        <br />
        <p>
          {" "}
          At The Earth Natural, we strive to deliver fresh, high-quality products. As our products are perishable food items, our return and exchange policy is as follows:
        </p>

        <p>
          <strong>*1. Returns & Replacements*</strong>
        </p>
        <p>
          Products once delivered cannot be returned unless there is a clear quality or damage issue.

          If the product is damaged, expired, or incorrect, please contact us within 24 hours of delivery with clear photos.
        </p>

        <p>
          <strong>*2. Refund Policy*</strong>
        </p>
        <p>
          Refunds are processed only if replacement is not possible.

          Approved refunds will be credited to your original payment method within 5-7 business days.
        </p>
        <p>
          <strong>*3. Conditions for Returns*</strong>
        </p>

        <p>
          Product must be unused, unopened, and in the same condition as received.

          We reserve the right to verify claims before approving refunds or replacements.
        </p>

        <p>
          <strong>*4. How to Raise a Request*</strong>
        </p>

        <p>
          Please email us at anithakurvayu@gmail.com with your order ID, photos, and issue details.
        </p>

        <p>
          <strong>*5. Non-Returnable Items*</strong>
        </p>
email
        <p>Opened jars or partially used products cannot be returned for safety and hygiene reasons.</p>

        <p>email
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

export default Refund;
