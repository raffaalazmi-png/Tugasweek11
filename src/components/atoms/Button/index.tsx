import type { ButtonHTMLAttributes } from "react";
import styles from "./styles.module.css";

const variants = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  outlinePrimary: "btn-outline-primary",
  danger: "btn-danger",
  subtleDanger: "btn-subtle-danger",
};

export type ButtonVariant = keyof typeof variants;

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

export default function Button({
  variant = "primary",
  className = "",
  type = "button",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`${styles.button} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
