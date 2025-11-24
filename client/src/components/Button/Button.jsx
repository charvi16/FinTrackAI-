// src/components/Button/Button.jsx
import "./Button.css";

export default function Button({ children, variant = "primary", fullWidth = false, ...rest }) {
  const className = `ft-button ft-button--${variant} ${fullWidth ? "ft-button--full" : ""}`;
  return (
    <button className={className} {...rest}>
      {children}
    </button>
  );
}
