// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    // CRITICAL: Tells Tailwind where to find your class names
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Defined custom theme colors based on old App.css
        primaryClient: '#007bff',  // Old --primary-client
        primaryProvider: '#28a745', // Old --primary-provider
        
        // Defined colors based on App.css variables for consistency
        textColorDark: '#333',
        borderColor: '#ddd',
        bgColor: '#f4f7f6',
      },
    },
  },
  plugins: [],
}