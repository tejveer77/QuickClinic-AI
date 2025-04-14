"use client";

import { useEffect, useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import axios from "axios";
import { auth } from "../../src/lib/firebase";

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

const Header = styled(motion.h2)`
  font-family: 'Orbitron', sans-serif;
  font-size: 1.75rem;
  color: #2EE5C4; /* Neon teal */
  text-align: center;
  margin-bottom: 2rem;
  text-shadow: 0 0 10px rgba(46, 229, 196, 0.4); /* Glow */

  @media (min-width: 640px) {
    font-size: 2rem;
  }
`;

const CardGrid = styled(motion.div)`
  max-width: 900px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
`;

const AppointmentCard = styled(motion.div)`
  background: rgba(15, 23, 42, 0.8); /* Glassy dark */
  backdrop-filter: blur(10px);
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(46, 229, 196, 0.2); /* Subtle teal border */
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 32px rgba(46, 229, 196, 0.4);
  }

  @media (max-width: 640px) {
    padding: 1.25rem;
  }
`;

const CardText = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  color: #D1D5DB; /* Light gray */
  margin-bottom: 0.5rem;

  strong {
    color: #2EE5C4; /* Teal for emphasis */
  }
`;

const NoAppointmentsText = styled(motion.p)`
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  color: #D1D5DB; /* Light gray */
  text-align: center;
  margin-top: 2rem;

  strong {
    color: #2EE5C4; /* Teal accent */
  }
`;

const LoadingText = styled(motion.p)`
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  color: #D1D5DB; /* Light gray */
  text-align: center;
  margin-top: 2rem;
`;

const ErrorText = styled(motion.p)`
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  color: #F87171; /* Muted red */
  text-align: center;
  margin-top: 2rem;
`;

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      const uid = auth.currentUser?.uid;
      if (!uid) {
        setError("Please log in to view appointments.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`http://localhost:5000/api/appointments/${uid}`);
        setAppointments(response.data);
      } catch (err) {
        console.error("Failed to fetch appointments:", err);
        setError("Failed to load appointments. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <Container>
      <Header
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        My Appointments
      </Header>

      {loading ? (
        <LoadingText
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Loading appointments...
        </LoadingText>
      ) : error ? (
        <ErrorText
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {error}
        </ErrorText>
      ) : appointments.length === 0 ? (
        <NoAppointmentsText
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          No upcoming <strong>appointments</strong>. Book one now!
        </NoAppointmentsText>
      ) : (
        <CardGrid
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {appointments.map((appt, index) => (
            <AppointmentCard
              key={appt._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
            >
              <CardText>
                <strong>Doctor:</strong> {appt.doctorName}
              </CardText>
              <CardText>
                <strong>Date:</strong> {appt.date}
              </CardText>
              <CardText>
                <strong>Time:</strong> {appt.time}
              </CardText>
            </AppointmentCard>
          ))}
        </CardGrid>
      )}
    </Container>
  );
}