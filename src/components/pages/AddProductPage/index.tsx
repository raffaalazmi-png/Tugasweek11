import { TbX } from "react-icons/tb";
import { Link, useNavigate } from "react-router";
import { useProducts } from "../../../context/product-context";
import ProductForm from "../../molecules/ProductForm";
import styles from "../subpage.module.css";

export default function AddProductPage() {
  const navigate = useNavigate();
  const { addProduct } = useProducts();

  return (
    <div className={styles.wrapper}>
      <section className={styles.card} aria-labelledby="add-page-title">
        <div className={styles.header}>
          <div>
            <h1 id="add-page-title" className={styles.title}>
              Tambah Produk
            </h1>
            <p className={styles.subtitle}>Masukkan informasi produk baru.</p>
          </div>
          <Link
            to="/products"
            className={styles.closeLink}
            aria-label="Kembali ke daftar produk"
          >
            <TbX className="size-5" aria-hidden="true" />
          </Link>
        </div>

        <ProductForm
          idPrefix="add"
          submitLabel="Simpan Produk"
          onSubmit={(input) => {
            addProduct(input);
            navigate("/products");
          }}
        />
      </section>
    </div>
  );
}
