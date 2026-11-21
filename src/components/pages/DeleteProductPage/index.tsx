import { TbTrash, TbX } from "react-icons/tb";
import { Link, useNavigate, useParams } from "react-router";
import { useProducts } from "../../../context/product-context";
import { formatRupiah } from "../../../utils/formatRupiah";
import Button from "../../atoms/Button";
import LinkButton from "../../atoms/LinkButton";
import styles from "../subpage.module.css";

export default function DeleteProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, deleteProduct } = useProducts();

  const productId = Number(id);
  const product = products.find((item) => item.id === productId);

  if (!product) {
    return (
      <div className={styles.wrapper}>
        <section className={`${styles.card} ${styles.cardCentered}`}>
          <h1 className={styles.title}>Produk Tidak Ditemukan</h1>
          <p className={styles.subtitle}>
            Data produk dengan ID tersebut tidak tersedia.
          </p>
          <div className={styles.centerAction}>
            <LinkButton to="/products" variant="primary">
              Kembali ke Daftar Produk
            </LinkButton>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <section
        className={`${styles.card} ${styles.cardCentered}`}
        aria-labelledby="delete-page-title"
      >
        <Link
          to="/products"
          className={`${styles.closeLink} ${styles.closeFloat}`}
          aria-label="Kembali ke daftar produk"
        >
          <TbX className="size-5" aria-hidden="true" />
        </Link>

        <div className={styles.deleteIconBox} aria-hidden="true">
          <TbTrash className="size-6" />
        </div>

        <h1 id="delete-page-title" className={styles.title}>
          Hapus Produk?
        </h1>
        <p className={styles.subtitle}>
          Produk yang dihapus tidak dapat dikembalikan.
        </p>

        <div className={styles.deletePreview}>
          <span className={styles.deletePreviewId}>ID: {product.id}</span>
          <strong className={styles.deletePreviewName}>{product.name}</strong>
          <span className={styles.deletePreviewPrice}>
            {formatRupiah(product.price)}
          </span>
        </div>

        <div className={styles.splitActions}>
          <LinkButton to="/products" variant="secondary">
            Batal
          </LinkButton>
          <Button
            variant="danger"
            onClick={() => {
              deleteProduct(product.id);
              navigate("/products");
            }}
          >
            Hapus Produk
          </Button>
        </div>
      </section>
    </div>
  );
}
