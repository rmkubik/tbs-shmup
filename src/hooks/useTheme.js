import { h, createContext } from "preact";
import { useContext, useState } from "preact/hooks";
import themes from "../data/themes";

const ThemeContext = createContext({
  theme: themes.default,
  setTheme: () => {
    console.warn("setTheme not loaded yet.");
  },
});

const ThemeContextProvider = ({ initialTheme, children, ...props }) => {
  const [themeInternal, setThemeInternal] = useState(themes[initialTheme]);

  const setTheme = (theme) => {
    if (!themes[theme]) {
      console.warn(`Tried to set theme "${theme}". It does not exist.`);
      return;
    }

    setThemeInternal(themes[theme]);
  };

  return (
    <ThemeContext.Provider
      value={{ theme: themeInternal, setTheme }}
      {...props}
    >
      {children}
    </ThemeContext.Provider>
  );
};

const useTheme = () => useContext(ThemeContext);

export { ThemeContextProvider };
export default useTheme;
