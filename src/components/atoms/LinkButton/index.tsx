import { Link, type LinkProps } from "react-router";
import styles from "../Button/styles.module.css";

const variants = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  outlinePrimary: "btn-outline-primary",
  danger: "btn-danger",
  subtleDanger: "btn-subtle-danger",
};

export type LinkButtonVariant = keyof typeof variants;

type LinkButtonProps = LinkProps & {
  variant?: LinkButtonVariant;
};

export default function LinkButton({
  variant = "primary",
  className = "",
  children,
  ...props
}: LinkButtonProps) {
  return (
    <Link
      className={`${styles.button} no-underline ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </Link>
  );
}
