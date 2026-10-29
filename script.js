/* =========================================
   LUEUR D'OR — JAVASCRIPT
   ========================================= */

// Os dados abaixo são exemplos para demonstração.
// O site não exige login para navegar.

const $ = (selector) => document.querySelector(selector);

const storeScreen = $("#homeScreen");
const splashScreen = $("#splashScreen");
const checkoutScreen = $("#checkoutScreen");
const checkoutForm = $("#checkoutForm");

let currentView = "home";
let toastTimeout;

// =========================================
// 1. PRODUTOS ALTERA AQUI AS IMAGENS DA SROUPAS image: "verao 1.png"
// =========================================

const products = [
  // VERÃO
  {
    id: 1,
    name: "Conjunto Brisa",
    description: "Conjuntoleve, ideal para os dias ensolarados.",
    price: 89.83,
    season: "verao",
    image: "verao 1.png"
  },
  {
    id: 2,
    name: "Flor de Verão",
    description: "Vestido delicado para ocasiões especiais.",
    price: 127.92,
    season: "verao",
    image: "verao 2.png"
  },
  {
    id: 3,
    name: "Conjunto Âmbar",
    description: "Conjunto com caimento ideal e elegância.",
    price: 87.42,
    season: "verao",
    image: "verao 3.png"
  },

  // OUTONO
  {
    id: 4,
    name: "Conjunto Solare",
    description: "Modelagem elegante em tons acolhedores.",
    price: 119.90,
    season: "outono",
    image: "outono 1.png"
  },
  {
    id: 5,
    name: "Vestdido Canela",
    description: "Vestido versátil com acabamento delicado.",
    price: 74.90,
    season: "outono",
    image: "outono 2.png"
  },
  {
    id: 6,
    name: "Vestido Cota",
    description: "Vestido de caimento confortável e sofisticado.",
    price: 109.90,
    season: "outono",
    image: "outono 3.png"
  },

  // PRIMAVERA
  {
    id: 7,
    name: "Vestido Flor de Lis",
    description: "Peça romântica inspirada na primavera.",
    price: 99.90,
    season: "primavera",
    image: "primavera 1.png"
  },
  {
    id: 8,
    name: "Conjunto Jardim",
    description: "Conjunto leve para composições delicadas.",
    price: 139.90,
    season: "primavera",
    image: "primavera 2.png"
  },
  {
    id: 9,
    name: "Vestido Primavera",
    description: "Vestido elegante com movimento suave.",
    price: 84.90,
    season: "primavera",
    image: "primavera 3.png"
  },

  // INVERNO
  {
    id: 10,
    name: "Conjunto Aura",
    description: "Conjunto básico e sofisticado para dias especiais.",
    price: 149.90,
    season: "inverno",
    image: "inverno 1.png"
  },
  {
    id: 11,
    name: "Conjunto Aconchego",
    description: "Composição confortável com estilo atemporal.",
    price: 89.90,
    season: "inverno",
    image: "inverno 2.png"
  },
  {
    id: 12,
    name: "Conjunto Inverno",
    description: "Conjunto elegante para dias mais frescos.",
    price: 169.90,
    season: "inverno",
    image: "inverno 3.png"
  }
];

const seasonNames = {
  verao: "Verão",
  outono: "Outono",
  primavera: "Primavera",
  inverno: "Inverno"
};

const seasonDescriptions = {
  verao: "Leveza, frescor e elegância para os dias ensolarados.",
  outono: "Tons acolhedores e peças para composições sofisticadas.",
  primavera: "Delicadeza, movimento e inspiração floral.",
  inverno: "Conforto e sofisticação em cada detalhe."
};

// =========================================
// 2. ARMAZENAMENTO LOCAL
// =========================================

function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function saveStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    showToast("Não foi possível salvar os dados neste navegador.");
  }
}

function getFavorites() {
  return readStorage("lueurFavorites", []);
}

function getCart() {
  return readStorage("lueurCart", []);
}

function setFavorites(items) {
  saveStorage("lueurFavorites", items);
}

function setCart(items) {
  saveStorage("lueurCart", items);
}

// =========================================
// 3. MENSAGENS E ABERTURA DA MARCA
// =========================================

function showToast(message) {
  const toast = $("#toast");

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimeout);

  toastTimeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 2800);
}

function startExperience() {
  window.setTimeout(() => {
    splashScreen.classList.add("hidden");
    storeScreen.classList.remove("hidden");

    renderHome();
    updateCounters();
  }, 2800);
}

// =========================================
// 4. FINALIZAÇÃO DA COMPRA
// =========================================

function openCheckout() {
  if (getCart().length === 0) {
    showToast("Adicione pelo menos um produto ao carrinho.");
    return;
  }

  $("#checkoutMessage").textContent = "";

  $("#orderSuccess").classList.add("hidden");
  checkoutForm.classList.remove("hidden");
  checkoutScreen.classList.remove("hidden");

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

function closeCheckout() {
  checkoutScreen.classList.add("hidden");

  checkoutForm.reset();

  $("#checkoutMessage").textContent = "";
  $("#orderSuccess").classList.add("hidden");

  checkoutForm.classList.remove("hidden");
}

$("#closeCheckout").addEventListener("click", closeCheckout);

$("#finishOrder").addEventListener("click", () => {
  closeCheckout();
  renderHome();
});

$("#accountBtn").addEventListener("click", openCheckout);

$("#menuCheckout").addEventListener("click", () => {
  $("#menuPanel").classList.add("hidden");
  openCheckout();
});

checkoutForm.addEventListener("submit", event => {
  event.preventDefault();

  const customerNumber = $("#customerNumber").value.trim();
  const customerName = $("#customerName").value.trim();
  const cpf = $("#customerCpf").value.replace(/\D/g, "");
  const email = $("#customerEmail").value.trim();
  const phone = $("#customerPhone").value.trim();
  const street = $("#customerStreet").value.trim();
  const city = $("#customerCity").value.trim();
  const state = $("#customerState").value.trim().toUpperCase();

  const message = $("#checkoutMessage");

  message.textContent = "";

  if (
    !customerNumber ||
    !customerName ||
    !email ||
    !phone ||
    !street ||
    !city ||
    !state
  ) {
    message.textContent = "Preencha todos os campos.";
    return;
  }

  if (cpf.length !== 11) {
    message.textContent = "Confira o CPF: ele deve conter 11 números.";
    return;
  }

  if (!/^[A-Z]{2}$/.test(state)) {
    message.textContent =
      "Informe a sigla do estado, por exemplo: RN.";
    return;
  }

  // Demonstração:
  // os dados não são enviados nem armazenados pelo checkout.

  checkoutForm.classList.add("hidden");
  $("#orderSuccess").classList.remove("hidden");

  $("#orderSuccessMessage").textContent =
    `Obrigado, ${customerName}. Seus dados foram validados nesta demonstração. ` +
    "O pedido ainda não foi enviado nem registrado. Para concluir uma compra real, " +
    "será necessário conectar o checkout a um servidor seguro.";
});

// =========================================
// 5. CARROSSEL AUTOMÁTICO — 5 SEGUNDOS
// =========================================

const slides = Array.from(
  document.querySelectorAll(".carousel-slide")
);

let currentSlide = 0;
let carouselInterval;

function createCarouselDots() {
  const container = $("#carouselDots");

  container.replaceChildren();

  slides.forEach((slide, index) => {
    const dot = document.createElement("button");

    dot.className = "carousel-dot";

    dot.setAttribute(
      "aria-label",
      `Ir para a imagem ${index + 1}`
    );

    dot.addEventListener("click", () => {
      showSlide(index);
      restartCarousel();
    });

    container.appendChild(dot);
  });
}

function showSlide(index) {
  if (!slides.length) return;

  currentSlide = (index + slides.length) % slides.length;

  slides.forEach((slide, i) => {
    slide.classList.toggle("active", i === currentSlide);
  });

  Array.from($("#carouselDots").children).forEach((dot, i) => {
    dot.classList.toggle("active", i === currentSlide);
  });
}

function nextSlide() {
  showSlide(currentSlide + 1);
}

function prevSlide() {
  showSlide(currentSlide - 1);
}

function restartCarousel() {
  clearInterval(carouselInterval);

  carouselInterval = setInterval(() => {
    nextSlide();
  }, 5000);
}

$("#nextSlide").addEventListener("click", () => {
  nextSlide();
  restartCarousel();
});

$("#prevSlide").addEventListener("click", () => {
  prevSlide();
  restartCarousel();
});

// =========================================
// 6. CARDS DE PRODUTOS
// =========================================

function formatPrice(value) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

function createProductCard(product) {
  const favorite = getFavorites().includes(product.id);

  const card = document.createElement("article");
  card.className = "product-card";

  const imageArea = document.createElement("div");
  imageArea.className = "product-image";

  const image = document.createElement("img");

  image.src = product.image;
  image.alt = product.name;
  image.loading = "lazy";

  const placeholder = document.createElement("div");

  placeholder.className = "product-placeholder";
  placeholder.textContent = product.name;

  image.addEventListener("error", () => {
    image.remove();
    imageArea.prepend(placeholder);
  });

  imageArea.appendChild(image);

  const heart = document.createElement("button");

  heart.className =
    "heart-btn" + (favorite ? " is-favorite" : "");

  heart.type = "button";
  heart.innerHTML = favorite ? "♥" : "♡";

  heart.setAttribute(
    "aria-label",
    favorite
      ? "Remover dos favoritos"
      : "Adicionar aos favoritos"
  );

  heart.addEventListener("click", () => {
    toggleFavorite(product.id);
    renderCurrentView();
  });

  imageArea.appendChild(heart);

  const info = document.createElement("div");
  info.className = "product-info";

  const season = document.createElement("span");

  season.className = "product-season";
  season.textContent = seasonNames[product.season];

  const name = document.createElement("h3");
  name.textContent = product.name;

  const description = document.createElement("p");

  description.className = "product-description";
  description.textContent = product.description;

  const price = document.createElement("p");

  price.className = "product-price";
  price.textContent = formatPrice(product.price);

  const addButton = document.createElement("button");

  addButton.className = "add-cart-btn";
  addButton.textContent = "Adicionar ao carrinho";
  addButton.type = "button";

  addButton.addEventListener("click", () => {
    addToCart(product.id);
  });

  info.append(season, name, description, price, addButton);
  card.append(imageArea, info);

  return card;
}

function renderProducts(container, items) {
  container.replaceChildren();

  items.forEach(product => {
    container.appendChild(createProductCard(product));
  });
}

// =========================================
// 7. HOME E COLEÇÕES
// =========================================

function renderHome() {
  currentView = "home";

  $("#homeView").classList.remove("hidden");
  $("#listingView").classList.add("hidden");

  const featured = products.slice(0, 6);

  renderProducts($("#homeProducts"), featured);
}

function openCollection(season) {
  currentView = season;

  $("#homeView").classList.add("hidden");
  $("#listingView").classList.remove("hidden");

  $("#listingTitle").textContent =
    seasonNames[season] || "Coleção";

  $("#listingDescription").textContent =
    seasonDescriptions[season] || "";

  $("#listingProducts").className = "product-grid";
  $("#listingProducts").style.display = "grid";

  $("#listingProducts").style.gridTemplateColumns =
    "repeat(3, minmax(0, 1fr))";

  $("#emptyMessage").classList.add("hidden");

  const seasonProducts = products.filter(
    product => product.season === season
  );

  renderProducts($("#listingProducts"), seasonProducts);

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

function renderFavorites() {
  currentView = "favorites";

  $("#homeView").classList.add("hidden");
  $("#listingView").classList.remove("hidden");

  $("#listingTitle").textContent = "Meus favoritos";

  $("#listingDescription").textContent =
    "As peças que conquistaram seu coração.";

  $("#listingProducts").className = "product-grid";
  $("#listingProducts").style.display = "grid";

  $("#listingProducts").style.gridTemplateColumns =
    "repeat(3, minmax(0, 1fr))";

  const favoriteProducts = products.filter(
    product => getFavorites().includes(product.id)
  );

  renderProducts($("#listingProducts"), favoriteProducts);

  $("#emptyMessage").textContent =
    "Você ainda não adicionou peças aos favoritos.";

  $("#emptyMessage").classList.toggle(
    "hidden",
    favoriteProducts.length > 0
  );

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

// =========================================
// 8. FAVORITOS
// =========================================

function toggleFavorite(id) {
  let favorites = getFavorites();

  if (favorites.includes(id)) {
    favorites = favorites.filter(item => item !== id);
    showToast("Produto removido dos favoritos.");
  } else {
    favorites.push(id);
    showToast("Produto adicionado aos favoritos!");
  }

  setFavorites(favorites);
  updateCounters();
}

$("#favoritesBtn").addEventListener("click", renderFavorites);

// =========================================
// 9. CARRINHO E QUANTIDADES
// =========================================

function addToCart(id) {
  const cart = getCart();

  const item = cart.find(product => product.id === id);

  if (item) {
    item.quantity += 1;
  } else {
    cart.push({
      id,
      quantity: 1
    });
  }

  setCart(cart);
  updateCounters();

  showToast("Produto adicionado ao carrinho!");
}

function changeQuantity(id, amount) {
  let cart = getCart();

  const item = cart.find(product => product.id === id);

  if (!item) return;

  item.quantity += amount;

  if (item.quantity <= 0) {
    cart = cart.filter(product => product.id !== id);
  }

  setCart(cart);

  renderCart();
  updateCounters();
}

function removeFromCart(id) {
  setCart(
    getCart().filter(item => item.id !== id)
  );

  renderCart();
  updateCounters();

  showToast("Produto removido do carrinho.");
}

function renderCart() {
  currentView = "cart";

  $("#homeView").classList.add("hidden");
  $("#listingView").classList.remove("hidden");

  $("#listingTitle").textContent = "Meu carrinho";

  $("#listingDescription").textContent =
    "Confira suas peças antes de continuar.";

  const container = $("#listingProducts");

  container.replaceChildren();
  container.className = "";
  container.style.display = "block";

  const cart = getCart();

  let subtotal = 0;
  let totalQuantity = 0;

  cart.forEach(item => {
    const product = products.find(
      p => p.id === item.id
    );

    if (!product) return;

    subtotal += product.price * item.quantity;
    totalQuantity += item.quantity;

    const row = document.createElement("article");
    row.className = "cart-item";

    const image = document.createElement("img");

    image.src = product.image;
    image.alt = product.name;

    const placeholder = document.createElement("div");

    placeholder.className = "cart-thumb";
    placeholder.textContent = product.name;

    image.addEventListener("error", () => {
      image.replaceWith(placeholder);
    });

    const info = document.createElement("div");

    const name = document.createElement("h3");
    name.textContent = product.name;

    const price = document.createElement("p");
    price.textContent = formatPrice(product.price);

    const quantity = document.createElement("div");
    quantity.className = "quantity-controls";

    const decrease = document.createElement("button");

    decrease.textContent = "−";
    decrease.setAttribute(
      "aria-label",
      "Diminuir quantidade"
    );

    decrease.addEventListener("click", () => {
      changeQuantity(product.id, -1);
    });

    const count = document.createElement("span");
    count.textContent = item.quantity;

    const increase = document.createElement("button");

    increase.textContent = "+";
    increase.setAttribute(
      "aria-label",
      "Aumentar quantidade"
    );

    increase.addEventListener("click", () => {
      changeQuantity(product.id, 1);
    });

    quantity.append(decrease, count, increase);
    info.append(name, price, quantity);

    const remove = document.createElement("button");

    remove.className = "remove-btn";
    remove.textContent = "Remover";

    remove.addEventListener("click", () => {
      removeFromCart(product.id);
    });

    row.append(image, info, remove);

    container.appendChild(row);
  });

  $("#emptyMessage").textContent =
    "Seu carrinho está vazio. Explore nossas coleções e encontre suas peças favoritas.";

  $("#emptyMessage").classList.toggle(
    "hidden",
    cart.length > 0
  );

  const summary = document.createElement("div");
  summary.className = "cart-summary";

  const quantityLabel = document.createElement("p");

  quantityLabel.textContent =
    `Itens selecionados: ${totalQuantity}`;

  const subtotalLabel = document.createElement("p");

  subtotalLabel.textContent =
    `Subtotal: ${formatPrice(subtotal)}`;

  const checkoutButton = document.createElement("button");

  checkoutButton.textContent = "Finalizar compra";
  checkoutButton.disabled = cart.length === 0;

  checkoutButton.addEventListener("click", openCheckout);

  summary.append(quantityLabel, subtotalLabel, checkoutButton);

  container.appendChild(summary);

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

$("#cartBtn").addEventListener("click", renderCart);

// =========================================
// 10. CONTADORES
// =========================================

function updateCounters() {
  const favoriteCount = getFavorites().length;

  const cartCount = getCart().reduce(
    (total, item) => total + item.quantity,
    0
  );

  $("#favoriteCount").textContent = favoriteCount;
  $("#cartCount").textContent = cartCount;
}

// =========================================
// 11. PESQUISA FUNCIONAL
// =========================================

$("#searchInput").addEventListener("input", function () {
  const query = this.value.trim().toLocaleLowerCase("pt-BR");

  if (!query) {
    if (currentView === "home") {
      renderHome();
    }

    return;
  }

  currentView = "search";

  $("#homeView").classList.add("hidden");
  $("#listingView").classList.remove("hidden");

  $("#listingTitle").textContent = "Resultados da pesquisa";

  $("#listingDescription").textContent =
    `Resultados para: "${this.value.trim()}"`;

  $("#listingProducts").className = "product-grid";
  $("#listingProducts").style.display = "grid";

  $("#listingProducts").style.gridTemplateColumns =
    "repeat(3, minmax(0, 1fr))";

  const results = products.filter(product => {
    const text = [
      product.name,
      product.description,
      seasonNames[product.season]
    ]
      .join(" ")
      .toLocaleLowerCase("pt-BR");

    return text.includes(query);
  });

  renderProducts($("#listingProducts"), results);

  $("#emptyMessage").textContent =
    "Nenhuma peça foi encontrada. Tente pesquisar outro nome ou coleção.";

  $("#emptyMessage").classList.toggle(
    "hidden",
    results.length > 0
  );
});

// =========================================
// 12. MENU E NAVEGAÇÃO
// =========================================

$("#menuBtn").addEventListener("click", function () {
  $("#menuPanel").classList.toggle("hidden");
});

$("#menuPanel").addEventListener("click", function (event) {
  const button = event.target.closest("[data-view]");

  if (!button) return;

  const view = button.dataset.view;

  $("#menuPanel").classList.add("hidden");
  $("#searchInput").value = "";

  if (view === "home") {
    renderHome();
  } else if (view === "favorites") {
    renderFavorites();
  } else if (view === "cart") {
    renderCart();
  } else {
    openCollection(view);
  }
});

document.querySelectorAll("[data-collection]").forEach(button => {
  button.addEventListener("click", () => {
    $("#searchInput").value = "";
    openCollection(button.dataset.collection);
  });
});

$("#backHome").addEventListener("click", () => {
  $("#searchInput").value = "";
  renderHome();
});

function renderCurrentView() {
  if (currentView === "home") {
    renderHome();
  } else if (currentView === "favorites") {
    renderFavorites();
  } else if (currentView === "cart") {
    renderCart();
  } else if (currentView === "search") {
    $("#searchInput").dispatchEvent(new Event("input"));
  } else {
    openCollection(currentView);
  }
}

// =========================================
// 13. INICIALIZAÇÃO
// =========================================

createCarouselDots();
showSlide(0);
restartCarousel();
startExperience();