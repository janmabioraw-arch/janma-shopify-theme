/* Janma Theme JS — v2 animated
   Vanilla, no deps. Hooks: scroll progress, header blur, parallax blobs,
   tilt cards, magnetic CTAs, marquee duplication, reveal-on-scroll,
   AJAX cart drawer, variant picker, quantity steppers.
*/

(function () {
  'use strict';

  /* ---------- Scroll progress bar ---------- */
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  document.body.appendChild(progressBar);
  const onScroll = () => {
    const h = document.documentElement;
    const scrolled = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
    progressBar.style.width = Math.max(0, Math.min(100, scrolled)) + '%';
    const header = document.querySelector('.site-header');
    if (header) header.classList.toggle('is-scrolled', h.scrollTop > 12);
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav ---------- */
  const mobileToggles = document.querySelectorAll('[data-mobile-toggle]');
  const mobileNav = document.querySelector('[data-mobile-nav]');
  mobileToggles.forEach((t) =>
    t.addEventListener('click', () => {
      if (!mobileNav) return;
      mobileNav.classList.toggle('is-open');
      document.body.style.overflow = mobileNav.classList.contains('is-open') ? 'hidden' : '';
    })
  );

  /* ---------- Reveal on scroll (single + staggered) ---------- */
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -80px 0px' }
    );
    document.querySelectorAll('[data-reveal], [data-reveal-stagger]').forEach((el) => io.observe(el));
  } else {
    document.querySelectorAll('[data-reveal], [data-reveal-stagger]').forEach((el) => el.classList.add('is-visible'));
  }

  /* ---------- Marquee: duplicate inner so it scrolls seamlessly ---------- */
  document.querySelectorAll('.trust-marquee').forEach((m) => {
    const html = m.innerHTML;
    m.innerHTML = html + html;
  });

  /* ---------- Parallax blobs in hero ---------- */
  const hero = document.querySelector('.hero');
  if (hero && window.matchMedia('(min-width: 900px)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const blobs = hero.querySelectorAll('.hero__blob');
    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      blobs.forEach((b, i) => {
        const depth = (i + 1) * 18;
        b.style.transform = `translate(${x * depth}px, ${y * depth}px)`;
      });
      const img = hero.querySelector('.hero__image');
      if (img) img.style.transform = `perspective(1200px) rotateY(${-x * 4}deg) rotateX(${y * 4}deg)`;
    });
    hero.addEventListener('mouseleave', () => {
      blobs.forEach((b) => (b.style.transform = ''));
      const img = hero.querySelector('.hero__image');
      if (img) img.style.transform = '';
    });
  }

  /* ---------- Category tile cursor halo ---------- */
  document.querySelectorAll('.category-tile, .btn').forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', ((e.clientX - r.left) / r.width) * 100 + '%');
      el.style.setProperty('--my', ((e.clientY - r.top) / r.height) * 100 + '%');
    });
  });

  /* ---------- Magnetic CTA buttons ---------- */
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.magnetic').forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        btn.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  /* ---------- Tilt on hover for product cards ---------- */
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && window.matchMedia('(min-width: 900px)').matches) {
    document.querySelectorAll('.product-card').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(900px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg) translateY(-8px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  /* ---------- Product gallery thumbs ---------- */
  document.querySelectorAll('[data-gallery]').forEach((gallery) => {
    const main = gallery.querySelector('[data-gallery-main]');
    const thumbs = gallery.querySelectorAll('[data-gallery-thumb]');
    thumbs.forEach((btn) => {
      btn.addEventListener('click', () => {
        const src = btn.dataset.src;
        const alt = btn.dataset.alt || '';
        if (main && src) {
          main.innerHTML = `<img src="${src}" alt="${alt}" loading="lazy">`;
          main.style.animation = 'fadeIn 350ms ease';
          setTimeout(() => (main.style.animation = ''), 400);
        }
        thumbs.forEach((t) => t.classList.remove('is-active'));
        btn.classList.add('is-active');
      });
    });
  });

  /* ---------- Quantity stepper ---------- */
  document.querySelectorAll('[data-qty]').forEach((wrap) => {
    const input = wrap.querySelector('input[type="number"]');
    if (!input) return;
    wrap.querySelectorAll('[data-qty-step]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const step = parseInt(btn.dataset.qtyStep, 10) || 1;
        const min = parseInt(input.min || '1', 10);
        const next = Math.max(min, (parseInt(input.value, 10) || min) + step);
        input.value = next;
        input.dispatchEvent(new Event('change', { bubbles: true }));
      });
    });
  });

  /* ---------- Cart drawer ---------- */
  const drawer = document.getElementById('CartDrawer');
  const openCart = () => {
    if (!drawer) return;
    refreshCart();
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };
  const closeCart = () => {
    if (!drawer) return;
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };
  document.querySelectorAll('[data-cart-toggle]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openCart();
    });
  });
  document.querySelectorAll('[data-cart-close]').forEach((btn) => btn.addEventListener('click', closeCart));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeCart();
  });

  function formatMoney(cents) {
    return 'Rs. ' + (cents / 100).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  function refreshCart() {
    return fetch('/cart.js', { headers: { Accept: 'application/json' } })
      .then((r) => r.json())
      .then((cart) => {
        renderCart(cart);
        updateCartCount(cart.item_count);
        return cart;
      })
      .catch(() => {});
  }

  function updateCartCount(count) {
    document.querySelectorAll('[data-cart-count]').forEach((el) => {
      el.textContent = count;
      el.style.display = count > 0 ? '' : 'none';
    });
  }

  function escapeHTML(str) {
    return String(str || '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  function renderCart(cart) {
    const body = document.querySelector('[data-cart-body]');
    const footer = document.querySelector('[data-cart-footer]');
    const subtotalEl = document.querySelector('[data-cart-subtotal]');
    if (!body) return;

    if (!cart.items || cart.items.length === 0) {
      body.innerHTML = '<p class="cart-drawer__empty">Your basket awaits its first little treasure.</p>';
      if (footer) footer.hidden = true;
      return;
    }

    body.innerHTML = cart.items
      .map(
        (item) => `
      <div class="cart-item" data-cart-line="${item.key}">
        <div class="cart-item__image">
          ${item.image ? `<img src="${item.image}" alt="${escapeHTML(item.product_title)}">` : ''}
        </div>
        <div>
          <h4 class="cart-item__title">${escapeHTML(item.product_title)}</h4>
          ${item.variant_title && item.variant_title !== 'Default Title' ? `<p class="cart-item__variant">${escapeHTML(item.variant_title)}</p>` : ''}
          <div class="qty-stepper" data-qty>
            <button type="button" data-qty-step="-1" data-cart-update="${item.key}" data-delta="-1" aria-label="Decrease">−</button>
            <input type="number" min="0" value="${item.quantity}" data-cart-qty="${item.key}">
            <button type="button" data-qty-step="1" data-cart-update="${item.key}" data-delta="1" aria-label="Increase">+</button>
          </div>
        </div>
        <div style="text-align:right">
          <strong>${formatMoney(item.final_line_price)}</strong>
          <br>
          <button type="button" class="cart-item__remove" data-cart-remove="${item.key}">Remove</button>
        </div>
      </div>
    `
      )
      .join('');

    if (footer) footer.hidden = false;
    if (subtotalEl) subtotalEl.textContent = formatMoney(cart.total_price);

    body.querySelectorAll('[data-cart-update]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const key = btn.dataset.cartUpdate;
        const delta = parseInt(btn.dataset.delta, 10);
        const line = cart.items.find((i) => i.key === key);
        if (!line) return;
        updateLine(key, Math.max(0, line.quantity + delta));
      });
    });
    body.querySelectorAll('[data-cart-remove]').forEach((btn) =>
      btn.addEventListener('click', () => updateLine(btn.dataset.cartRemove, 0))
    );
  }

  function updateLine(key, quantity) {
    return fetch('/cart/change.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ id: key, quantity })
    })
      .then((r) => r.json())
      .then((cart) => {
        renderCart(cart);
        updateCartCount(cart.item_count);
      });
  }

  /* ---------- Product form add-to-cart ---------- */
  document.querySelectorAll('[data-product-form]').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('[type="submit"]');
      const label = btn ? btn.querySelector('.btn__label') : null;
      const original = label ? label.textContent : '';
      if (btn) btn.disabled = true;
      if (label) label.textContent = 'Adding…';
      const formData = new FormData(form);
      fetch('/cart/add.js', { method: 'POST', headers: { Accept: 'application/json' }, body: formData })
        .then((r) => r.json())
        .then(() => refreshCart())
        .then(() => openCart())
        .catch(() => (window.location.href = '/cart'))
        .finally(() => {
          if (btn) btn.disabled = false;
          if (label) label.textContent = original;
        });
    });
  });

  /* ---------- Variant picker (reads product JSON from <script type="application/json">) ---------- */
  document.querySelectorAll('[data-variant-picker]').forEach((picker) => {
    const jsonEl = document.querySelector('[data-product-json]');
    if (!jsonEl) return;
    let product;
    try {
      product = JSON.parse(jsonEl.textContent);
    } catch (e) {
      return;
    }
    const inputs = picker.querySelectorAll('input[type="radio"]');
    const variantIdInput = document.querySelector('[data-variant-id]');
    const priceEl = document.querySelector('[data-variant-price]');
    const buyBtn = document.querySelector('[data-buy-button]');
    const buyLabel = buyBtn ? buyBtn.querySelector('.btn__label') : null;

    function selected() {
      const opts = [];
      product.options.forEach((_, idx) => {
        const checked = picker.querySelector('input[name="option' + (idx + 1) + '"]:checked');
        if (checked) opts.push(checked.value);
      });
      return opts;
    }

    function update() {
      const sel = selected();
      const variant = product.variants.find((v) => v.options.every((o, i) => o === sel[i]));
      if (!variant) return;
      if (variantIdInput) variantIdInput.value = variant.id;
      if (priceEl) priceEl.textContent = formatMoney(variant.price);
      if (buyBtn) buyBtn.disabled = !variant.available;
      if (buyLabel) buyLabel.textContent = variant.available ? 'Add to Cart' : 'Sold Out';
    }
    inputs.forEach((input) => input.addEventListener('change', update));
    update();
  });

  /* ---------- Init: load cart count ---------- */
  refreshCart();
})();
