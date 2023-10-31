import { ReactNode } from "react";
import { LoadingCircle } from "./icons/";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  variant?: "primary" | "secondary" | "success" | "danger";
  loading?: boolean;
  icon?: ReactNode;
  disabled?: boolean;
  className?: string;
}

export function Button({
  text,
  variant = "primary",
  loading,
  icon,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const variants = {
    primary: "border-black bg-black text-white hover:bg-white hover:text-black",
    secondary:
      "border-gray-200 bg-white text-gray-500 hover:border-black hover:text-black",
    success:
      "border-blue-500 bg-blue-500 text-white hover:bg-white hover:text-blue-500",
    danger:
      "border-red-500 bg-red-500 text-white hover:bg-white hover:text-red-500",
  };

  if (loading) {
    return (
      <div
        className={`flex h-10 w-full items-center justify-center space-x-2 rounded-md border px-4 text-sm transition-all border-gray-200 bg-gray-100 ${className}`}
      >
        <LoadingCircle />
      </div>
    );
  }
  return (
    <button
      // if onClick is passed, it's a "button" type, otherwise it's being used in a form, hence "submit"
      type={props.onClick ? "button" : "submit"}
      className={`flex h-10 w-full items-center justify-center space-x-2 rounded-md border px-4 text-sm transition-all focus:outline-none ${
        disabled || loading
          ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400"
          : `${variants[variant]}`
      } ${className} `}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <LoadingCircle /> : icon ? icon : null}
      <p>{text}</p>
    </button>
  );
}
