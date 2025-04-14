"use client";

import { useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

const Container = styled.div`
  min-height: 100vh;
  padding: 2rem 1.5rem;
  background: linear-gradient(180deg, #0F172A, #1E293B); /* Obsidian to slate blue */
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;

  /* Glassy backdrop */
  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(15, 23, 42, 0.7);
    backdrop-filter: blur(12px);
    z-index: -1;
  }

  @media (min-width: 640px) {
    padding: 3rem 2rem;
  }
`;

const Form = styled(motion.form)`
  background: rgba(15, 23, 42, 0.8); /* Glassy dark */
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 500px;
  border: 2px solid rgba(46, 229, 196, 0.3); /* Teal border */

  @media (max-width: 640px) {
    padding: 1.5rem;
  }
`;

const Header = styled(motion.h2)`
  font-family: 'Orbitron', sans-serif;
  font-size: 1.75rem;
  color: #2EE5C4; /* Neon teal */
  text-align: center;
  margin-bottom: 1.5rem;
  text-shadow: 0 0 10px rgba(46, 229, 196, 0.4); /* Glow */

  @media (min-width: 640px) {
    font-size: 2rem;
  }
`;

const Input = styled(motion.input)`
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  background: rgba(30, 41, 59, 0.8); /* Dark slate */
  color: #D1D5DB; /* Light gray */
  border: 2px solid rgba(46, 229, 196, 0.3); /* Teal border */
  border-radius: 8px;
  font-family: 'Inter', sans-serif;
  font-size: 1rem;

  &:focus {
    border-color: #A855F7; /* Purple focus */
    box-shadow: 0 0 8px rgba(168, 85, 247, 0.5);
    outline: none;
  }

  &[type="file"] {
    padding: 0.5rem;
    cursor: pointer;

    /* Style file input text */
    &::file-selector-button {
      background: linear-gradient(90deg, #2EE5C4, #06B6D4); /* Teal gradient */
      color: #D1D5DB; /* Light gray */
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      font-family: 'Inter', sans-serif;
      cursor: pointer;
      transition: background 0.3s ease;

      &:hover {
        background: linear-gradient(90deg, #A855F7, #7E22CE); /* Purple hover */
      }
    }
  }
`;

const Button = styled(motion.button)`
  width: 100%;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(90deg, #2EE5C4, #06B6D4); /* Teal to cyan */
  color: #D1D5DB; /* Light gray */
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 16px rgba(46, 229, 196, 0.3);

  &:hover {
    transform: translateY(-2px);
    background: linear-gradient(90deg, #A855F7, #7E22CE); /* Purple hover */
    box-shadow: 0 6px 20px rgba(168, 85, 247, 0.5);
  }

  &:focus {
    outline: 2px solid #2EE5C4;
    outline-offset: 2px;
  }

  &:disabled {
    background: #4B5563; /* Grayed out */
    cursor: not-allowed;
    box-shadow: none;
  }
`;

const Message = styled(motion.p)`
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  color: #2EE5C4; /* Neon teal */
  margin-top: 1rem;
  text-align: center;
`;

const ErrorMessage = styled(motion.p)`
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  color: #F87171; /* Muted red */
  margin-top: 1rem;
  text-align: center;
`;

export default function Prescriptions() {
  const [file, setFile] = useState(null);
  const [uploaded, setUploaded] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    // Basic file validation
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      setError("Only JPG, PNG, or PDF files are allowed.");
      return;
    }

    setLoading(true);
    // Simulate upload (no backend yet)
    setTimeout(() => {
      setUploaded(true);
      setLoading(false);
      setFile(null); // Reset file input
    }, 1000);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setUploaded(false);
    setError(null);
  };

  return (
    <Container>
      <Form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Header
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Upload Prescription
        </Header>
        <Input
          type="file"
          onChange={handleFileChange}
          aria-label="Upload prescription file"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          whileFocus={{ scale: 1.02 }}
          accept="image/jpeg,image/png,application/pdf"
        />
        <Button
          type="submit"
          disabled={loading}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          whileHover={{ scale: loading ? 1 : 1.05 }}
          whileTap={{ scale: loading ? 1 : 0.95 }}
          aria-label="Upload prescription"
        >
          {loading ? "Uploading..." : "Upload Prescription"}
        </Button>
        {uploaded && (
          <Message
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            ✅ Prescription Uploaded!
          </Message>
        )}
        {error && (
          <ErrorMessage
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {error}
          </ErrorMessage>
        )}
      </Form>
    </Container>
  );
}