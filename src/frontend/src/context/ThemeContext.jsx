import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

const THEMES = {
  LIGHT: "light",
  DARK: "dark",
  HC: "hc",
};

export const ThemeProvider = ({ children }) => {
  const DEFAULT = THEMES.LIGHT;

  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || DEFAULT
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  /** Alterna somente Light/Dark */
  const toggleDarkMode = () => {
    if (theme === THEMES.DARK) setTheme(THEMES.LIGHT);
    else setTheme(THEMES.DARK);
  };

  /** Liga/desliga o alto contraste */
  const toggleHighContrast = () => {
    if (theme === THEMES.HC) {
      // desliga HC → volta pro light como padrão
      setTheme(THEMES.LIGHT);
    } else {
      // ativa HC e garante que dark mode seja desabilitado
      setTheme(THEMES.HC);
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        toggleDarkMode,
        toggleHighContrast,
        THEMES,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
