import { Link } from "react-router-dom";

const Button = ({
  children,
  variant = "primary",
  className = "",
  to,
  onClick,
  type = "button",
  ...props
}) => {
  const baseStyles =
    "py-4 px-6 rounded-xl font-bold text-base transition-all duration-300 flex justify-center items-center gap-2 active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "border border-accent-orange bg-accent-orange text-white hover:bg-orange-600",
    outline:
      "border border-text-primary text-text-primary hover:bg-text-primary hover:text-white",
    ghost: "text-text-primary hover:bg-text-primary/5",
  };

  const combinedClasses = `${baseStyles} ${variants[variant]} ${className}`;

  if (to) {
    return (
      <Link to={to} className={combinedClasses} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={combinedClasses}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
