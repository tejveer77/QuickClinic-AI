"use client";

import { createGlobalStyle, styled } from "styled-components";
import { StyledComponentsRegistry } from "../src/lib/StyledComponentsRegistry";
import { motion } from "framer-motion";

// Global styles for futuristic, professional, modern aesthetic
const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'Inter', 'Segoe UI', sans-serif;
    background: linear-gradient(170deg, #1E1E2E, #2D2D3A); /* Midnight blue to slate */
    color: #94A3B8; /* Slate gray text */
    line-height: 1.6;
    scroll-behavior: smooth;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  @media (max-width: 640px) {
    html {
      scroll-padding-top: 64px;
    }
  }
`;

// Styled main with glass effect
const Main = styled(motion.main)`
  flex: 1;
  min-height: calc(100vh - 180px);
  padding: 2rem 1.5rem;
  background: linear-gradient(180deg, #0F172A, #1E293B); /* Obsidian to slate blue */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-family: 'Inter', sans-serif;
  border-radius: 12px;
  margin: 1rem;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.1);
  position: relative;

  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(15, 23, 42, 0.7); /* Dark glass */
    backdrop-filter: blur(12px);
    z-index: -1;
  }

  @media (min-width: 640px) {
    padding: 3rem 2rem;
  }

  @media (min-width: 1024px) {
    padding: 4rem 5rem;
  }
`;

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <StyledComponentsRegistry>
          <GlobalStyle />
          {/* Header: Unchanged, matches Home */}
          <motion.header
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{
              background: "rgba(30, 30, 46, 0.8)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              color: "#F8FAFC",
              padding: "1rem 2rem",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
              fontFamily: "'Inter', sans-serif",
              position: "sticky",
              top: 0,
              zIndex: 1000,
            }}
            className="sm:px-4"
            role="banner"
          >
            <h1
              style={{
                fontFamily: "'Orbitron', sans-serif",
                fontSize: "2rem",
                fontWeight: 600,
                letterSpacing: "0.02em",
                color: "#2EE5C4",
                transition: "color 0.3s ease, transform 0.3s ease",
                textShadow: "0 0 8px rgba(46, 229, 196, 0.3)",
              }}
              className="hover:text-vibrantPurple hover:scale-105"
            >
              QuickClinic AI
            </h1>
          </motion.header>

          {/* Main: Dark, glassy, futuristic */}
          <Main
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="max-w-6xl mx-auto w-full sm:p-6 lg:p-10"
            role="main"
          >
            {children}
          </Main>

          {/* Footer: Unchanged */}
          <motion.footer
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{
              background: "rgba(30, 30, 46, 0.9)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              color: "#94A3B8",
              padding: "1rem 1.5rem",
              textAlign: "center",
              fontSize: "0.875rem",
              fontWeight: 400,
              fontFamily: "'Inter', sans-serif",
              borderTop: "1px solid rgba(46, 229, 196, 0.2)",
            }}
            className="sm:text-sm"
            role="contentinfo"
          >
            <p>
              QuickClinic AI - Your Healthcare Companion • © {new Date().getFullYear()}
            </p>
          </motion.footer>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}