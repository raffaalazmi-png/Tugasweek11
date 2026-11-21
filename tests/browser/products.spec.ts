import { expect, test } from "@playwright/test"

for (const width of [390, 1440]) {
    test(`halaman awal kosong tanpa request API pada ${width}px`, async ({
        page,
    }) => {
        await page.setViewportSize({ width, height: 900 })
        await page.goto("/")
        await expect(page).toHaveURL(/\/products$/)
        await expect(page.locator("article")).toHaveCount(0)
        await expect(page.getByText("Menampilkan 0 dari 0 produk")).toBeVisible()
        await expect(
            page.getByText(
                'Belum ada produk. Klik "Muat dari API" atau "Tambah Produk".',
            ),
        ).toBeVisible()

        expect(
            await page.evaluate(
                () => document.documentElement.scrollWidth <= innerWidth,
            ),
        ).toBe(true)
    })
}

test("alur tambah, cari, edit, hapus produk, dan halaman 404 berjalan dengan React Router", async ({
    page,
}) => {
    await page.goto("/products")
    await expect(page.locator("article")).toHaveCount(0)

    // Tambah produk pertama
    await page.getByRole("link", { name: "Tambah Produk" }).click()
    await expect(page).toHaveURL(/\/products\/new$/)
    await page.getByLabel("Nama Produk").fill("Pulpen")
    await page.getByLabel("Harga (Rp)").fill("5000")
    await page.getByRole("button", { name: "Simpan Produk" }).click()

    await expect(page).toHaveURL(/\/products$/)
    await expect(page.locator("article")).toHaveCount(1)
    await expect(page.getByRole("heading", { name: "Pulpen" })).toBeVisible()

    // Tambah produk kedua lalu tes pencarian
    await page.getByRole("link", { name: "Tambah Produk" }).click()
    await page.getByLabel("Nama Produk").fill("Spidol")
    await page.getByLabel("Harga (Rp)").fill("8000")
    await page.getByRole("button", { name: "Simpan Produk" }).click()
    await expect(page.locator("article")).toHaveCount(2)

    await page.getByPlaceholder("Cari nama produk...").fill("Spidol")
    await expect(page.locator("article")).toHaveCount(1)
    await expect(page.getByText("Menampilkan 1 dari 2 produk")).toBeVisible()
    await page.getByPlaceholder("Cari nama produk...").fill("")

    // Edit produk
    const spidolCard = page.locator("article", { hasText: "Spidol" })
    await spidolCard.getByRole("link", { name: "Edit" }).click()
    await expect(page).toHaveURL(/\/products\/\d+\/edit$/)
    await page.getByLabel("Harga (Rp)").fill("9000")
    await page.getByRole("button", { name: "Simpan Perubahan" }).click()

    await expect(page).toHaveURL(/\/products$/)
    await expect(
        page.locator("article", { hasText: "Spidol" }),
    ).toContainText("Rp9.000")

    // Hapus produk
    await page
        .locator("article", { hasText: "Spidol" })
        .getByRole("link", { name: "Hapus" })
        .click()
    await expect(page).toHaveURL(/\/products\/\d+\/delete$/)
    await page.getByRole("button", { name: "Hapus Produk" }).click()

    await expect(page).toHaveURL(/\/products$/)
    await expect(page.locator("article")).toHaveCount(1)

    // Halaman 404
    await page.goto("/halaman-tidak-ada")
    await expect(
        page.getByRole("heading", { name: "Halaman Tidak Ditemukan" }),
    ).toBeVisible()
})

test("tidak ada request otomatis, GET opsional memuat barang dari API dan error/kosong ditangani", async ({
    page,
}) => {
    let requests = 0
    await page.route("http://127.0.0.1:3001/api/products", async (route) => {
        requests++
        await route.fulfill({
            json: [
                { id: 1, name: "Pulpen", price: 5000 },
                { id: 2, name: "Buku Tulis", price: 12000 },
            ],
        })
    })

    await page.goto("/products")
    await expect(page.locator("article")).toHaveCount(0)
    expect(requests).toBe(0)

    await page.getByRole("button", { name: "Muat dari API" }).click()
    await expect(page.getByRole("status")).toHaveText(
        "2 produk berhasil dimuat dari API.",
    )
    await expect(page.locator("article")).toHaveCount(2)
    await expect(page.getByRole("heading", { name: "Pulpen" })).toBeVisible()
    expect(requests).toBe(1)

    await page.unroute("http://127.0.0.1:3001/api/products")
    await page.route("http://127.0.0.1:3001/api/products", (route) =>
        route.fulfill({ status: 500, body: "error" }),
    )
    await page.getByRole("button", { name: "Muat dari API" }).click()
    await expect(page.getByRole("alert")).toContainText("HTTP 500")
    await expect(page.getByRole("heading", { name: "Pulpen" })).toBeVisible()

    await page.unroute("http://127.0.0.1:3001/api/products")
    await page.route("http://127.0.0.1:3001/api/products", (route) =>
        route.fulfill({ json: [] }),
    )
    await page.getByRole("button", { name: "Muat dari API" }).click()
    await expect(page.getByRole("alert")).toHaveCount(0)
    await expect(
        page.getByText(
            'Belum ada produk. Klik "Muat dari API" atau "Tambah Produk".',
        ),
    ).toBeVisible()
    await expect(page.locator("article")).toHaveCount(0)
})
