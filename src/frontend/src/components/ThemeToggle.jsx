export function ThemeToggle({ isActive, onToggle, label, activeColor = "bg-blue-600", inactiveColor = "bg-gray-300" }) {
  return (
    <button
      onClick={onToggle}
      className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
        isActive ? activeColor : inactiveColor
      }`}
      aria-label={label}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
          isActive ? "translate-x-7" : "translate-x-0"
        }`}
      />
    </button>
  );
}

export default ThemeToggle;