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
    <label className="swap swap-rotate">
      <input type="checkbox" className="hidden" onChange={toggleDarkMode} />
      <MdOutlineLightMode className="swap-on fill-current w-8 h-8" />
      <MdOutlineDarkMode className="swap-off fill-current w-8 h-8 " />
    </label>
  );
};

export default DarkModeToggle;
