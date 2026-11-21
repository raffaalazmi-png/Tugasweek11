import { useRef, useState, type FormEvent } from "react";
import type { ProductInput } from "../../../context/product-context";
import Button from "../../atoms/Button";
import LinkButton from "../../atoms/LinkButton";
import styles from "./styles.module.css";

type Props = {
  initialName?: string;
  initialPrice?: string;
  submitLabel: string;
  cancelTo?: string;
  idPrefix: string;
  onSubmit: (input: ProductInput) => void;
};

export default function ProductForm({
  initialName = "",
  initialPrice = "",
  submitLabel,
  cancelTo = "/products",
  idPrefix,
  onSubmit,
}: Props) {
  const nameInputRef = useRef<HTMLInputElement>(null);
  const priceInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(initialName);
  const [price, setPrice] = useState(initialPrice);
  const [errors, setErrors] = useState({ name: "", price: "" });

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmedName = name.trim();
    const parsedPrice = Number(price);

    const nextErrors = {
      name: trimmedName ? "" : "Nama produk wajib diisi.",
      price:
        Number.isSafeInteger(parsedPrice) && parsedPrice > 0
          ? ""
          : "Harga harus berupa angka bulat lebih dari 0.",
    };

    if (nextErrors.name || nextErrors.price) {
      setErrors(nextErrors);
      if (nextErrors.name) {
        nameInputRef.current?.focus();
      } else {
        priceInputRef.current?.focus();
      }
      return;
    }

    onSubmit({ name: trimmedName, price: parsedPrice });
  }

  const nameId = `${idPrefix}-name`;
  const nameErrorId = `${idPrefix}-name-error`;
  const priceId = `${idPrefix}-price`;
  const priceHintId = `${idPrefix}-price-hint`;

  return (
    <form onSubmit={handleSubmit} noValidate className={styles.form}>
      <div className={styles.group}>
        <label htmlFor={nameId} className={styles.label}>
          Nama Produk
        </label>
        <input
          ref={nameInputRef}
          id={nameId}
          name="name"
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (errors.name && e.target.value.trim()) {
              setErrors((prev) => ({ ...prev, name: "" }));
            }
          }}
          placeholder="Contoh: Pulpen"
          aria-invalid={errors.name ? "true" : undefined}
          aria-describedby={nameErrorId}
          required
          autoFocus
          className={`${styles.input} ${errors.name ? styles.inputError : ""}`}
        />
        <span id={nameErrorId} className={styles.error} role="alert">
          {errors.name}
        </span>
      </div>

      <div className={styles.group}>
        <label htmlFor={priceId} className={styles.label}>
          Harga (Rp)
        </label>
        <input
          ref={priceInputRef}
          id={priceId}
          name="price"
          type="number"
          min="1"
          step="1"
          inputMode="numeric"
          value={price}
          onChange={(e) => {
            setPrice(e.target.value);
            const nextVal = Number(e.target.value);
            if (errors.price && Number.isSafeInteger(nextVal) && nextVal > 0) {
              setErrors((prev) => ({ ...prev, price: "" }));
            }
          }}
          placeholder="Contoh: 5000"
          aria-invalid={errors.price ? "true" : undefined}
          aria-describedby={priceHintId}
          required
          className={`${styles.input} ${errors.price ? styles.inputError : ""}`}
        />
        <span
          id={priceHintId}
          className={errors.price ? styles.error : styles.hint}
        >
          {errors.price || "Harga harus lebih dari 0."}
        </span>
      </div>

      <div className={styles.actions}>
        <LinkButton to={cancelTo} variant="secondary">
          Batal
        </LinkButton>
        <Button type="submit" variant="primary">
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
