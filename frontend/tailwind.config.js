/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-blue': '#2E4057',     
        'secondary-blue': '#4A607C',   
        'accent-cyan': '#00ADB5',      
        'light-grey': '#EEEEEE',       
        'dark-grey': '#393E46',        
        'success-green': '#28A745',    
        'danger-red': '#DC3545',       
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], 
      },
    },
  },
  plugins: [],
};