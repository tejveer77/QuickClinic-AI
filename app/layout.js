"use client";

import { createGlobalStyle } from "styled-components";
import { StyledComponentsRegistry } from "../src/lib/StyledComponentsRegistry";

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: 'Arial', sans-serif;
    background-color: #f5f7fa;
    color: #333;
  }
`;

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <StyledComponentsRegistry>
          <GlobalStyle />
          <header
            style={{
              backgroundColor: "#1E3A8A",
              color: "white",
              padding: "1rem",
              textAlign: "center",
            }}
          >
            <h1 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
              QuickClinic AI
            </h1>
          </header>
          <main>{children}</main>
          <footer
            style={{
              backgroundColor: "#e5e7eb",
              padding: "1rem",
              textAlign: "center",
              marginTop: "auto",
            }}
          >
            <p>© 2025 QuickClinic AI. All rights reserved.</p>
          </footer>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}