import { useState } from "react";
import { TbPlus, TbSearch } from "react-icons/tb";
import { useProducts } from "../../../context/product-context";
import Button from "../../atoms/Button";
import LinkButton from "../../atoms/LinkButton";
import ProductGrid from "../../organisms/ProductGrid";
import styles from "./styles.module.css";

export default function ProductsPage() {
  const { products, isLoading, error, message, loadFromApi } = useProducts();
  const [keyword, setKeyword] = useState("");

  const normalized = keyword.trim().toLowerCase();
  const filteredProducts = products.filter((item) =>
    item.name.toLowerCase().includes(normalized),
  );

  return (
    <>
      <header className={styles.header}>
        <div className={styles.headerRow}>
          <div>
            <h1 className={styles.title}>Manajemen Produk</h1>
            <p className={styles.description}>
              Kelola daftar produk dan harga dalam satu tempat.
            </p>
          </div>
          <div className={styles.headerActions}>
            <Button
              variant="secondary"
              onClick={loadFromApi}
              disabled={isLoading}
            >
              {isLoading ? "Memuat…" : "Muat dari API"}
            </Button>
            <LinkButton to="/products/new" variant="primary">
              <TbPlus className="size-4" aria-hidden="true" />
              Tambah Produk
            </LinkButton>
          </div>
        </div>
      </header>

      <section
        className={styles.toolbar}
        aria-label="Pencarian dan jumlah produk"
      >
        <search className={styles.searchBox}>
          <TbSearch className={styles.searchIcon} aria-hidden="true" />
          <input
            type="search"
            name="q"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Cari nama produk..."
            aria-label="Cari nama produk"
            autoCorrect="off"
            autoCapitalize="none"
            spellCheck={false}
            className={styles.searchInput}
          />
        </search>
        <span className={styles.countBadge}>{products.length} produk</span>
      </section>

      {error && (
        <p role="alert" className={styles.error}>
          {error}
        </p>
      )}

      <section aria-label="Daftar produk" aria-busy={isLoading}>
        {filteredProducts.length > 0 ? (
          <ProductGrid products={filteredProducts} />
        ) : (
          <p className={styles.emptyState}>
            {products.length === 0
              ? 'Belum ada produk. Klik "Muat dari API" atau "Tambah Produk".'
              : "Tidak ada produk yang sesuai dengan pencarian."}
          </p>
        )}
      </section>

      <div className={styles.footer}>
        <p className={styles.summary}>
          Menampilkan {filteredProducts.length} dari {products.length} produk
        </p>
        {message && (
          <p role="status" className={styles.status}>
            {message}
          </p>
        )}
      </div>
    </>
  );
}
