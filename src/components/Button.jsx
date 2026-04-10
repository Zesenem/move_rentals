import { Link } from "react-router-dom";

function Button({ variant = "primary", as = "button", children, icon, className = "", ...props }) {
  const baseStyles =
    "inline-flex min-w-0 items-center justify-center gap-2 rounded-md px-4 py-2 text-center font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-phantom";

  const variants = {
    primary: "bg-cloud text-phantom hover:scale-105 hover:brightness-95 focus:ring-cloud",
    ghost:
      "bg-transparent border border-cloud text-cloud hover:bg-cloud hover:text-phantom focus:ring-cloud",
    danger:
      "bg-red-600 text-white hover:brightness-110 focus:ring-red-500 disabled:bg-red-900/60 disabled:text-red-100",
  };

  const combinedClassName = `${baseStyles} ${variants[variant]} ${className}`;

  const IconComponent = icon;

  const content = (
    <>
      {IconComponent && <IconComponent size={18} className="shrink-0" />}
      <span className="min-w-0">{children}</span>
    </>
  );

  const Element = typeof as === "string" && as === "a" ? "a" : as === Link ? Link : "button";
  return (
    <Element className={combinedClassName} {...props}>
      {content}
    </Element>
  );
}

export default Button;
