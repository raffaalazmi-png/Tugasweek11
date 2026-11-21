import { Route, Routes } from "react-router";
import PageLayout from "../src/components/templates/PageLayout";
import ProductProvider from "../src/context/ProductProvider";
import NotFoundPage from "./not-found/page";
import RootPage from "./page";
import DeleteProductPage from "./products/delete/page";
import EditProductPage from "./products/edit/page";
import AddProductPage from "./products/new/page";
import ProductsPage from "./products/page";

export default function AppRoutes() {
  return (
    <ProductProvider>
      <Routes>
        <Route element={<PageLayout />}>
          <Route index element={<RootPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="products/new" element={<AddProductPage />} />
          <Route path="products/:id/edit" element={<EditProductPage />} />
          <Route path="products/:id/delete" element={<DeleteProductPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </ProductProvider>
  );
}
