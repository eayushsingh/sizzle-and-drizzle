// Core product catalog: image-first bottles with heat + price
const product = [
  {
    id: "ember-01",
    name: "Ember Drip",
    label: "Everyday Heat",
    description: "Balanced chili, citrus, and garlic for drizzling on literally everything.",
    price: 560.0,
    heatDots: 2,
    image: "bottle-littered.png",
    peppersImage: "pure-redchilli.png",
  },
  {
    id: "midnight-02",
    name: "Midnight Scorch",
    label: "Smoky Slow Burn",
    description: "Chipotle, black garlic, and espresso for a dark, creeping warmth.",
    price: 13.0,
    heatDots: 3,
    image: "bottle-green.png",
    peppersImage: "pure-redchilli.png",
  },
  {
    id: "cinder-03",
    name: "Cinder Bloom",
    label: "Floral Fire",
    description: "Habanero, pineapple, and hibiscus blooming into a bright, high heat.",
    price: 12.0,
    heatDots: 4,
    image: "bottle-orange.png",
    peppersImage: "pure-redchilli.png",
  },
  {
    id: "garlic-04",
    name: "Garlic Chilli Glow",
    label: "Garlic Heat",
    description: "Roasted garlic wrapped in a warm chilli glow for savory lovers.",
    price: 12.5,
    heatDots: 3,
    image: "Garlic-chilli.png",
    peppersImage: "pure-redchilli.png",
  },
  {
    id: "authentic-05",
    name: "Authentic Taste",
    label: "Smoky Heritage",
    description: "A rich, smoky blend built for slow-cooked meals and grilled favorites.",
    price: 13.5,
    heatDots: 4,
    image: "authentic-taste.png",
    peppersImage: "pure-redchilli.png",
  },
];

const cart = new Map();

function formatPrice(value) {
  return `$${value.toFixed(2)}`;
}

// Render the shop as an image-first bottle gallery
function renderProducts(filtered = products) {
  const grid = document.getElementById("products-grid");
  if (!grid) return;
  grid.innerHTML = "";

  filtered.forEach((product) => {
    // Render as a vertical product card (image-first) for listing UX
    const card = document.createElement("article");
    card.className = "product-card";
    // Optionally show a badge for high-heat or special
    const badge = product.heatDots >= 4 ? '<span class="badge">Hot</span>' : '';
    const rating = (Math.random() * 2 + 3).toFixed(1); // lightweight mock rating for demo
    card.innerHTML = `
      <div class="product-image">
        <img src="${product.image}" alt="${product.name} bottle from Sizzle &amp; Drizzle" />
      </div>
      <div class="product-body">
        <div class="product-row">
          <div>
            <div class="product-title">${product.name}</div>
            <div class="product-sub">${product.label}</div>
          </div>
          <div style="text-align:right">
            ${badge}
            <div class="rating">⭐ ${rating}</div>
          </div>
        </div>
        <div class="product-row">
          <div class="product-price bottle-price">${formatPrice(product.price)}</div>
          <button class="btn primary add-to-cart" data-product-id="${product.id}">Add</button>
        </div>
      </div>
    `;

    grid.appendChild(card);
  });
}

function updateCartCount() {
  const count = Array.from(cart.values()).reduce((sum, item) => sum + item.quantity, 0);
  const el = document.getElementById("cart-count");
  el.textContent = count;
}

function calcCartTotals() {
  let subtotal = 0;
  cart.forEach((item) => {
    subtotal += item.product.price * item.quantity;
  });
  const shipping = subtotal > 0 ? 4 : 0;
  const total = subtotal + shipping;
  return { subtotal, shipping, total };
}

function renderCart() {
  const container = document.getElementById("cart");
  container.innerHTML = "";

  if (cart.size === 0) {
    container.innerHTML = `
      <div class="cart-empty">
        <p>Your cart is empty — let\'s add a little heat.</p>
      </div>
    `;
  } else {
    cart.forEach((item) => {
      const row = document.createElement("div");
      row.className = "cart-item";
      row.innerHTML = `
        <div class="cart-item-main">
          <div class="cart-item-title">${item.product.name}</div>
          <div class="cart-item-meta">${item.product.label}</div>
          <div class="cart-item-meta">${formatPrice(item.product.price)} each</div>
        </div>
        <div class="cart-item-controls">
          <div class="qty-control">
            <button type="button" data-action="decrease" data-product-id="${item.product.id}">-</button>
            <span>${item.quantity}</span>
            <button type="button" data-action="increase" data-product-id="${item.product.id}">+</button>
          </div>
          <div class="cart-item-price">${formatPrice(item.product.price * item.quantity)}</div>
          <button type="button" class="remove-btn" data-action="remove" data-product-id="${item.product.id}">Remove</button>
        </div>
      `;
      container.appendChild(row);
    });

    const { subtotal, shipping, total } = calcCartTotals();
    const footer = document.createElement("div");
    footer.className = "cart-totals";
    footer.innerHTML = `
      <div>
        <div>Subtotal: ${formatPrice(subtotal)}</div>
        <div class="cart-summary-line">Shipping: <span>${shipping > 0 ? formatPrice(shipping) : "Free"}</span></div>
      </div>
      <div>Total: ${formatPrice(total)}</div>
    `;
    container.appendChild(footer);
  }

  const { total } = calcCartTotals();
  const orderTotal = document.getElementById("order-total");
  orderTotal.textContent = formatPrice(total);

  updateCartCount();
}

function addToCart(productId) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  if (cart.has(productId)) {
    const existing = cart.get(productId);
    existing.quantity += 1;
  } else {
    cart.set(productId, { product, quantity: 1 });
  }

  renderCart();
}

function updateQuantity(productId, delta) {
  if (!cart.has(productId)) return;
  const entry = cart.get(productId);
  entry.quantity += delta;
  if (entry.quantity <= 0) {
    cart.delete(productId);
  }
  renderCart();
}

function removeFromCart(productId) {
  if (!cart.has(productId)) return;
  cart.delete(productId);
  renderCart();
}

function setupEventListeners() {
  document.getElementById("products-grid").addEventListener("click", (e) => {
    const btn = e.target.closest(".add-to-cart");
    if (!btn) return;
    const id = btn.getAttribute("data-product-id");
    addToCart(id);
  });

  document.getElementById("cart").addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    const action = btn.getAttribute("data-action");
    const id = btn.getAttribute("data-product-id");
    if (!action || !id) return;

    if (action === "increase") updateQuantity(id, 1);
    if (action === "decrease") updateQuantity(id, -1);
    if (action === "remove") removeFromCart(id);
  });

  document.getElementById("cart-toggle").addEventListener("click", () => {
    const cartSection = document.getElementById("cart-section");
    cartSection.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  // Live search filter for sauces
  const searchInput = document.getElementById("sauce-search");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const query = e.target.value.toLowerCase().trim();
      const filtered = products.filter((p) => {
        const haystack = `${p.name} ${p.label} ${p.description}`.toLowerCase();
        return haystack.includes(query);
      });
      renderProducts(filtered);
    });
  }

  const checkoutForm = document.getElementById("checkout-form");
  checkoutForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const wasValid = validateCheckoutForm();
    const { total } = calcCartTotals();

    if (!wasValid) return;
    if (total === 0) {
      alert("Your cart is empty — add a bottle or two before checking out.");
      return;
    }

    const success = document.getElementById("checkout-success");
    success.hidden = false;

    setTimeout(() => {
      success.hidden = true;
    }, 5000);
  });

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const targetId = anchor.getAttribute("href").slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
}

function validateCheckoutForm() {
  const form = document.getElementById("checkout-form");
  const fields = ["name", "email", "address", "city", "card", "expiry", "cvc"];
  let allValid = true;

  fields.forEach((fieldName) => {
    const input = form.elements[fieldName];
    const errorEl = form.querySelector(`.field-error[data-for="${fieldName}"]`);
    if (!input || !errorEl) return;
    let message = "";

    if (!input.value.trim()) {
      message = "This field is required.";
    } else if (fieldName === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim())) {
      message = "Enter a valid email.";
    } else if (fieldName === "card" && input.value.replace(/\s+/g, "").length < 12) {
      message = "Enter a mock 12+ digit card.";
    } else if (fieldName === "cvc" && input.value.trim().length < 3) {
      message = "CVC should be at least 3 digits.";
    }

    if (message) {
      allValid = false;
      errorEl.textContent = message;
    } else {
      errorEl.textContent = "";
    }
  });

  return allValid;
}

function initYear() {
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

function init() {
  renderProducts();
  renderCart();
  setupEventListeners();
  initYear();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
