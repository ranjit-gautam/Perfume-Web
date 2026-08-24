/**
 * RG SHOP - Main Application Logic
 * Interactive E-Commerce Fragrance Experience, Filtering, Sorting, Bag & Wishlist
 */

document.addEventListener('DOMContentLoaded', () => {
  // Global State
  const state = {
    filters: {
      family: 'all',       // Default 'all' so all items & photos show immediately
      occasion: 'all',     // Default 'all'
      intensity: 0,        // 0 means all intensities
      search: '',
      sortBy: 'featured',  // 'featured', 'price-low', 'price-high', 'name'
      viewColumns: 2       // 2 or 3 columns on large screens
    },
    productCardSizes: {},  // Map of productId -> selected size (e.g. '50ml' or '100ml')
    cart: JSON.parse(localStorage.getItem('rg_shop_cart') || '[]'),
    wishlist: JSON.parse(localStorage.getItem('rg_shop_wishlist') || '[]'),
    discountCode: null,
    discountPercent: 0,
    activeQuickViewId: null
  };

  // Set initial selected size for each product
  if (window.FRAGRANCES) {
    window.FRAGRANCES.forEach(p => {
      state.productCardSizes[p.id] = p.sizes && p.sizes[0] ? `${p.sizes[0].ml}ml` : '50ml';
    });
  }

  // DOM Elements
  const productsGrid = document.getElementById('products-grid');
  const viewAllBtn = document.getElementById('view-all-btn');
  const catalogCountEl = document.getElementById('catalog-count');
  const activeFiltersContainer = document.getElementById('active-filter-chips');
  const sortSelect = document.getElementById('sort-select');
  const viewToggleBtns = document.querySelectorAll('.view-toggle-btn');
  
  // Badges & Counters
  const cartBadge = document.getElementById('cart-badge');
  const wishlistBadge = document.getElementById('wishlist-badge');

  // Cart Drawer Elements
  const cartDrawerOverlay = document.getElementById('cart-drawer-overlay');
  const cartDrawer = document.getElementById('cart-drawer');
  const cartItemsList = document.getElementById('cart-items-list');
  const cartSubtotalPrice = document.getElementById('cart-subtotal-price');
  const cartTriggerBtn = document.getElementById('cart-trigger-btn');
  const cartCloseBtn = document.getElementById('cart-close-btn');
  const freeShippingBar = document.getElementById('free-shipping-bar-fill');
  const freeShippingText = document.getElementById('free-shipping-text-status');
  const couponInput = document.getElementById('cart-coupon-input');
  const couponApplyBtn = document.getElementById('cart-coupon-btn');
  const discountRow = document.getElementById('cart-discount-row');
  const discountAmountEl = document.getElementById('cart-discount-amount');

  // Wishlist Drawer Elements
  const wishlistDrawer = document.getElementById('wishlist-drawer');
  const wishlistTriggerBtn = document.getElementById('wishlist-trigger-btn');
  const wishlistCloseBtn = document.getElementById('wishlist-close-btn');
  const wishlistItemsList = document.getElementById('wishlist-items-list');

  // Search Elements
  const searchTriggerBtn = document.getElementById('search-trigger-btn');
  const searchOverlay = document.getElementById('search-overlay');
  const searchCloseBtn = document.getElementById('search-close-btn');
  const searchInputField = document.getElementById('search-input');
  const searchResultsGrid = document.getElementById('search-results-grid');

  // Mobile Menu Elements
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
  const mobileNavDrawer = document.getElementById('mobile-nav-drawer');
  const mobileNavCloseBtn = document.getElementById('mobile-nav-close-btn');

  // Mobile Filter Elements
  const mobileFilterTrigger = document.getElementById('mobile-filter-trigger');
  const mobileFilterCount = document.getElementById('mobile-filter-count');

  // Intensity Slider & Labels
  const intensitySlider = document.getElementById('intensity-slider');
  const intensityLabels = document.querySelectorAll('.intensity-label');

  // Quick View Modal Elements
  const quickViewOverlay = document.getElementById('quick-view-overlay');
  const quickViewModal = document.getElementById('quick-view-modal');
  const quickViewCloseBtn = document.getElementById('quick-view-close-btn');
  const quickViewContent = document.getElementById('quick-view-content');

  // Toast Container
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  // --- Utility: Toast Notification ---
  function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
      <span>${message}</span>
    `;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // --- Wishlist System ---
  function saveWishlist() {
    localStorage.setItem('rg_shop_wishlist', JSON.stringify(state.wishlist));
    updateWishlistUI();
  }

  function toggleWishlist(productId) {
    const product = window.FRAGRANCES.find(p => p.id === productId);
    if (!product) return;

    const index = state.wishlist.indexOf(productId);
    if (index > -1) {
      state.wishlist.splice(index, 1);
      showToast(`Removed ${product.name} from your wishlist`);
    } else {
      state.wishlist.push(productId);
      showToast(`Added ${product.name} to your wishlist`);
    }
    saveWishlist();
    renderProducts();
  }

  function updateWishlistUI() {
    const count = state.wishlist.length;
    if (wishlistBadge) {
      wishlistBadge.textContent = count;
      wishlistBadge.style.display = count > 0 ? 'flex' : 'none';
    }

    if (!wishlistItemsList) return;

    if (count === 0) {
      wishlistItemsList.innerHTML = `
        <div style="text-align: center; padding: 4rem 1rem; color: var(--text-muted);">
          <svg style="margin: 0 auto 1rem; opacity: 0.4;" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          <p style="font-family: var(--font-serif); font-size: 1.25rem; color: var(--text-primary); margin-bottom: 0.35rem;">Your wishlist is empty</p>
          <p style="font-size: 0.85rem;">Save your favorite bespoke fragrances to keep track of them.</p>
        </div>
      `;
      return;
    }

    const items = window.FRAGRANCES.filter(p => state.wishlist.includes(p.id));
    wishlistItemsList.innerHTML = items.map(item => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}" class="cart-item-img">
        <div class="cart-item-details">
          <div>
            <h4 class="cart-item-title">${item.name}</h4>
            <div class="cart-item-size">${item.family} • ${item.subtitle}</div>
          </div>
          <div class="cart-item-controls">
            <div class="cart-item-price">${item.formattedPrice}</div>
            <div style="display: flex; gap: 0.5rem;">
              <button type="button" class="btn-checkout add-from-wishlist-btn" data-id="${item.id}" style="padding: 0.35rem 0.75rem; font-size: 0.75rem;">
                Add to Bag
              </button>
              <button type="button" class="remove-item-btn remove-wishlist-btn" data-id="${item.id}">Remove</button>
            </div>
          </div>
        </div>
      </div>
    `).join('');

    wishlistItemsList.querySelectorAll('.add-from-wishlist-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        addToCart(id, '50ml', 1);
      });
    });

    wishlistItemsList.querySelectorAll('.remove-wishlist-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        toggleWishlist(id);
      });
    });
  }

  function openWishlist() {
    if (cartDrawerOverlay) cartDrawerOverlay.classList.add('open');
    if (wishlistDrawer) wishlistDrawer.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeWishlist() {
    if (cartDrawerOverlay) cartDrawerOverlay.classList.remove('open');
    if (wishlistDrawer) wishlistDrawer.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (wishlistTriggerBtn) wishlistTriggerBtn.addEventListener('click', openWishlist);
  if (wishlistCloseBtn) wishlistCloseBtn.addEventListener('click', closeWishlist);

  // --- Cart System ---
  function saveCart() {
    localStorage.setItem('rg_shop_cart', JSON.stringify(state.cart));
    updateCartUI();
  }

  function addToCart(productId, size = '50ml', quantity = 1) {
    const product = window.FRAGRANCES.find(p => p.id === productId);
    if (!product) return;

    const sizeObj = product.sizes ? product.sizes.find(s => s.ml === parseInt(size)) : null;
    const price = sizeObj ? sizeObj.price : product.price;

    const existingIndex = state.cart.findIndex(item => item.id === productId && item.size === size);

    if (existingIndex > -1) {
      state.cart[existingIndex].quantity += quantity;
    } else {
      state.cart.push({
        id: product.id,
        name: product.name,
        subtitle: product.subtitle,
        size: size,
        price: price,
        image: product.image,
        quantity: quantity
      });
    }

    saveCart();
    showToast(`Added ${product.name} (${size}) to your bag`);
    openCart();
  }

  function updateCartQuantity(index, delta) {
    if (!state.cart[index]) return;
    state.cart[index].quantity += delta;
    if (state.cart[index].quantity <= 0) {
      state.cart.splice(index, 1);
    }
    saveCart();
  }

  function removeFromCart(index) {
    if (!state.cart[index]) return;
    const item = state.cart[index];
    state.cart.splice(index, 1);
    saveCart();
    showToast(`Removed ${item.name} from your bag`);
  }

  function updateCartUI() {
    const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartBadge) {
      cartBadge.textContent = totalItems;
      cartBadge.style.display = totalItems > 0 ? 'flex' : 'none';
    }

    if (!cartItemsList) return;

    if (state.cart.length === 0) {
      cartItemsList.innerHTML = `
        <div style="text-align: center; padding: 4rem 1rem; color: var(--text-muted);">
          <svg style="margin: 0 auto 1rem; opacity: 0.4;" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
          <p style="font-family: var(--font-serif); font-size: 1.25rem; color: var(--text-primary); margin-bottom: 0.35rem;">Your bag is empty</p>
          <p style="font-size: 0.85rem;">Discover our architectural fragrances to begin.</p>
        </div>
      `;
      if (cartSubtotalPrice) cartSubtotalPrice.textContent = '€0';
      if (freeShippingBar) freeShippingBar.style.width = '0%';
      if (freeShippingText) freeShippingText.textContent = 'Add €150 for Free Worldwide Express Delivery';
      if (discountRow) discountRow.style.display = 'none';
      return;
    }

    let subtotal = 0;
    cartItemsList.innerHTML = state.cart.map((item, idx) => {
      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;
      return `
        <div class="cart-item" data-index="${idx}">
          <img src="${item.image}" alt="${item.name}" class="cart-item-img">
          <div class="cart-item-details">
            <div>
              <h4 class="cart-item-title">${item.name}</h4>
              <div class="cart-item-size">Extrait de Parfum • ${item.size}</div>
            </div>
            <div class="cart-item-controls">
              <div class="qty-stepper">
                <button type="button" class="qty-btn btn-qty-minus" data-index="${idx}" aria-label="Decrease Quantity">-</button>
                <span class="qty-val">${item.quantity}</span>
                <button type="button" class="qty-btn btn-qty-plus" data-index="${idx}" aria-label="Increase Quantity">+</button>
              </div>
              <div class="cart-item-price">€${itemTotal}</div>
              <button type="button" class="remove-item-btn" data-index="${idx}">Remove</button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Free Shipping threshold (€150)
    const freeShippingThreshold = 150;
    const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
    if (freeShippingBar) freeShippingBar.style.width = `${progressPercent}%`;
    if (freeShippingText) {
      if (subtotal >= freeShippingThreshold) {
        freeShippingText.innerHTML = `<span>✓ Free Express Delivery Unlocked!</span> <span>€0</span>`;
      } else {
        const remaining = freeShippingThreshold - subtotal;
        freeShippingText.innerHTML = `<span>Add €${remaining} more for Free Worldwide Express Shipping</span> <span>${progressPercent}%</span>`;
      }
    }

    // Apply discount calculation if any
    let finalTotal = subtotal;
    if (state.discountPercent > 0) {
      const discountAmount = Math.round((subtotal * state.discountPercent) / 100);
      finalTotal = subtotal - discountAmount;
      if (discountRow) {
        discountRow.style.display = 'flex';
        if (discountAmountEl) discountAmountEl.textContent = `-€${discountAmount} (${state.discountCode})`;
      }
    } else {
      if (discountRow) discountRow.style.display = 'none';
    }

    if (cartSubtotalPrice) {
      cartSubtotalPrice.textContent = `€${finalTotal}`;
    }

    // Attach cart item events
    cartItemsList.querySelectorAll('.btn-qty-minus').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.target.dataset.index);
        updateCartQuantity(idx, -1);
      });
    });

    cartItemsList.querySelectorAll('.btn-qty-plus').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.target.dataset.index);
        updateCartQuantity(idx, 1);
      });
    });

    cartItemsList.querySelectorAll('.remove-item-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.target.dataset.index);
        removeFromCart(idx);
      });
    });
  }

  function openCart() {
    if (cartDrawerOverlay) cartDrawerOverlay.classList.add('open');
    if (cartDrawer) cartDrawer.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    if (cartDrawerOverlay) cartDrawerOverlay.classList.remove('open');
    if (cartDrawer) cartDrawer.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (cartTriggerBtn) cartTriggerBtn.addEventListener('click', openCart);
  if (cartCloseBtn) cartCloseBtn.addEventListener('click', closeCart);
  if (cartDrawerOverlay) {
    cartDrawerOverlay.addEventListener('click', (e) => {
      if (e.target === cartDrawerOverlay) {
        closeCart();
        closeWishlist();
      }
    });
  }

  // Coupon Code handler
  if (couponApplyBtn && couponInput) {
    couponApplyBtn.addEventListener('click', () => {
      const code = couponInput.value.trim().toUpperCase();
      if (!code) return;
      if (code === 'RG10' || code === 'WELCOME10' || code === 'RGSHOP10' || code === 'LUXURY10') {
        state.discountCode = 'RG10';
        state.discountPercent = 10;
        showToast('Promo code RG10 applied: 10% off!');
        updateCartUI();
      } else if (code === 'WELCOME15' || code === 'VIP15') {
        state.discountCode = code;
        state.discountPercent = 15;
        showToast('Promo code VIP15 applied: 15% off!');
        updateCartUI();
      } else {
        showToast('Invalid code. Try "RG10" for 10% off');
      }
    });
  }

  // --- Filtering, Sorting & Rendering ---
  function getFilteredProducts() {
    if (!window.FRAGRANCES) return [];
    
    let list = window.FRAGRANCES.filter(product => {
      // Family filter
      if (state.filters.family !== 'all' && product.family.toLowerCase() !== state.filters.family.toLowerCase()) {
        return false;
      }
      // Occasion filter
      if (state.filters.occasion !== 'all' && product.occasion.toLowerCase() !== state.filters.occasion.toLowerCase()) {
        return false;
      }
      // Intensity filter
      if (state.filters.intensity > 0 && product.intensityValue !== state.filters.intensity) {
        return false;
      }
      // Search filter
      if (state.filters.search) {
        const q = state.filters.search.toLowerCase();
        const matchName = product.name.toLowerCase().includes(q);
        const matchSubtitle = product.subtitle.toLowerCase().includes(q);
        const matchFamily = product.family.toLowerCase().includes(q);
        const matchNotes = [
          ...(product.notes.top || []),
          ...(product.notes.heart || []),
          ...(product.notes.base || [])
        ].some(n => n.toLowerCase().includes(q));
        if (!matchName && !matchSubtitle && !matchFamily && !matchNotes) {
          return false;
        }
      }
      return true;
    });

    // Sorting
    if (state.filters.sortBy === 'price-low') {
      list.sort((a, b) => a.price - b.price);
    } else if (state.filters.sortBy === 'price-high') {
      list.sort((a, b) => b.price - a.price);
    } else if (state.filters.sortBy === 'name') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  }

  function renderProducts() {
    if (!productsGrid) return;

    const filtered = getFilteredProducts();

    // Update Product Count text
    if (catalogCountEl) {
      catalogCountEl.textContent = `Showing all ${filtered.length} luxury fragrance${filtered.length === 1 ? '' : 's'}`;
    }

    // Render Active Filter Chips
    renderActiveFilterChips();

    if (filtered.length === 0) {
      productsGrid.innerHTML = `
        <div class="empty-catalog" style="grid-column: 1/-1; text-align: center; padding: 4rem 1rem; background: var(--bg-surface); border: 1px solid var(--border-light);">
          <h3 style="font-family: var(--font-serif); font-size: 1.5rem; margin-bottom: 0.5rem;">No Olfactory Matches Found</h3>
          <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 1.5rem;">Try clearing your scent family or occasion filters to see our full atelier lineup.</p>
          <button type="button" class="btn-outline" id="reset-all-filters-btn">Clear All Filters</button>
        </div>
      `;
      const resetBtn = document.getElementById('reset-all-filters-btn');
      if (resetBtn) resetBtn.addEventListener('click', resetFilters);
      return;
    }

    productsGrid.innerHTML = filtered.map(product => {
      const isWishlisted = state.wishlist.includes(product.id);
      const selectedSize = state.productCardSizes[product.id] || '50ml';
      const sizeObj = product.sizes ? product.sizes.find(s => `${s.ml}ml` === selectedSize) : null;
      const currentPrice = sizeObj ? sizeObj.price : product.price;

      return `
        <article class="product-card" data-id="${product.id}">
          <div class="product-image-box">
            <img src="${product.image}" alt="${product.imageAlt || product.name}" class="product-img" loading="lazy" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1000&auto=format&fit=crop';">
            
            ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
            
            <button type="button" class="product-wishlist-btn ${isWishlisted ? 'active' : ''}" data-id="${product.id}" aria-label="Add to Wishlist">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </button>

            <div class="product-quick-actions">
              <button type="button" class="action-btn action-btn-quick-view" data-id="${product.id}">Quick View</button>
              <button type="button" class="action-btn action-btn-add" data-id="${product.id}">Add to Bag</button>
            </div>
          </div>

          <div class="product-info">
            <h3 class="product-title">
              <a href="product.html?id=${product.id}">${product.name}</a>
            </h3>
            <p class="product-desc">${product.subtitle}</p>

            <div class="product-price" id="card-price-${product.id}">€${currentPrice}</div>

            <!-- Quick Size Chips on Card -->
            <div class="product-sizes-chips">
              ${(product.sizes || [{ ml: 50, price: product.price }]).map(s => `
                <button type="button" class="size-chip ${selectedSize === `${s.ml}ml` ? 'active' : ''}" data-product="${product.id}" data-size="${s.ml}ml" data-price="${s.price}">
                  ${s.ml}ml
                </button>
              `).join('')}
            </div>

            <div class="product-stock-tag">
              <span class="product-stock-dot"></span>
              <span>${product.stockStatus || 'In Stock - Dispatches Today'}</span>
            </div>

            <!-- Direct Order & Bag Buttons on Card for Easy Customer Ordering -->
            <div class="product-card-buttons">
              <button type="button" class="btn-card-order action-btn-order-now" data-id="${product.id}" aria-label="Order ${product.name} Now">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
                  <path d="M3 6h18"></path>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
                Order Now
              </button>
              <button type="button" class="btn-card-bag action-btn-add-card" data-id="${product.id}" aria-label="Add ${product.name} to Bag">
                Add to Bag
              </button>
            </div>
          </div>
        </article>
      `;
    }).join('');

    // Attach Card Actions
    productsGrid.querySelectorAll('.action-btn-quick-view').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        openQuickView(id);
      });
    });

    productsGrid.querySelectorAll('.action-btn-add, .action-btn-add-card').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        const size = state.productCardSizes[id] || '50ml';
        addToCart(id, size, 1);
      });
    });

    // Direct 1-Click Order button on each card
    productsGrid.querySelectorAll('.action-btn-order-now').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        const size = state.productCardSizes[id] || '50ml';
        const product = window.FRAGRANCES.find(p => p.id === id);
        if (product) {
          addToCart(id, size, 1);
          // Directly navigate to checkout for easiest ordering experience
          showToast(`Proceeding to checkout with ${product.name}...`);
          setTimeout(() => {
            window.location.href = 'checkout.html';
          }, 450);
        }
      });
    });

    productsGrid.querySelectorAll('.product-wishlist-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = e.currentTarget.dataset.id;
        toggleWishlist(id);
      });
    });

    // Size chip selection on card
    productsGrid.querySelectorAll('.size-chip').forEach(chip => {
      chip.addEventListener('click', (e) => {
        const prodId = e.currentTarget.dataset.product;
        const size = e.currentTarget.dataset.size;
        const price = e.currentTarget.dataset.price;
        
        state.productCardSizes[prodId] = size;
        
        // Update active class on chips for this card
        const card = e.currentTarget.closest('.product-card');
        if (card) {
          card.querySelectorAll('.size-chip').forEach(c => c.classList.remove('active'));
          chip.classList.add('active');
          const priceEl = card.querySelector(`#card-price-${prodId}`);
          if (priceEl) priceEl.textContent = `€${price}`;
        }
      });
    });

    // Update Mobile Filter Counter
    updateFilterCounts();
  }

  function renderActiveFilterChips() {
    if (!activeFiltersContainer) return;
    const chips = [];

    if (state.filters.family !== 'all') {
      chips.push({
        label: `Family: ${state.filters.family}`,
        clear: () => {
          state.filters.family = 'all';
          document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
          const allPill = document.querySelector('.filter-pill[data-family="all"]');
          if (allPill) allPill.classList.add('active');
          renderProducts();
        }
      });
    }

    if (state.filters.occasion !== 'all') {
      chips.push({
        label: `Occasion: ${state.filters.occasion}`,
        clear: () => {
          state.filters.occasion = 'all';
          const allRadio = document.querySelector('input[name="occasion"][value="all"]');
          if (allRadio) allRadio.checked = true;
          renderProducts();
        }
      });
    }

    if (state.filters.intensity > 0) {
      const labels = ['', 'Light', 'Medium', 'Intense'];
      chips.push({
        label: `Intensity: ${labels[state.filters.intensity]}`,
        clear: () => {
          state.filters.intensity = 0;
          if (intensitySlider) intensitySlider.value = 0;
          intensityLabels.forEach(l => l.classList.remove('active'));
          renderProducts();
        }
      });
    }

    if (state.filters.search) {
      chips.push({
        label: `Search: "${state.filters.search}"`,
        clear: () => {
          state.filters.search = '';
          renderProducts();
        }
      });
    }

    if (chips.length === 0) {
      activeFiltersContainer.innerHTML = '';
      return;
    }

    activeFiltersContainer.innerHTML = chips.map((c, i) => `
      <span class="filter-chip-tag">
        ${c.label}
        <button type="button" data-chip-idx="${i}" aria-label="Remove Filter">×</button>
      </span>
    `).join('') + `
      <button type="button" id="clear-all-chips-btn" style="font-size: 0.75rem; text-decoration: underline; color: var(--text-secondary); margin-left: 0.5rem;">
        Clear All
      </button>
    `;

    activeFiltersContainer.querySelectorAll('button[data-chip-idx]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.currentTarget.dataset.chipIdx);
        if (chips[idx]) chips[idx].clear();
      });
    });

    const clearAllBtn = document.getElementById('clear-all-chips-btn');
    if (clearAllBtn) clearAllBtn.addEventListener('click', resetFilters);
  }

  function updateFilterCounts() {
    let count = 0;
    if (state.filters.family !== 'all') count++;
    if (state.filters.occasion !== 'all') count++;
    if (state.filters.intensity !== 0) count++;
    if (mobileFilterCount) {
      mobileFilterCount.textContent = count;
      mobileFilterCount.style.display = count > 0 ? 'inline-block' : 'none';
    }
  }

  function resetFilters() {
    state.filters.family = 'all';
    state.filters.occasion = 'all';
    state.filters.intensity = 0;
    state.filters.search = '';

    // Reset UI elements
    document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
    const allPill = document.querySelector('.filter-pill[data-family="all"]');
    if (allPill) allPill.classList.add('active');

    const allOccasionRadio = document.querySelector('input[name="occasion"][value="all"]');
    if (allOccasionRadio) allOccasionRadio.checked = true;

    if (intensitySlider) intensitySlider.value = 0;
    intensityLabels.forEach(label => label.classList.remove('active'));

    renderProducts();
  }

  // --- Sort Select Dropdown ---
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      state.filters.sortBy = e.target.value;
      renderProducts();
    });
  }

  // --- Grid View Columns Toggle ---
  viewToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      viewToggleBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cols = parseInt(btn.dataset.cols);
      state.filters.viewColumns = cols;
      if (productsGrid) {
        if (cols === 3) {
          productsGrid.style.gridTemplateColumns = 'repeat(3, 1fr)';
        } else {
          productsGrid.style.gridTemplateColumns = '';
        }
      }
    });
  });

  // --- Scent Family Filter Pills ---
  document.querySelectorAll('.filter-pill').forEach(pill => {
    pill.addEventListener('click', (e) => {
      const family = e.currentTarget.dataset.family;
      document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
      e.currentTarget.classList.add('active');
      state.filters.family = family;
      renderProducts();
    });
  });

  // --- Occasion Radio Buttons ---
  document.querySelectorAll('input[name="occasion"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      state.filters.occasion = e.target.value;
      renderProducts();
    });
  });

  // --- Intensity Slider ---
  if (intensitySlider) {
    intensitySlider.addEventListener('input', (e) => {
      const val = parseInt(e.target.value);
      state.filters.intensity = val;
      
      intensityLabels.forEach(label => {
        const labelVal = parseInt(label.dataset.intensity);
        if (labelVal === val) {
          label.classList.add('active');
        } else {
          label.classList.remove('active');
        }
      });

      renderProducts();
    });
  }

  // --- Hero Signature Note Chips ---
  document.querySelectorAll('.hero-note-chip').forEach(chip => {
    chip.addEventListener('click', (e) => {
      const note = e.currentTarget.dataset.filterNote;
      if (!note) return;
      
      // Set search filter to this note
      state.filters.search = note;
      if (searchInputField) searchInputField.value = note;
      
      // Update UI & catalog
      renderProducts();
      showToast(`Showing scents containing ${note}`);
      
      // Smooth scroll to catalog
      const catalogSection = document.getElementById('fragrance-catalog');
      if (catalogSection) {
        catalogSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // View All Fragrances Button
  if (viewAllBtn) {
    viewAllBtn.addEventListener('click', () => {
      resetFilters();
      showToast('Displaying all fragrances');
    });
  }

  // --- Quick View Modal ---
  function openQuickView(productId) {
    const product = window.FRAGRANCES.find(p => p.id === productId);
    if (!product || !quickViewContent) return;

    state.activeQuickViewId = productId;
    let selectedSize = '50ml';
    let currentPrice = product.price;

    quickViewContent.innerHTML = `
      <div class="quick-view-image">
        <img src="${product.image}" alt="${product.name}" id="qv-main-img" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1000&auto=format&fit=crop';">
      </div>
      <div class="quick-view-body">
        <span style="font-size: 0.75rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--accent-gold); margin-bottom: 0.25rem;">${product.family} • Extrait de Parfum (28%)</span>
        <h2 class="quick-view-title">${product.name}</h2>
        <p class="quick-view-subtitle">${product.subtitle}</p>
        <div class="quick-view-price" id="qv-price">${product.formattedPrice}</div>
        
        <p style="font-size: 0.9rem; line-height: 1.6; color: var(--text-secondary); margin-bottom: 1.25rem;">
          ${product.description}
        </p>

        <div class="notes-pyramid">
          <div class="pyramid-level">
            <span class="pyramid-label">Top:</span>
            <span class="pyramid-notes">${product.notes.top.join(', ')}</span>
          </div>
          <div class="pyramid-level">
            <span class="pyramid-label">Heart:</span>
            <span class="pyramid-notes">${product.notes.heart.join(', ')}</span>
          </div>
          <div class="pyramid-level">
            <span class="pyramid-label">Base:</span>
            <span class="pyramid-notes">${product.notes.base.join(', ')}</span>
          </div>
        </div>

        <div style="display: flex; gap: 0.75rem; margin-bottom: 1.5rem;">
          ${product.sizes.map((s, i) => `
            <button type="button" class="btn-outline qv-size-btn ${i === 0 ? 'active' : ''}" data-size="${s.ml}ml" data-price="${s.price}" style="flex: 1; padding: 0.65rem 0.5rem; ${i === 0 ? 'background-color: var(--text-primary); color: #FFF;' : ''}">
              ${s.ml}ml • €${s.price}
            </button>
          `).join('')}
        </div>

        <div style="display: flex; gap: 0.75rem;">
          <button type="button" class="btn-checkout" id="qv-add-cart-btn" style="flex: 2;">
            Add to Bag — <span id="qv-btn-price">€${currentPrice}</span>
          </button>
          <a href="product.html?id=${product.id}" class="btn-outline" style="flex: 1; text-align: center;">
            Full Details
          </a>
        </div>
      </div>
    `;

    // Handle size change inside quickview
    const sizeBtns = quickViewContent.querySelectorAll('.qv-size-btn');
    const priceEl = document.getElementById('qv-price');
    const btnPriceEl = document.getElementById('qv-btn-price');

    sizeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        sizeBtns.forEach(b => {
          b.style.backgroundColor = 'transparent';
          b.style.color = 'var(--text-primary)';
        });
        btn.style.backgroundColor = 'var(--text-primary)';
        btn.style.color = '#FFFFFF';
        selectedSize = btn.dataset.size;
        currentPrice = btn.dataset.price;
        if (priceEl) priceEl.textContent = `€${currentPrice}`;
        if (btnPriceEl) btnPriceEl.textContent = `€${currentPrice}`;
      });
    });

    const addBtn = document.getElementById('qv-add-cart-btn');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        addToCart(productId, selectedSize, 1);
        closeQuickView();
      });
    }

    if (quickViewOverlay) quickViewOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeQuickView() {
    if (quickViewOverlay) quickViewOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (quickViewCloseBtn) quickViewCloseBtn.addEventListener('click', closeQuickView);
  if (quickViewOverlay) {
    quickViewOverlay.addEventListener('click', (e) => {
      if (e.target === quickViewOverlay) closeQuickView();
    });
  }

  // --- Search Overlay ---
  function openSearch() {
    if (searchOverlay) {
      searchOverlay.classList.add('open');
      if (searchInputField) {
        searchInputField.value = '';
        setTimeout(() => searchInputField.focus(), 100);
      }
      renderSearchResults('');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeSearch() {
    if (searchOverlay) searchOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  function renderSearchResults(query) {
    if (!searchResultsGrid) return;
    const q = query.trim().toLowerCase();
    
    if (!q) {
      searchResultsGrid.innerHTML = `
        <div style="grid-column: 1/-1; color: var(--text-secondary); font-size: 0.9rem;">
          <p style="margin-bottom: 0.75rem; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.1em; color: var(--text-muted);">Trending Fragrances</p>
          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
            <button type="button" class="search-tag-btn filter-pill" data-query="Averon">Averon</button>
            <button type="button" class="search-tag-btn filter-pill" data-query="Lumera">Lumera</button>
            <button type="button" class="search-tag-btn filter-pill" data-query="Vetiver">Vetiver</button>
            <button type="button" class="search-tag-btn filter-pill" data-query="Jasmine">Jasmine</button>
            <button type="button" class="search-tag-btn filter-pill" data-query="Sandalwood">Sandalwood</button>
          </div>
        </div>
      `;
      searchResultsGrid.querySelectorAll('.search-tag-btn').forEach(tag => {
        tag.addEventListener('click', () => {
          if (searchInputField) {
            searchInputField.value = tag.dataset.query;
            renderSearchResults(tag.dataset.query);
          }
        });
      });
      return;
    }

    const matches = window.FRAGRANCES.filter(p => {
      return p.name.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q) ||
        p.family.toLowerCase().includes(q) ||
        [...(p.notes.top || []), ...(p.notes.heart || []), ...(p.notes.base || [])].some(n => n.toLowerCase().includes(q));
    });

    if (matches.length === 0) {
      searchResultsGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 3rem 0; color: var(--text-muted);">
          <p style="font-family: var(--font-serif); font-size: 1.25rem;">No results found for "${query}"</p>
        </div>
      `;
      return;
    }

    searchResultsGrid.innerHTML = matches.map(p => `
      <div class="product-card" style="margin-bottom: 1rem;">
        <div class="product-image-box" style="padding: 1.5rem;">
          <img src="${p.image}" alt="${p.name}" class="product-img">
        </div>
        <h4 class="product-title" style="font-size: 1.15rem;"><a href="product.html?id=${p.id}">${p.name}</a></h4>
        <p class="product-desc" style="font-size: 0.8rem;">${p.subtitle}</p>
        <div class="product-price">${p.formattedPrice}</div>
      </div>
    `).join('');
  }

  if (searchTriggerBtn) searchTriggerBtn.addEventListener('click', openSearch);
  if (searchCloseBtn) searchCloseBtn.addEventListener('click', closeSearch);
  if (searchInputField) {
    searchInputField.addEventListener('input', (e) => {
      renderSearchResults(e.target.value);
    });
  }

  // --- Mobile Navigation ---
  function openMobileNav() {
    if (mobileNavOverlay) mobileNavOverlay.classList.add('open');
    if (mobileNavDrawer) mobileNavDrawer.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileNav() {
    if (mobileNavOverlay) mobileNavOverlay.classList.remove('open');
    if (mobileNavDrawer) mobileNavDrawer.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', openMobileNav);
  if (mobileNavCloseBtn) mobileNavCloseBtn.addEventListener('click', closeMobileNav);
  if (mobileNavOverlay) {
    mobileNavOverlay.addEventListener('click', (e) => {
      if (e.target === mobileNavOverlay) closeMobileNav();
    });
  }

  // Mobile Filter Drawer Toggle
  if (mobileFilterTrigger) {
    mobileFilterTrigger.addEventListener('click', () => {
      const sidebar = document.querySelector('.filters-sidebar');
      if (sidebar) {
        const isShown = sidebar.style.display === 'block';
        sidebar.style.display = isShown ? 'none' : 'block';
        mobileFilterTrigger.querySelector('span').textContent = isShown ? 'Show Filters' : 'Hide Filters';
      }
    });
  }

  // --- Dedicated Quick / Express Order Section Below Products List ---
  function initQuickOrderSection() {
    const fragranceSelect = document.getElementById('direct-fragrance-select');
    const sizeOptionBtns = document.querySelectorAll('#direct-size-options .order-size-btn');
    const qtyValEl = document.getElementById('direct-qty-val');
    const qtyMinusBtn = document.getElementById('direct-qty-minus');
    const qtyPlusBtn = document.getElementById('direct-qty-plus');
    
    const previewImg = document.getElementById('direct-preview-img');
    const previewName = document.getElementById('direct-preview-name');
    const previewSpec = document.getElementById('direct-preview-spec');
    const unitPriceEl = document.getElementById('direct-unit-price');
    const totalPriceEl = document.getElementById('direct-total-price');
    const orderActionBtn = document.getElementById('btn-direct-order-action');
    const orderBtnText = document.getElementById('btn-direct-order-text');

    if (!fragranceSelect || !orderActionBtn) return;

    let selectedFragranceId = window.FRAGRANCES && window.FRAGRANCES[0] ? window.FRAGRANCES[0].id : 'averon';
    let selectedSize = '50ml';
    let selectedQty = 1;

    // Populate dropdown with all fragrances
    if (window.FRAGRANCES) {
      fragranceSelect.innerHTML = window.FRAGRANCES.map(f => `
        <option value="${f.id}">
          ${f.name} — ${f.subtitle} (${f.formattedPrice})
        </option>
      `).join('');
    }

    function updateOrderCard() {
      const product = window.FRAGRANCES ? window.FRAGRANCES.find(p => p.id === selectedFragranceId) : null;
      if (!product) return;

      const sizeNum = parseInt(selectedSize);
      const sizeObj = product.sizes ? product.sizes.find(s => s.ml === sizeNum) : null;
      const unitPrice = sizeObj ? sizeObj.price : product.price;
      const totalCost = unitPrice * selectedQty;

      if (previewImg) previewImg.src = product.image;
      if (previewName) previewName.textContent = product.name;
      if (previewSpec) previewSpec.textContent = `${product.family} • Extrait de Parfum • ${selectedSize}`;
      if (unitPriceEl) unitPriceEl.textContent = `€${unitPrice}`;
      if (totalPriceEl) totalPriceEl.textContent = `€${totalCost}`;
      if (qtyValEl) qtyValEl.textContent = selectedQty;
      if (orderBtnText) orderBtnText.textContent = `Place Order Now • €${totalCost}`;
    }

    fragranceSelect.addEventListener('change', (e) => {
      selectedFragranceId = e.target.value;
      updateOrderCard();
    });

    sizeOptionBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        sizeOptionBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedSize = btn.dataset.size;
        updateOrderCard();
      });
    });

    if (qtyMinusBtn) {
      qtyMinusBtn.addEventListener('click', () => {
        if (selectedQty > 1) {
          selectedQty--;
          updateOrderCard();
        }
      });
    }

    if (qtyPlusBtn) {
      qtyPlusBtn.addEventListener('click', () => {
        if (selectedQty < 10) {
          selectedQty++;
          updateOrderCard();
        }
      });
    }

    // Direct Instant Order Action: Adds item & navigates to checkout for immediate completion
    orderActionBtn.addEventListener('click', () => {
      const product = window.FRAGRANCES ? window.FRAGRANCES.find(p => p.id === selectedFragranceId) : null;
      if (!product) return;

      addToCart(selectedFragranceId, selectedSize, selectedQty);
      showToast(`Added ${selectedQty}x ${product.name} (${selectedSize}) — Proceeding to checkout...`);
      
      setTimeout(() => {
        window.location.href = 'checkout.html';
      }, 500);
    });

    // Initial update
    updateOrderCard();
  }

  // --- Newsletter Form Submission ---
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = newsletterForm.querySelector('input[type="email"]');
      if (emailInput && emailInput.value) {
        showToast('Thank you for subscribing to RG Shop Olfactory Gazette');
        emailInput.value = '';
        const feedback = document.getElementById('newsletter-feedback');
        if (feedback) {
          feedback.style.display = 'block';
          setTimeout(() => feedback.style.display = 'none', 4000);
        }
      }
    });
  }

  // Initial Render & Setup
  updateCartUI();
  updateWishlistUI();
  renderProducts();
  initQuickOrderSection();

  // Escape key handler for drawers and modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeCart();
      closeWishlist();
      closeSearch();
      closeQuickView();
      closeMobileNav();
    }
  });
});
