"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styled from "styled-components";
import axios from "axios";

const Container = styled.div`
  min-height: calc(100vh - 120px);
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 2rem;
`;

const Header = styled.h1`
  font-size: 2rem;
  color: #1e3a8a;
  text-align: center;
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  max-width: 600px;
  margin: 2rem auto;
`;

const ListItem = styled.li`
  background: white;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  background-color: #10b981;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
`;

export default function DoctorList() {
  const [doctors, setDoctors] = useState([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const symptoms = searchParams.get("symptoms");

  useEffect(() => {
    const fetchDoctors = async () => {
      const response = await axios.get(`http://localhost:5000/api/doctors?symptoms=${symptoms}`);
      setDoctors(response.data);
    };
    fetchDoctors();
  }, [symptoms]);

  return (
    <Container>
      <Header>Doctors for "{symptoms}"</Header>
      <List>
        {doctors.length ? (
          doctors.map((doc) => (
            <ListItem key={doc._id}>
              {doc.name} - {doc.specialties}
              <Button onClick={() => router.push(`/appointments?doctorId=${doc._id}`)}>
                Book
              </Button>
            </ListItem>
          ))
        ) : (
          <ListItem>No doctors found. Mock data: Dr. Smith - Flu</ListItem>
        )}
      </List>
    </Container>
  );
}