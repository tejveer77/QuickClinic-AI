/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx}", // App Router files
        "./src/**/*.{js,ts,jsx,tsx}", // Source files (e.g., components, styles)
      ],
    theme: {
      extend: {
        colors: {
          primary: "#1E3A8A",
          secondary: "#10B981",
          dark: "#1F2937",
        },
      },
    },
    darkMode: "class",
    plugins: [],
  };