import { TbPackage } from "react-icons/tb";
import type { Product } from "../../../types/product";
import { formatRupiah } from "../../../utils/formatRupiah";
import LinkButton from "../../atoms/LinkButton";
import styles from "./styles.module.css";

type Props = {
  product: Product;
};

export default function ProductCard({ product }: Props) {
  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <span className={styles.id}>ID: {product.id}</span>
        <TbPackage className={styles.icon} aria-hidden="true" />
      </div>
      <h2 className={styles.name}>{product.name}</h2>
      <p className={styles.price}>{formatRupiah(product.price)}</p>
      <div className={styles.actions}>
        <LinkButton
          to={`/products/${product.id}/edit`}
          variant="outlinePrimary"
        >
          Edit
        </LinkButton>
        <LinkButton
          to={`/products/${product.id}/delete`}
          variant="subtleDanger"
        >
          Hapus
        </LinkButton>
      </div>
    </article>
  );
}
