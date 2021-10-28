import { h, createContext } from "preact";
import { useContext, useState } from "preact/hooks";
import themes from "../data/themes";

const ThemeContext = createContext({
  theme: themes.default,
  currentTheme: "default",
  setTheme: () => {
    console.warn("setTheme not loaded yet.");
  },
});

const ThemeContextProvider = ({ initialTheme, children, ...props }) => {
  // const [themeInternal, setThemeInternal] = useState(themes[initialTheme]);
  const [currentTheme, setCurrentTheme] = useState(initialTheme);

  const setTheme = (theme) => {
    if (!themes[theme]) {
      console.warn(`Tried to set theme "${theme}". It does not exist.`);
      return;
    }

    setCurrentTheme(theme);
  };

  return (
    <ThemeContext.Provider
      value={{ theme: themes[currentTheme], currentTheme, setTheme }}
      {...props}
    >
      {children}
    </ThemeContext.Provider>
  );
};

const useTheme = () => useContext(ThemeContext);

export { ThemeContextProvider };
export default useTheme;
