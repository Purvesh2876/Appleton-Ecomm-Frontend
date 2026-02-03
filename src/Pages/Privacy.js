// About.js

import { Container } from "@chakra-ui/react";
import React from "react";

const Privacy = () => {
  return (
    <main>
      <Container
        className="page section section-center"
        style={{ maxWidth: "80vw" }}
      >
        <h2 style={{ fontWeight: "bold" }}>Privacy Policy</h2>
        <br />
        <p>
          {" "}
          This Privacy Policy explains how The Earth Natural collects, uses, and safeguards your personal information in compliance with Indian government guidelines and our payment partner regulations (such as Cashfree). By using our website https://theearthnatural.in
          , you agree to the terms outlined in this policy.
        </p>
        <p>
          <strong>1. Information We Collect</strong>
        </p>
        <p>We collect the following types of information:</p>{" "}
        <p>
          {" "}
          a. Personal Information: Name, email address, phone number, billing/shipping address, collected when you place an order or sign up for our services.
        </p>
        <div>
          <p>
            {" "}
            b. Payment Information: We do not store your payment details. All payments are processed securely through our payment gateway partner.
          </p>
          <p>
            {" "}
            c. Usage Data: Includes IP address, browser type, device details, and pages visited to help us improve your browsing experience.
          </p>
        </div>{" "}
        <p>
          <strong>*2. How We Use Your Information*</strong>
        </p>
        <p>We use your information for the following purposes:</p>
        <p>
          a. *Order Fulfillment:* To process and deliver your orders efficiently.
        </p>
        <p>
          b. *Communication:* To share order updates, delivery notifications, or promotional offers if you opt in.
        </p>
        <p>
          c. *Improvement:* To analyze user interactions and enhance website features.
        </p>
        <p>
          <strong>Data Security</strong>
        </p>
        <p>
          We implement appropriate security measures to protect your personal data. Payment gateways used by us adhere to industry-standard encryption and security practices.
        </p>
        <p>
          <strong>*4. Third-Party Sharing*</strong>
        </p>
        <p>
          {" "}
          We do not sell or trade personal information. We may share data only with trusted service providers (e.g., delivery partners) to complete your orders.
        </p>
        <p>
          <strong>*5. Cookies and Tracking Technologies*</strong>
        </p>
        <p>
          We use cookies to personalize your experience and analyze website traffic. You can modify cookie preferences in your browser settings.
        </p>
        <p>
          <strong>*6. Your Rights*</strong>
        </p>
        <p>
          Under Indian laws, you may access, update, or request deletion of your personal data by contacting us directly.
        </p>
        <p>
          <strong>*7. Changes to the Privacy Policy*</strong>
        </p>
        <p>
          This Privacy Policy may be updated periodically. Please review it occasionally for changes.
        </p>
        <p>
          <strong>*8. Contact Us*</strong>
        </p>
        <p>
          For privacy concerns, contact us at: https://theearthnatural.in
        </p>
        <p>
          This Privacy Policy is subject to Cashfree payments rules and
          regulations and Indian government guidelines and is effective as of
          01-10-2025.
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

export default Privacy;
