const products = [
  {
    id: 1,
    name: "Takoyaki Mix",
    description: "Takoyaki mix dengan pilihan isi 4, 6, 8, 15, atau 28.",
    icon: "🦑",
    options: [
      { id: "4", label: "Isi 4", price: 10000 },
      { id: "6", label: "Isi 6", price: 15000 },
      { id: "8", label: "Isi 8", price: 20000 },
      { id: "15", label: "Isi 15", price: 37000 },
      { id: "28", label: "Isi 28", price: 70000 },
    ],
  },
  {
    id: 2,
    name: "Takoyaki Gurita",
    description: "Takoyaki gurita dengan pilihan isi 4, 6, 8, 15, atau 28.",
    icon: "🐙",
    options: [
      { id: "4", label: "Isi 4", price: 15000 },
      { id: "6", label: "Isi 6", price: 25000 },
      { id: "8", label: "Isi 8", price: 30000 },
      { id: "15", label: "Isi 15", price: 55000 },
      { id: "28", label: "Isi 28", price: 100000 },
    ],
  },
  {
    id: 3,
    name: "Roti Cane",
    description: "Roti cane dengan topping coklat, keju, frozen, atau SKM.",
    icon: "🥞",
    options: [
      { id: "coklat", label: "Topping Coklat", price: 15000 },
      { id: "keju", label: "Topping Keju", price: 15000 },
      { id: "frozen", label: "Roti Cane Frozen", price: 10000 },
      { id: "skm", label: "Roti Cane SKM", price: 12000 },
    ],
  },
  {
    id: 4,
    name: "Okonomoyaki",
    description: "Okonomoyaki dengan pilihan regular atau jombo, dan ekstra keju atau gurita.",
    icon: "🍳",
    options: [
      { id: "regular", label: "Regular", price: 15000 },
      { id: "jombo", label: "Jombo", price: 25000 },
    ],
    extras: [
      { id: "cheese", label: "Ekstra Keju", price: 2000 },
      { id: "gurita", label: "Ekstra Gurita", price: 5000 },
    ],
  },
  {
    id: 5,
    name: "Udon Kari",
    description: "Udon dengan kuah kari hangat dan gurih.",
    price: 37000,
    icon: "🍜",
  },
  {
    id: 6,
    name: "Udon Kake",
    description: "Udon sederhana dengan kuah ringan dan lezat.",
    price: 35000,
    icon: "🍜",
  },
  {
    id: 7,
    name: "Cuanki",
    description: "Cuanki lezat dengan pilihan mateng atau frozen.",
    icon: "🥡",
    options: [
      { id: "mateng", label: "Mateng", price: 23000 },
      { id: "frozen", label: "Frozen", price: 20000 },
    ],
  },
  {
    id: 8,
    name: "Minuman",
    description: "Pilih minuman favorit anda.",
    icon: "🥤",
    options: [
      { id: "teh-pucuk", label: "Teh Pucuk", price: 5000 },
      { id: "mineral", label: "Mineral", price: 5000 },
    ],
  },
];

const cart = new Map();
const checkedItems = new Map();
const productGrid = document.getElementById("productGrid");
const cartCount = document.getElementById("cartCount");
const cartPanel = document.getElementById("cartPanel");
const cartItemsEl = document.getElementById("cartItems");
const cartSubtotal = document.getElementById("cartSubtotal");
const cartTotal = document.getElementById("cartTotal");
const shippingRow = document.getElementById("shippingRow");
const shippingFeeEl = document.getElementById("shippingFee");
const searchInput = document.getElementById("searchInput");
const cartToggle = document.getElementById("cartToggle");
const closeCart = document.getElementById("closeCart");
const checkoutSelectedButton = document.getElementById("checkoutSelectedButton");
const checkoutAllButton = document.getElementById("checkoutAllButton");
const toast = document.getElementById("toast");
const courierOptions = document.getElementById("courierOptions");
const courierSelect = document.getElementById("courierSelect");
const deliveryOptions = document.getElementsByName("deliveryOption");
const emptyState = document.getElementById("emptyState");

function formatCurrency(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function getLowestPrice(product) {
  if (!product.options?.length) return product.price || 0;
  return Math.min(...product.options.map((option) => option.price));
}

function getRenderPrice(product) {
  if (product.options?.length) {
    return `Mulai dari ${formatCurrency(getLowestPrice(product))}`;
  }
  return formatCurrency(product.price);
}

function renderProducts(items) {
  productGrid.innerHTML = "";
  if (!items.length) {
    emptyState.classList.remove("hidden");
    return;
  }

  emptyState.classList.add("hidden");
  items.forEach((product) => {
    const card = document.createElement("article");
    card.className = "product-card";
    const hasOptions = Array.isArray(product.options) && product.options.length > 0;
    const priceLabel = hasOptions
      ? `Mulai dari ${formatCurrency(getLowestPrice(product))}`
      : formatCurrency(product.price);
    const optionSelect = hasOptions
      ? `
        <label class="option-label">
          Pilih isi:
          <select class="product-option" data-product-id="${product.id}">
            ${product.options
              .map(
                (option) =>
                  `<option value="${option.id}">${option.label} - ${formatCurrency(option.price)}</option>`
              )
              .join("")}
          </select>
        </label>
      `
      : "";

    const extrasMarkup = product.extras
      ? `
        <div class="extras-group">
          <p class="option-label">Tambahan:</p>
          ${product.extras
            .map(
              (extra) =>
                `<label class="extra-label">
                  <input type="checkbox" class="product-extra" data-product-id="${product.id}" value="${extra.id}" />
                  ${extra.label} (+${formatCurrency(extra.price)})
                </label>`
            )
            .join("")}
        </div>
      `
      : "";

    card.innerHTML = `
      <div class="product-icon">${product.icon}</div>
      <h3>${product.name}</h3>
      <p>${product.description}</p>
      ${optionSelect}
      ${extrasMarkup}
      <div class="product-meta">
        <span class="product-price">${priceLabel}</span>
        <button class="add-button" data-id="${product.id}">Tambah</button>
      </div>
    `;
    productGrid.appendChild(card);
  });
}

function updateCartCount() {
  const totalCount = Array.from(cart.values()).reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalCount;
}

function updateCartPanel() {
  cartItemsEl.innerHTML = "";
  if (!cart.size) {
    cartItemsEl.innerHTML = `<p class="empty-state">Keranjang kosong. Tambahkan produk favoritmu.</p>`;
  }

  let subtotal = 0;
  cart.forEach((cartItem) => {
    const isChecked = checkedItems.get(cartItem.key) !== false;
    if (isChecked) {
      subtotal += cartItem.price * cartItem.quantity;
    }
    const itemRow = document.createElement("div");
    itemRow.className = "cart-item";
    
    const checkedAttr = isChecked ? "checked" : "";
    
    itemRow.innerHTML = `
      <input type="checkbox" class="cart-item-checkbox" data-key="${cartItem.key}" ${checkedAttr} />
      <div class="cart-item-info">
        <p class="cart-item-name">${cartItem.itemName}</p>
        <p class="cart-item-details">${cartItem.quantity} × ${formatCurrency(cartItem.price)}</p>
      </div>
      <div class="cart-item-actions">
        <button class="decrease-button" data-key="${cartItem.key}">-</button>
        <button class="increase-button" data-key="${cartItem.key}">+</button>
        <button class="remove-button" data-key="${cartItem.key}">Hapus</button>
      </div>
    `;
    cartItemsEl.appendChild(itemRow);
  });

  const shippingCost = getShippingCost();
  const total = subtotal + shippingCost;

  cartSubtotal.textContent = formatCurrency(subtotal);
  shippingFeeEl.textContent = formatCurrency(shippingCost);
  cartTotal.textContent = formatCurrency(total);
}

function getShippingCost() {
  const selectedOption = document.querySelector('input[name="deliveryOption"]:checked')?.value;
  if (selectedOption !== "delivery") {
    return 0;
  }

  return {
    jne: 10000,
    jnt: 20000,
    sicepat: 30000,
  }[courierSelect.value] || 0;
}

function getShippingLabel() {
  const selectedOption = document.querySelector('input[name="deliveryOption"]:checked')?.value;
  if (selectedOption === "delivery") {
    const courierLabel = {
      jne: "JNE",
      jnt: "J&T",
      sicepat: "SiCepat",
    }[courierSelect.value] || "Pengiriman";
    return `Pengiriman (${courierLabel})`;
  }
  return "COD (Cash on Delivery)";
}

function updateShippingDisplay() {
  const selectedOption = document.querySelector('input[name="deliveryOption"]:checked')?.value;
  if (selectedOption === "delivery") {
    courierOptions.classList.remove("hidden");
    shippingRow.classList.remove("hidden");
  } else {
    courierOptions.classList.add("hidden");
    shippingRow.classList.add("hidden");
  }
  updateCartPanel();
}

function addToCart(productId, optionId = null, extraIds = []) {
  const product = products.find((item) => item.id === productId);
  if (!product) return;

  let option = null;
  let cartKey = String(productId);
  let itemName = product.name;
  let itemPrice = product.price || 0;
  let extrasLabel = "";

  if (product.options?.length) {
    option = product.options.find((opt) => opt.id === optionId) || product.options[0];
    cartKey = `${productId}-${option.id}`;
    itemName = `${product.name} (${option.label})`;
    itemPrice = option.price;
  }

  if (product.extras?.length && extraIds.length) {
    const selectedExtras = product.extras.filter((extra) => extraIds.includes(extra.id));
    const extraTotal = selectedExtras.reduce((sum, extra) => sum + extra.price, 0);
    extrasLabel = selectedExtras.map((extra) => extra.label).join(", ");
    if (extrasLabel) {
      itemName += ` + ${extrasLabel}`;
      itemPrice += extraTotal;
      cartKey += `-${extraIds.join("-")}`;
    }
  }

  if (cart.has(cartKey)) {
    const entry = cart.get(cartKey);
    entry.quantity += 1;
  } else {
    cart.set(cartKey, {
      key: cartKey,
      product,
      quantity: 1,
      price: itemPrice,
      itemName,
    });
    checkedItems.set(cartKey, true);
  }

  updateCartCount();
  updateCartPanel();
  showToast(`"${itemName}" berhasil ditambahkan ke keranjang.`);
}

function changeQuantity(productKey, delta) {
  if (!cart.has(productKey)) return;
  const entry = cart.get(productKey);
  entry.quantity += delta;
  if (entry.quantity <= 0) {
    cart.delete(productKey);
    checkedItems.delete(productKey);
  }
  updateCartCount();
  updateCartPanel();
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.remove("hidden");
  clearTimeout(showToast.timeoutId);
  showToast.timeoutId = setTimeout(() => {
    toast.classList.add("hidden");
  }, 2200);
}

function toggleCart() {
  cartPanel.classList.toggle("hidden");
}

function renderFilteredProducts() {
  const query = searchInput.value.trim().toLowerCase();
  const filtered = products.filter((product) => {
    return (
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query)
    );
  });
  renderProducts(filtered);
}

productGrid.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-id]");
  if (!button) return;
  const productId = Number(button.dataset.id);
  const productCard = button.closest(".product-card");
  const optionSelect = productCard?.querySelector(".product-option");
  const optionId = optionSelect ? optionSelect.value : null;
  const extraIds = Array.from(productCard?.querySelectorAll(".product-extra:checked") || []).map(
    (input) => input.value
  );
  addToCart(productId, optionId, extraIds);
});

cartItemsEl.addEventListener("click", (event) => {
  const decrease = event.target.closest(".decrease-button");
  const increase = event.target.closest(".increase-button");
  const remove = event.target.closest(".remove-button");

  if (decrease) {
    changeQuantity(decrease.dataset.key, -1);
  }
  if (increase) {
    changeQuantity(increase.dataset.key, 1);
  }
  if (remove) {
    const key = remove.dataset.key;
    cart.delete(key);
    checkedItems.delete(key);
    updateCartCount();
    updateCartPanel();
  }
});

cartToggle.addEventListener("click", toggleCart);
closeCart.addEventListener("click", toggleCart);
Array.from(deliveryOptions).forEach((option) => option.addEventListener("change", updateShippingDisplay));
courierSelect.addEventListener("change", updateCartPanel);

cartItemsEl.addEventListener("change", (event) => {
  if (event.target.classList.contains("cart-item-checkbox")) {
    const key = event.target.dataset.key;
    checkedItems.set(key, event.target.checked);
    updateCartPanel();
  }
});

function getSelectedItems() {
  const checkboxes = cartItemsEl.querySelectorAll(".cart-item-checkbox:checked");
  const selectedKeys = Array.from(checkboxes).map((cb) => cb.dataset.key);
  return selectedKeys;
}

function getSelectedTotal() {
  const selectedKeys = getSelectedItems();
  let total = 0;
  selectedKeys.forEach((key) => {
    if (cart.has(key)) {
      const item = cart.get(key);
      total += item.price * item.quantity;
    }
  });
  return total;
}

function processCheckout(selectedOnly = false) {
  if (!cart.size) {
    showToast("Keranjang kosong. Tambahkan produk dulu.");
    return;
  }

  if (selectedOnly) {
    const selectedKeys = getSelectedItems();
    if (!selectedKeys.length) {
      showToast("Pilih minimal satu item untuk dibayar.");
      return;
    }
  }

  const paymentMethod = document.getElementById("paymentMethod").value;
  const methodLabel = {
    transfer: "Transfer Bank",
    ewallet: "E-Wallet",
    qris: "QRIS",
    cash: "Cash",
  }[paymentMethod] || "Metode Pembayaran";
  const shippingLabel = getShippingLabel();
  const orderType = selectedOnly ? "Item Terpilih" : "Semua Item";
  
  showToast(`${orderType} berhasil dibayar. Metode: ${methodLabel}. ${shippingLabel}.`);
  
  if (selectedOnly) {
    const selectedKeys = getSelectedItems();
    selectedKeys.forEach((key) => {
      cart.delete(key);
      checkedItems.delete(key);
    });
  } else {
    cart.clear();
    checkedItems.clear();
  }
  
  updateCartCount();
  updateCartPanel();
}

checkoutSelectedButton.addEventListener("click", () => processCheckout(true));
checkoutAllButton.addEventListener("click", () => processCheckout(false));

renderProducts(products);
updateCartPanel();
updateCartCount();
