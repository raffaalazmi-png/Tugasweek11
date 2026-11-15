let products = [
  { id: 1, name: "Pulpen", price: 5000 },
  { id: 2, name: "Buku Tulis", price: 12000 },
  { id: 3, name: "Spidol", price: 8000 },
  { id: 4, name: "Penggaris", price: 6000 },
  { id: 5, name: "Penghapus", price: 3000 },
];

let nextId = 6;
let editingProductId = null;
let deletingProductId = null;

const rupiahFormatter = new Intl.NumberFormat("id-ID");

const productGrid = document.getElementById("product-grid");
const searchInput = document.getElementById("search-input");
const totalCountEl = document.getElementById("total-count");
const summaryTextEl = document.getElementById("summary-text");
const emptyStateEl = document.getElementById("empty-state");

const dialogAdd = document.getElementById("dialog-add");
const dialogEdit = document.getElementById("dialog-edit");
const dialogDelete = document.getElementById("dialog-delete");

const formAdd = document.getElementById("form-add");
const addNameInput = document.getElementById("add-name");
const addPriceInput = document.getElementById("add-price");
const addNameError = document.getElementById("add-name-error");
const addPriceHint = document.getElementById("add-price-hint");

const formEdit = document.getElementById("form-edit");
const editIdBadge = document.getElementById("edit-id-badge");
const editNameInput = document.getElementById("edit-name");
const editPriceInput = document.getElementById("edit-price");
const editNameError = document.getElementById("edit-name-error");
const editPriceHint = document.getElementById("edit-price-hint");

const deleteIdEl = document.getElementById("delete-id");
const deleteNameEl = document.getElementById("delete-name");
const deletePriceEl = document.getElementById("delete-price");

function formatRupiah(value) {
  return `Rp${rupiahFormatter.format(value)}`;
}

function createProductCard(product) {
  const card = document.createElement("article");
  card.className = "product-card";

  const badge = document.createElement("span");
  badge.className = "id-badge";
  badge.textContent = `ID: ${product.id}`;

  const title = document.createElement("h3");
  title.className = "product-name";
  title.textContent = product.name;

  const price = document.createElement("p");
  price.className = "product-price";
  price.textContent = formatRupiah(product.price);

  const actions = document.createElement("div");
  actions.className = "card-actions";

  const editBtn = document.createElement("button");
  editBtn.type = "button";
  editBtn.className = "btn btn-edit";
  editBtn.textContent = "Edit";
  editBtn.dataset.action = "edit";
  editBtn.dataset.id = String(product.id);

  const deleteBtn = document.createElement("button");
  deleteBtn.type = "button";
  deleteBtn.className = "btn btn-delete-outline";
  deleteBtn.textContent = "Hapus";
  deleteBtn.dataset.action = "delete";
  deleteBtn.dataset.id = String(product.id);

  actions.append(editBtn, deleteBtn);
  card.append(badge, title, price, actions);
  return card;
}

function renderProducts() {
  const keyword = searchInput.value.trim().toLowerCase();
  const filtered = products.filter((item) =>
    item.name.toLowerCase().includes(keyword)
  );

  productGrid.replaceChildren(...filtered.map(createProductCard));

  emptyStateEl.hidden = filtered.length > 0;
  totalCountEl.textContent = `${products.length} produk`;
  summaryTextEl.textContent = `Menampilkan ${filtered.length} dari ${products.length} produk`;
}

function clearValidation(nameInput, nameError, priceInput, priceHint) {
  nameInput.removeAttribute("aria-invalid");
  nameError.textContent = "";
  priceInput.removeAttribute("aria-invalid");
  priceHint.textContent = "Harga harus lebih dari 0.";
  priceHint.classList.remove("is-error");
}

function validateProductForm(nameInput, nameError, priceInput, priceHint) {
  let firstInvalid = null;
  const trimmedName = nameInput.value.trim();
  const parsedPrice = Number(priceInput.value);

  if (!trimmedName) {
    nameInput.setAttribute("aria-invalid", "true");
    nameError.textContent = "Nama produk wajib diisi.";
    firstInvalid = nameInput;
  } else {
    nameInput.removeAttribute("aria-invalid");
    nameError.textContent = "";
  }

  if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
    priceInput.setAttribute("aria-invalid", "true");
    priceHint.textContent = "Harga harus berupa angka lebih dari 0.";
    priceHint.classList.add("is-error");
    if (!firstInvalid) firstInvalid = priceInput;
  } else {
    priceInput.removeAttribute("aria-invalid");
    priceHint.textContent = "Harga harus lebih dari 0.";
    priceHint.classList.remove("is-error");
  }

  if (firstInvalid) {
    firstInvalid.focus();
    return null;
  }

  return { name: trimmedName, price: Math.round(parsedPrice) };
}

// Buka modal Tambah Produk
document.getElementById("btn-open-add").addEventListener("click", () => {
  formAdd.reset();
  clearValidation(addNameInput, addNameError, addPriceInput, addPriceHint);
  dialogAdd.showModal();
});

// Submit Tambah Produk
formAdd.addEventListener("submit", (e) => {
  e.preventDefault();
  const valid = validateProductForm(addNameInput, addNameError, addPriceInput, addPriceHint);
  if (!valid) return;

  products.push({ id: nextId++, name: valid.name, price: valid.price });
  dialogAdd.close();
  renderProducts();
});

// Submit Edit Produk
formEdit.addEventListener("submit", (e) => {
  e.preventDefault();
  const valid = validateProductForm(editNameInput, editNameError, editPriceInput, editPriceHint);
  if (!valid) return;

  const target = products.find((item) => item.id === editingProductId);
  if (target) {
    target.name = valid.name;
    target.price = valid.price;
  }
  dialogEdit.close();
  renderProducts();
});

// Konfirmasi Hapus Produk
document.getElementById("btn-confirm-delete").addEventListener("click", () => {
  products = products.filter((item) => item.id !== deletingProductId);
  dialogDelete.close();
  renderProducts();
});

// Klik tombol Edit / Hapus pada card produk
productGrid.addEventListener("click", (e) => {
  const button = e.target.closest("button[data-action]");
  if (!button) return;

  const productId = Number(button.dataset.id);
  const product = products.find((item) => item.id === productId);
  if (!product) return;

  if (button.dataset.action === "edit") {
    editingProductId = product.id;
    editIdBadge.textContent = `ID: ${product.id}`;
    editNameInput.value = product.name;
    editPriceInput.value = String(product.price);
    clearValidation(editNameInput, editNameError, editPriceInput, editPriceHint);
    dialogEdit.showModal();
  } else if (button.dataset.action === "delete") {
    deletingProductId = product.id;
    deleteIdEl.textContent = `ID: ${product.id}`;
    deleteNameEl.textContent = product.name;
    deletePriceEl.textContent = formatRupiah(product.price);
    dialogDelete.showModal();
  }
});

// Bersihkan pesan error saat user mengetik perbaikan
addNameInput.addEventListener("input", () => {
  if (addNameInput.value.trim()) {
    addNameInput.removeAttribute("aria-invalid");
    addNameError.textContent = "";
  }
});

addPriceInput.addEventListener("input", () => {
  if (Number(addPriceInput.value) > 0) {
    addPriceInput.removeAttribute("aria-invalid");
    addPriceHint.textContent = "Harga harus lebih dari 0.";
    addPriceHint.classList.remove("is-error");
  }
});

editNameInput.addEventListener("input", () => {
  if (editNameInput.value.trim()) {
    editNameInput.removeAttribute("aria-invalid");
    editNameError.textContent = "";
  }
});

editPriceInput.addEventListener("input", () => {
  if (Number(editPriceInput.value) > 0) {
    editPriceInput.removeAttribute("aria-invalid");
    editPriceHint.textContent = "Harga harus lebih dari 0.";
    editPriceHint.classList.remove("is-error");
  }
});

// Pencarian produk
searchInput.addEventListener("input", renderProducts);

// Tombol Batal / Close (×) pada semua dialog
for (const btn of document.querySelectorAll("[data-close-dialog]")) {
  btn.addEventListener("click", () => {
    document.getElementById(btn.dataset.closeDialog).close();
  });
}

// Reset returnValue saat dialog ditutup
for (const dialog of [dialogAdd, dialogEdit, dialogDelete]) {
  dialog.addEventListener("close", () => {
    dialog.returnValue = "";
  });
}

// Fallback klik di luar modal untuk browser yang belum mendukung closedby="any"
if (!("closedBy" in HTMLDialogElement.prototype)) {
  const isOutside = (e, dialog) => {
    const r = dialog.getBoundingClientRect();
    return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
  };
  for (const dialog of document.querySelectorAll('dialog[closedby="any"]')) {
    let pressedOutside = false;
    dialog.addEventListener("pointerdown", (e) => {
      pressedOutside = isOutside(e, dialog);
    });
    dialog.addEventListener("pointerup", (e) => {
      if (pressedOutside && isOutside(e, dialog)) dialog.close();
    });
  }
}

renderProducts();