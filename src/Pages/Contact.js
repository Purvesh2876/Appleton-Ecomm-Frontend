// Contact.js

import { Container, Input, Textarea, Button, Stack } from "@chakra-ui/react";
import React, { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // No backend submission required for Razorpay verification
    alert("Thank you for contacting us. We will get back to you shortly.");
    setFormData({ name: "", email: "", subject: "", description: "" });
  };

  return (
    <main>
      <Container className="page section section-center" style={{ maxWidth: "80vw" }}>
        <h2 style={{ fontWeight: "bold", marginBottom: "1rem" }}>Contact Us</h2>

        <p>
          <strong>Business Name:</strong> The Earth Natural
        </p>
        <p>
          <strong>Registered Address:</strong> 123, Example Street, Ahmedabad, Gujarat, India
        </p>
        <p>
          <strong>Email:</strong> support@theearthnatural.in
        </p>
        <p>
          <strong>Phone:</strong> +91 8889014888
        </p>

        <br />
        <form onSubmit={handleSubmit}>
          <Stack spacing={4}>
            <Input
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              isRequired
            />
            <Input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              isRequired
            />
            <Input
              name="subject"
              placeholder="Subject"
              value={formData.subject}
              onChange={handleChange}
              isRequired
            />
            <Textarea
              name="description"
              placeholder="Your Message"
              value={formData.description}
              onChange={handleChange}
              isRequired
            />
            <Button type="submit" colorScheme="blue">
              Submit
            </Button>
          </Stack>
        </form>
      </Container>
    </main>
  );
};

export default Contact;
