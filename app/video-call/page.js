"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import styled from "styled-components";

const Container = styled.div`
  min-height: calc(100vh - 120px);
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 2rem;
  text-align: center;
`;

const VideoFrame = styled.div`
  width: 100%;
  height: 500px;
  background: #000;
  border-radius: 12px;
  margin: 2rem auto;
  max-width: 800px;
`;

export default function VideoCall() {
  const router = useRouter();

  useEffect(() => {
    // Placeholder for Twilio or WebRTC setup
    alert("Video call feature coming soon! Imagine a slick call with Dr. Smith.");
  }, []);

  return (
    <Container>
      <h1>Video Call with Doctor</h1>
      <VideoFrame>Mock Video Call Screen</VideoFrame>
      <button onClick={() => router.push("/patient-dashboard")}>End Call</button>
    </Container>
  );
}