import { Link } from "react-router-dom";

function Button({ variant = "primary", as = "button", children, icon, className = "", ...props }) {
  const baseStyles =
    "inline-flex items-center justify-center font-bold py-2 px-4 rounded-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-phantom";

  const variants = {
    primary: "bg-cloud text-phantom hover:scale-105 hover:brightness-95 focus:ring-cloud",
    ghost:
      "bg-transparent border border-cloud text-cloud hover:bg-cloud hover:text-phantom focus:ring-cloud",
  };

  const combinedClassName = `${baseStyles} ${variants[variant]} ${className}`;

  const IconComponent = icon;

  const content = (
    <>
      {IconComponent && <IconComponent size={18} className="mr-2" />}
      {children}
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
