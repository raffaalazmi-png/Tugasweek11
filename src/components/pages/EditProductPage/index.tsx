import { TbX } from "react-icons/tb";
import { Link, useNavigate, useParams } from "react-router";
import { useProducts } from "../../../context/product-context";
import LinkButton from "../../atoms/LinkButton";
import ProductForm from "../../molecules/ProductForm";
import styles from "../subpage.module.css";

export default function EditProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, updateProduct } = useProducts();

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
      <section className={styles.card} aria-labelledby="edit-page-title">
        <div className={styles.header}>
          <div>
            <h1 id="edit-page-title" className={styles.title}>
              Edit Produk
            </h1>
            <p className={styles.subtitle}>
              Perbarui informasi produk yang dipilih.
            </p>
          </div>
          <Link
            to="/products"
            className={styles.closeLink}
            aria-label="Kembali ke daftar produk"
          >
            <TbX className="size-5" aria-hidden="true" />
          </Link>
        </div>

        <span className={styles.idBadge}>ID: {product.id}</span>

        <ProductForm
          key={product.id}
          idPrefix="edit"
          initialName={product.name}
          initialPrice={String(product.price)}
          submitLabel="Simpan Perubahan"
          onSubmit={(input) => {
            updateProduct(product.id, input);
            navigate("/products");
          }}
        />
      </section>
    </div>
  );
}
