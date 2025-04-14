"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import { motion } from "framer-motion";
import axios from "axios";

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

const Header = styled(motion.h1)`
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

const SearchBox = styled(motion.div)`
  max-width: 900px;
  margin: 0 auto 2rem;
  display: flex;
  gap: 1rem;
  background: rgba(15, 23, 42, 0.8); /* Glassy dark */
  backdrop-filter: blur(10px);
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid rgba(46, 229, 196, 0.2); /* Subtle teal border */

  @media (max-width: 640px) {
    flex-direction: column;
  }
`;

const Input = styled(motion.input)`
  flex: 1;
  padding: 0.75rem;
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

const Select = styled(motion.select)`
  padding: 0.75rem;
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
`;

const Button = styled(motion.button)`
  padding: 0.75rem 1.5rem;
  background: linear-gradient(90deg, #2EE5C4, #06B6D4); /* Teal to cyan */
  color: #D1D5DB; /* Light gray */
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  font-weight: 600;

  &:hover {
    transform: translateY(-2px);
    background: linear-gradient(90deg, #A855F7, #7E22CE); /* Purple hover */
    box-shadow: 0 6px 20px rgba(168, 85, 247, 0.5);
  }

  &:focus {
    outline: 2px solid #2EE5C4;
    outline-offset: 2px;
  }

  @media (max-width: 640px) {
    width: 100%;
  }
`;

const DoctorGrid = styled(motion.div)`
  max-width: 900px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
`;

const DoctorCard = styled(motion.div)`
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
`;

const DoctorName = styled.h3`
  font-family: 'Inter', sans-serif;
  font-size: 1.25rem;
  color: #D1D5DB; /* Light gray */
  margin-bottom: 0.5rem;
`;

const DoctorSpecialty = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  color: #94A3B8; /* Slate gray */
  margin-bottom: 1rem;
`;

const LoadingText = styled(motion.p)`
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  color: #D1D5DB; /* Light gray */
  text-align: center;
  margin-top: 2rem;
`;

const NoDoctorsText = styled(motion.p)`
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  color: #F87171; /* Muted red */
  text-align: center;
  margin-top: 2rem;
`;

export default function SearchDoctors() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      setError(null);
      let url = `http://localhost:5000/api/search-doctors?query=${encodeURIComponent(query || filter || "all")}`;
      const response = await axios.get(url);
      setDoctors(response.data);
    } catch (err) {
      console.error("Failed to fetch doctors:", err);
      setError("Failed to load doctors. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleSearch = () => {
    fetchDoctors();
  };

  return (
    <Container>
      <Header
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        Search Doctors
      </Header>
      <SearchBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Input
          placeholder="Search by name or specialty"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search doctors by name or specialty"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          whileFocus={{ scale: 1.02 }}
        />
        <Select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          aria-label="Filter doctors by specialty"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          whileFocus={{ scale: 1.02 }}
        >
          <option value="">All Specialties</option>
          <option value="Cardiologist">Cardiologist</option>
          <option value="Dermatologist">Dermatologist</option>
          <option value="Neurologist">Neurologist</option>
          <option value="Pulmonologist">Pulmonologist</option>
        </Select>
        <Button
          onClick={handleSearch}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Search doctors"
        >
          Search
        </Button>
      </SearchBox>

      {loading ? (
        <LoadingText
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Loading doctors...
        </LoadingText>
      ) : error ? (
        <NoDoctorsText
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {error}
        </NoDoctorsText>
      ) : doctors.length ? (
        <DoctorGrid
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          {doctors.map((doc) => (
            <DoctorCard
              key={doc._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <DoctorName>{doc.name}</DoctorName>
              <DoctorSpecialty>Specialty: {doc.specialties}</DoctorSpecialty>
              <Button
                onClick={() => router.push(`/doctor/${doc._id}`)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label={`View profile of ${doc.name}`}
              >
                View Profile
              </Button>
            </DoctorCard>
          ))}
        </DoctorGrid>
      ) : (
        <NoDoctorsText
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          No doctors found. Try a different search or filter.
        </NoDoctorsText>
      )}
    </Container>
  );
}