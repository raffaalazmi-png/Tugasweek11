import { useEffect, useRef, useState, type ReactNode } from "react"
import ProductRepository from "../data/product/repository/product-repository.ts"
import ProductRemote from "../data/product/source/product-remote.ts"
import type { Product } from "../types/product"
import { ProductContext, type ProductInput } from "./product-context.ts"

const repository = ProductRepository(
    ProductRemote({ baseUrl: import.meta.env.VITE_API_BASE_URL ?? "" }),
)

export default function ProductProvider({
    children,
}: {
    children: ReactNode
}) {
    const [products, setProducts] = useState<Product[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [message, setMessage] = useState("")
    const isMountedRef = useRef(true)

    useEffect(() => {
        isMountedRef.current = true
        return () => {
            isMountedRef.current = false
        }
    }, [])

    async function loadFromApi() {
        setIsLoading(true)
        setError("")
        setMessage("Memuat produk…")
        try {
            const models = await repository.getProductList()
            if (!isMountedRef.current) return
            setProducts(models.map((model) => model.toJSON()))
            setMessage(`${models.length} produk berhasil dimuat dari API.`)
        } catch (err) {
            if (!isMountedRef.current) return
            setError(
                err instanceof Error ? err.message : "Gagal memuat produk.",
            )
            setMessage("")
        } finally {
            if (isMountedRef.current) {
                setIsLoading(false)
            }
        }
    }

    function addProduct({ name, price }: ProductInput) {
        setProducts((prev) => {
            const nextId =
                prev.reduce((max, item) => Math.max(max, item.id), 0) + 1
            return [...prev, { id: nextId, name, price }]
        })
        setError("")
        setMessage(`Produk "${name}" berhasil ditambahkan.`)
    }

    function updateProduct(id: number, { name, price }: ProductInput) {
        setProducts((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, name, price } : item,
            ),
        )
        setError("")
        setMessage(`Produk "${name}" berhasil diperbarui.`)
    }

    function deleteProduct(id: number) {
        setProducts((prev) => prev.filter((item) => item.id !== id))
        setError("")
        setMessage("Produk berhasil dihapus.")
    }

    return (
        <ProductContext.Provider
            value={{
                products,
                isLoading,
                error,
                message,
                loadFromApi,
                addProduct,
                updateProduct,
                deleteProduct,
            }}
        >
            {children}
        </ProductContext.Provider>
    )
}
