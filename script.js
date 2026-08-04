/* ===================================================================
   Brew Haven — script.js
   Product data, rendering, search/filter, cart, checkout, toasts,
   dark mode, and mobile menu. Vanilla JS only.
   =================================================================== */

// ---------------------------------------------------------------
// 1. PRODUCT DATA
// ---------------------------------------------------------------
const PRODUCTS = [
  {
    id: "esp-01",
    name: "Espresso",
    category: "coffee",
    desc: "A concentrated shot pulled from freshly roasted beans — bold, syrupy, and intense.",
    price: 3.25,
    rating: 5,
    img: "https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "cap-02",
    name: "Cappuccino",
    category: "coffee",
    desc: "Equal parts espresso, steamed milk, and velvety foam, dusted with cocoa.",
    price: 4.25,
    rating: 5,
    img: "https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "lat-03",
    name: "Latte",
    category: "coffee",
    desc: "Smooth espresso layered with silky steamed milk and a whisper of foam art.",
    price: 4.5,
    rating: 4,
    img: "https://images.unsplash.com/photo-1561047029-3000c68339ca?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "ame-04",
    name: "Americano",
    category: "coffee",
    desc: "Espresso lengthened with hot water for a lighter body and cleaner finish.",
    price: 3.5,
    rating: 4,
    img: "https://images.unsplash.com/photo-1520031607889-97ba0c7190ff?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "moc-05",
    name: "Mocha",
    category: "coffee",
    desc: "Espresso and steamed milk meet rich dark chocolate, finished with cream.",
    price: 4.75,
    rating: 5,
    img: "https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "cmc-06",
    name: "Caramel Macchiato",
    category: "coffee",
    desc: "Vanilla-steamed milk marked with espresso and a drizzle of caramel.",
    price: 4.95,
    rating: 5,
    img: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "grn-07",
    name: "Green Tea",
    category: "tea",
    desc: "Delicate, grassy, and full of antioxidants — steeped light for clarity.",
    price: 3.0,
    rating: 4,
    img: "https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "mat-08",
    name: "Matcha Latte",
    category: "tea",
    desc: "Stone-ground ceremonial matcha whisked with steamed milk, subtly sweet.",
    price: 4.75,
    rating: 5,
    img: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "blk-09",
    name: "Black Tea",
    category: "tea",
    desc: "A robust, malty classic steeped strong — excellent with a splash of milk.",
    price: 3.0,
    rating: 4,
    img: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "cha-10",
    name: "Chamomile Tea",
    category: "tea",
    desc: "Floral and soothing, hand-picked blossoms steeped for a caffeine-free calm.",
    price: 3.25,
    rating: 4,
    img: "https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "egr-11",
    name: "Earl Grey",
    category: "tea",
    desc: "Black tea scented with bergamot oil — fragrant, bright, and elegant.",
    price: 3.5,
    rating: 5,
    img: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "tml-12",
    name: "Red Milk Tea",
    category: "tea",
    desc: "Strong-brewed spiced tea sweetened and layered with creamy milk over ice.",
    price: 4.25,
    rating: 5,
    img: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?auto=format&fit=crop&w=800&q=80",
  },
];

// ---------------------------------------------------------------
// 2. STATE
// ---------------------------------------------------------------
let cart = JSON.parse(localStorage.getItem("brewHavenCart") || "[]");

// ---------------------------------------------------------------
// 3. DOM REFERENCES
// ---------------------------------------------------------------
const productGrid = document.getElementById("product-grid");
const cartCountEl = document.getElementById("cart-count");
const cartPanel = document.getElementById("cart-panel");
const cartOverlay = document.getElementById("cart-overlay");
const cartItemsEl = document.getElementById("cart-items");
const cartSubtotalEl = document.getElementById("cart-subtotal");
const cartEmptyEl = document.getElementById("cart-empty");
const toastContainer = document.getElementById("toast-container");
const mobileMenu = document.getElementById("mobile-menu");

// 4. HELPERS

function formatPrice(n) {
  return `$${n.toFixed(2)}`;
}

//rating

function starMarkup(rating) {
  let out = "";
  for (let i = 0; i < 5; i++) {
    out += `<span class="${i < rating ? "star-fill" : "star-empty"}">★</span>`;
  }
  return out;
}

function saveCart() {
  localStorage.setItem("brewHavenCart", JSON.stringify(cart));
}

function showToast(message) {
  const toast = document.createElement("div");
  toast.className =
    "toast-enter fixed bottom-6 left-1/2 z-[80] rounded-xl bg-[#2c1810] px-5 py-3 text-sm font-medium text-cream-50 text-white shadow-xl";
  toast.style.left = "50%";
  toast.textContent = message;
  toastContainer.appendChild(toast);
  setTimeout(() => {
    toast.style.transition = "opacity .3s ease";
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 300);
  }, 2200);
}

// ---------------------------------------------------------------
// 5. RENDER PRODUCTS
// ---------------------------------------------------------------
function renderProducts() {
  if (!productGrid) return;
  productGrid.innerHTML = PRODUCTS.map(
    (p, idx) => `
    <div class="product-card fade-in-up group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-md shadow-black/5" style="animation-delay:${(idx % 6) * 0.06}s">
      <span class="category-badge absolute left-3 top-3 z-10 rounded-full bg-white/85 px-3 py-1 text-xs font-semibold uppercase tracking-wide ${p.category === "coffee" ? "text-[#6f4e37]" : "text-[#4caf50]"}">
        ${p.category}
      </span>
      <div class="relative h-48 overflow-hidden">
        <img src="${p.img}" alt="${p.name}" loading="lazy" class="product-img h-full w-full object-cover" />
      </div>
      <div class="flex flex-1 flex-col p-5">
        <h3 class="font-poppins text-lg font-semibold text-[#3a2a1e]">${p.name}</h3>
        <p class="mt-1 flex-1 text-sm leading-relaxed text-[#3a2a1e]/60">${p.desc}</p>
        <div class="mt-3 flex items-center justify-between">
          <div class="text-sm">${starMarkup(p.rating)}</div>
          <span class="font-poppins text-lg font-bold text-[#6f4e37]">${formatPrice(p.price)}</span>
        </div>
        <div class="mt-4">
          <button
            class="btn-brew w-full rounded-xl bg-[#6f4e37] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#5a3f2c]"
            data-add="${p.id}">
            Add to Cart
          </button>
        </div>
      </div>
    </div>`
  ).join("");
}

// ---------------------------------------------------------------
// 6. CART LOGIC
// ---------------------------------------------------------------
function addToCart(productId, silent = false) {
  const product = PRODUCTS.find((p) => p.id === productId);
  if (!product) return;
  const existing = cart.find((item) => item.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id: product.id, name: product.name, price: product.price, img: product.img, qty: 1 });
  }
  saveCart();
  renderCart();
  if (!silent) showToast(`${product.name} added to cart`);
}

function updateQty(productId, delta) {
  const item = cart.find((i) => i.id === productId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter((i) => i.id !== productId);
  }
  saveCart();
  renderCart();
}

function removeFromCart(productId) {
  cart = cart.filter((i) => i.id !== productId);
  saveCart();
  renderCart();
}

function cartSubtotal() {
  return cart.reduce((sum, i) => sum + i.price * i.qty, 0);
}

function renderCart() {
  const totalItems = cart.reduce((sum, i) => sum + i.qty, 0);
  cartCountEl.textContent = totalItems;
  cartCountEl.classList.toggle("hidden", totalItems === 0);

  if (cart.length === 0) {
    cartItemsEl.innerHTML = "";
    cartEmptyEl.classList.remove("hidden");
  } else {
    cartEmptyEl.classList.add("hidden");
    cartItemsEl.innerHTML = cart
      .map(
        (item) => `
      <div class="flex items-center gap-3 border-b border-[#eee2d4] py-4">
        <img src="${item.img}" alt="${item.name}" class="h-16 w-16 rounded-xl object-cover" />
        <div class="flex-1">
          <p class="font-poppins text-sm font-semibold text-[#3a2a1e]">${item.name}</p>
          <p class="text-sm text-[#6f4e37]">${formatPrice(item.price)}</p>
          <div class="mt-2 flex items-center gap-2">
            <button class="h-6 w-6 rounded-full bg-[#f8f5f2] text-sm font-bold text-[#6f4e37] hover:bg-[#eee2d4]" data-qty-minus="${item.id}">−</button>
            <span class="w-5 text-center text-sm">${item.qty}</span>
            <button class="h-6 w-6 rounded-full bg-[#f8f5f2] text-sm font-bold text-[#6f4e37] hover:bg-[#eee2d4]" data-qty-plus="${item.id}">+</button>
          </div>
        </div>
        <button class="self-start text-xs font-medium text-red-500 hover:underline" data-remove="${item.id}">Remove</button>
      </div>`
      )
      .join("");
  }

  cartSubtotalEl.textContent = formatPrice(cartSubtotal());
}

function openCart() {
  cartPanel.classList.remove("translate-x-full");
  cartOverlay.classList.remove("pointer-events-none", "opacity-0");
}

function closeCart() {
  cartPanel.classList.add("translate-x-full");
  cartOverlay.classList.add("opacity-0");
  setTimeout(() => cartOverlay.classList.add("pointer-events-none"), 350);
}

// ---------------------------------------------------------------
// 7. EVENT DELEGATION
// ---------------------------------------------------------------
if (productGrid) {
  productGrid.addEventListener("click", (e) => {
    const addBtn = e.target.closest("[data-add]");
    if (addBtn) addToCart(addBtn.dataset.add);
  });
}

cartItemsEl.addEventListener("click", (e) => {
  const minus = e.target.closest("[data-qty-minus]");
  const plus = e.target.closest("[data-qty-plus]");
  const remove = e.target.closest("[data-remove]");
  if (minus) updateQty(minus.dataset.qtyMinus, -1);
  if (plus) updateQty(plus.dataset.qtyPlus, 1);
  if (remove) removeFromCart(remove.dataset.remove);
});

document.getElementById("cart-toggle").addEventListener("click", openCart);
document.getElementById("cart-close").addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

document.getElementById("checkout-btn").addEventListener("click", () => {
  if (cart.length === 0) return;
  showToast("Order placed — thank you for choosing Brew Haven!");
  cart = [];
  saveCart();
  renderCart();
  closeCart();
});

// ---------------------------------------------------------------
// 8. MOBILE MENU
// ---------------------------------------------------------------
document.getElementById("mobile-menu-toggle").addEventListener("click", () => {
  mobileMenu.classList.toggle("hidden");
});
mobileMenu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => mobileMenu.classList.add("hidden"));
});

// ---------------------------------------------------------------
// 9. NEWSLETTER FORM (footer)
// ---------------------------------------------------------------
const newsletterForm = document.getElementById("newsletter-form");
if (newsletterForm) {
  newsletterForm.addEventListener("submit", (e) => {
    e.preventDefault();
    showToast("Subscribed! Watch your inbox for brewing news.");
    newsletterForm.reset();
  });
}

// ---------------------------------------------------------------
// 10. CONTACT FORM (contact.html)
// ---------------------------------------------------------------
const contactForm = document.getElementById("contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    showToast("Message sent — we'll get back to you soon!");
    contactForm.reset();
  });
}

// ---------------------------------------------------------------
// 11. LOGIN / SIGN UP TABS (login.html)
// ---------------------------------------------------------------
const tabLogin = document.getElementById("tab-login");
const tabSignup = document.getElementById("tab-signup");
const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");

if (tabLogin && tabSignup) {
  function showLogin() {
    loginForm.classList.remove("hidden");
    signupForm.classList.add("hidden");
    tabLogin.classList.add("bg-[#6F4E37]", "text-white");
    tabLogin.classList.remove("text-[#6F4E37]");
    tabSignup.classList.remove("bg-[#6F4E37]", "text-white");
    tabSignup.classList.add("text-[#6F4E37]");
  }
  function showSignup() {
    signupForm.classList.remove("hidden");
    loginForm.classList.add("hidden");
    tabSignup.classList.add("bg-[#6F4E37]", "text-white");
    tabSignup.classList.remove("text-[#6F4E37]");
    tabLogin.classList.remove("bg-[#6F4E37]", "text-white");
    tabLogin.classList.add("text-[#6F4E37]");
  }
  tabLogin.addEventListener("click", showLogin);
  tabSignup.addEventListener("click", showSignup);

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    showToast("Logged in — welcome back!");
  });
  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    showToast("Account created — welcome to Brew Haven!");
  });
}

// ---------------------------------------------------------------
// 12. INIT
// ---------------------------------------------------------------
(function init() {
  renderProducts();
  renderCart();
})();