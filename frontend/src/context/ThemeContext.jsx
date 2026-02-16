import { createContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    updateTheme(isDarkMode);
  }, [isDarkMode]);

  const updateTheme = (darkMode) => {
    if (darkMode) {
      document.documentElement.style.colorScheme = 'dark';
      document.body.style.backgroundColor = '#1e1e1e';
      document.body.style.color = '#e0e0e0';
    } else {
      document.documentElement.style.colorScheme = 'light';
      document.body.style.backgroundColor = '#f8f9fa';
      document.body.style.color = '#333';
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
