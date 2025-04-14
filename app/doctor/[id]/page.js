"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import styled from "styled-components";
import { motion } from "framer-motion";
import axios from "axios";
import { auth } from "../../../src/lib/firebase";

const Container = styled.div`
  padding: 2rem 1.5rem;
  background: linear-gradient(180deg, #0F172A, #1E293B); /* Obsidian to slate blue */
  min-height: 100vh;
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

const Card = styled(motion.div)`
  background: rgba(15, 23, 42, 0.8); /* Glassy dark */
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: 12px;
  max-width: 600px;
  margin: 0 auto;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.3);
  border: 2px solid rgba(46, 229, 196, 0.3); /* Teal border */

  @media (max-width: 640px) {
    padding: 1.5rem;
  }
`;

const Title = styled(motion.h2)`
  font-family: 'Orbitron', sans-serif;
  font-size: 1.75rem;
  color: #2EE5C4; /* Neon teal */
  margin-bottom: 1rem;
  text-shadow: 0 0 10px rgba(46, 229, 196, 0.4); /* Glow */

  @media (min-width: 640px) {
    font-size: 1.8rem;
  }
`;

const Text = styled(motion.p)`
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  color: #D1D5DB; /* Light gray */
  margin-bottom: 0.5rem;

  strong {
    color: #2EE5C4; /* Teal for emphasis */
  }
`;

const SubHeader = styled(motion.h3)`
  font-family: 'Inter', sans-serif;
  font-size: 1.25rem;
  color: #D1D5DB; /* Light gray */
  margin: 2rem 0 1rem;
`;

const Input = styled(motion.input)`
  width: 100%;
  padding: 0.75rem;
  margin: 0.5rem 0;
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

  &::placeholder {
    color: #94A3B8; /* Slate gray */
  }
`;

const Button = styled(motion.button)`
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(90deg, #2EE5C4, #06B6D4); /* Teal to cyan */
  color: #D1D5DB; /* Light gray */
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  width: 100%;
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

const LoadingText = styled(motion.p)`
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  color: #D1D5DB; /* Light gray */
  text-align: center;
  margin-top: 2rem;
`;

export default function DoctorProfile() {
  const params = useParams();
  const router = useRouter();
  const [doctor, setDoctor] = useState(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/doctor/${params.id}`);
        setDoctor(res.data);
      } catch (err) {
        console.error("Failed to load doctor:", err);
        alert("Failed to load doctor info.");
        router.push("/search-doctors");
      }
    };
    fetchDoctor();
  }, [params.id, router]);

  const handleBook = async () => {
    const patientUid = auth.currentUser?.uid;
    if (!patientUid || !date || !time) {
      alert("Please fill all fields.");
      return;
    }

    setLoading(true);
    try {
      console.log("📤 Sending appointment:", {
        patientUid,
        doctorId: params.id,
        date,
        time,
      });

      const response = await axios.post("http://localhost:5000/api/appointments", {
        patientUid,
        doctorId: params.id,
        date,
        time,
      });

      console.log("✅ Appointment confirmed:", response.data);
      router.push("/my-appointments");
    } catch (error) {
      const errMessage = error.response?.data?.error || error.message;
      console.error("❌ Booking failed:", errMessage);
      alert(`Failed to book appointment: ${errMessage}`);
    } finally {
      setLoading(false);
    }
  };

  if (!doctor) {
    return (
      <Container>
        <LoadingText
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Loading doctor profile...
        </LoadingText>
      </Container>
    );
  }

  return (
    <Container>
      <Card
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Title
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {doctor.name}
        </Title>
        <Text
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <strong>Specialty:</strong> {doctor.specialties}
        </Text>
        <Text
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <strong>Email:</strong> {doctor.email}
        </Text>
        <Text
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <strong>Phone:</strong> {doctor.phone}
        </Text>

        <SubHeader
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          Book Appointment
        </SubHeader>
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          aria-label="Select appointment date"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          whileFocus={{ scale: 1.02 }}
        />
        <Input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          aria-label="Select appointment time"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          whileFocus={{ scale: 1.02 }}
        />
        <Button
          onClick={handleBook}
          disabled={loading}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          whileHover={{ scale: loading ? 1 : 1.05 }}
          whileTap={{ scale: loading ? 1 : 0.95 }}
          aria-label={`Book appointment with ${doctor.name}`}
        >
          {loading ? "Booking..." : "Book Appointment"}
        </Button>
      </Card>
    </Container>
  );
}