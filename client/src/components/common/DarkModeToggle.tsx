import { useState } from "react";
import { MdOutlineDarkMode, MdOutlineLightMode } from "react-icons/md";

const DarkModeToggle = () => {
  const [darkMode, setDarkMode] = useState<boolean>(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <label className="swap swap-rotate" htmlFor="dark-mode-toggle">
      <input
        type="checkbox"
        className="hidden"
        onChange={toggleDarkMode}
        role="switch"
      />
      <MdOutlineLightMode
        className="swap-on fill-current w-8 h-8"
        data-testid="light-mode-icon"
      />
      <MdOutlineDarkMode
        className="swap-off fill-current w-8 h-8"
        data-testid="dark-mode-icon"
      />
    </label>
  );
};

export default DarkModeToggle;
