import { useLocation } from "react-router";
import LinkButton from "../../atoms/LinkButton";
import styles from "../subpage.module.css";

export default function NotFoundPage() {
  const location = useLocation();

  return (
    <div className={styles.wrapper}>
      <section
        className={`${styles.card} ${styles.cardCentered}`}
        aria-labelledby="notfound-title"
      >
        <span className={styles.eyebrow}>Error 404</span>
        <p className={styles.code404}>404</p>
        <h1 id="notfound-title" className={styles.title}>
          Halaman Tidak Ditemukan
        </h1>
        <p className={styles.subtitle}>
          Halaman <code className={styles.pathChip}>{location.pathname}</code>{" "}
          tidak tersedia atau URL yang dimasukkan salah.
        </p>
        <div className={styles.centerAction}>
          <LinkButton to="/products" variant="primary">
            Kembali ke Halaman Utama
          </LinkButton>
        </div>
      </section>
    </div>
  );
}
