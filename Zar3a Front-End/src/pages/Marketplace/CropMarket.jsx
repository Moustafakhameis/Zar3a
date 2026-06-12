import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LuSearch, LuShoppingCart, LuPlus, LuChevronLeft, LuChevronRight, LuMapPin, LuStar } from 'react-icons/lu';
import { useCropMarketProductsQuery } from '../../hooks/queries/useMarketplace';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../context/AuthContext';

/* ─── helper ─────────────────────────────────────────────── */
const isProductBoosted = (p) =>
  (p.isBoosted === true || p.isBoosted === 1) &&
  (!p.boostExpiryDate || new Date(p.boostExpiryDate) > new Date());

/* ─── Premium Boost Banner ───────────────────────────────── */
const PremiumBoostBanner = ({ products, onAddToCart }) => {
  const rowRef = useRef(null);
  const scroll = (dir) => {
    rowRef.current?.scrollBy({ left: dir * 340, behavior: 'smooth' });
  };

  if (!products.length) return null;

  return (
    <section className="mb-10">
      {/* Header */}
      <div className="relative mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* animated glow dot */}
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-yellow-400 opacity-75" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-yellow-500" />
          </span>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-yellow-600">
              ⚡ Premium Boost
            </p>
            <h2 className="text-2xl font-extrabold text-gray-900">Featured Products</h2>
          </div>
        </div>
        {/* scroll arrows */}
        <div className="flex gap-2">
          <button
            onClick={() => scroll(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-yellow-300 bg-white text-yellow-700 shadow-sm transition hover:bg-yellow-50"
          >
            <LuChevronLeft size={18} />
          </button>
          <button
            onClick={() => scroll(1)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-yellow-300 bg-white text-yellow-700 shadow-sm transition hover:bg-yellow-50"
          >
            <LuChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Gold gradient wrapper */}
      <div
        className="relative rounded-3xl p-[2px]"
        style={{
          background: 'linear-gradient(135deg,#f59e0b 0%,#fbbf24 30%,#d97706 60%,#f59e0b 100%)',
          boxShadow: '0 8px 40px 0 rgba(245,158,11,0.25)',
        }}
      >
        {/* Inner background */}
        <div
          className="relative overflow-hidden rounded-[22px]"
          style={{
            background: 'linear-gradient(135deg,#1c1008 0%,#2d1f06 40%,#1a1200 100%)',
          }}
        >
          {/* Ambient glow orbs */}
          <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-yellow-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-amber-400/10 blur-3xl" />

          {/* Label ribbon */}
          <div className="flex items-center gap-2 border-b border-yellow-900/40 px-6 py-3">
            <LuStar size={14} className="text-yellow-400" />
            <span className="text-xs font-semibold uppercase tracking-widest text-yellow-400">
              Sponsored &amp; Featured Listings
            </span>
            <LuStar size={14} className="text-yellow-400" />
          </div>

          {/* Scrollable row */}
          <div
            ref={rowRef}
            className="flex gap-5 overflow-x-auto px-6 py-5 scrollbar-hide"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {products.map((product) => (
              <div
                key={product.id}
                style={{ scrollSnapAlign: 'start', minWidth: '300px', maxWidth: '300px' }}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-yellow-800/40 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:border-yellow-500/60 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(245,158,11,0.2)]"
              >
                {/* Shimmer bar on hover */}
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                {/* Image */}
                {product.imageUrl ? (
                  <div className="relative h-44 w-full overflow-hidden">
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    {/* Badge overlay */}
                    <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-yellow-400 px-3 py-1 text-xs font-bold text-yellow-900 shadow">
                      ⚡ Boosted
                    </span>
                    <span className="absolute right-3 top-3 rounded-full bg-black/50 px-2 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                      {product.category || 'Crop'}
                    </span>
                  </div>
                ) : (
                  <div className="flex h-44 w-full items-center justify-center bg-yellow-900/20">
                    <span className="text-4xl">🌾</span>
                  </div>
                )}

                {/* Content */}
                <div className="flex flex-1 flex-col gap-3 p-4">
                  <div>
                    <h3 className="text-base font-bold leading-snug text-white line-clamp-1">
                      {product.title}
                    </h3>
                    {product.region && (
                      <p className="mt-1 flex items-center gap-1 text-xs text-yellow-300/70">
                        <LuMapPin size={11} /> {product.region}
                      </p>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="mt-auto flex items-end justify-between">
                    <div>
                      <p className="text-xl font-extrabold text-yellow-300">
                        EGP {Number(product.price).toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">/{product.unit || 'unit'}</p>
                    </div>
                    <button
                      onClick={() => onAddToCart(product, 'crop')}
                      className="flex items-center gap-1 rounded-xl bg-yellow-400 px-3 py-2 text-xs font-bold text-yellow-900 transition hover:bg-yellow-300 active:scale-95"
                    >
                      <LuPlus size={13} /> Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

/* ─── Main page ──────────────────────────────────────────── */
const CropMarket = () => {
  const { user } = useAuth();
  const { cart, addToCart } = useCart(user?.id);
  const { data: products = [], isLoading: loading } = useCropMarketProductsQuery();
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const boostedProducts = products.filter(isProductBoosted);
  const filtered = products
    .filter(
      (p) =>
        p.title?.toLowerCase().includes(search.toLowerCase()) ||
        p.description?.toLowerCase().includes(search.toLowerCase()),
    )
    .sort((a, b) => {
      const aBoost = isProductBoosted(a);
      const bBoost = isProductBoosted(b);
      if (aBoost && !bBoost) return -1;
      if (!aBoost && bBoost) return 1;
      return 0;
    });

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      {/* Page header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-text-muted">Crop Market</p>
          <h1 className="text-4xl font-bold">Fresh Produce &amp; Farm Goods</h1>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-72">
            <LuSearch className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-disabled" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search crops..."
              className="w-full rounded-3xl border border-border-default bg-surface-card py-3 pl-11 pr-4 text-sm text-text-main shadow-sm outline-none focus:border-emerald-500"
            />
          </div>
          <button
            onClick={() => navigate('/track-orders')}
            className="inline-flex items-center gap-2 rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
          >
            <LuShoppingCart /> View Cart ({cart.length})
          </button>
        </div>
      </div>

      {/* ── Premium Boost Section ── */}
      {!loading && boostedProducts.length > 0 && (
        <PremiumBoostBanner products={boostedProducts} onAddToCart={addToCart} />
      )}

      {/* ── Section divider ── */}
      {!loading && boostedProducts.length > 0 && (
        <div className="mb-8 flex items-center gap-4">
          <div className="h-px flex-1 bg-border-default" />
          <span className="text-xs font-semibold uppercase tracking-widest text-text-muted">
            All Products
          </span>
          <div className="h-px flex-1 bg-border-default" />
        </div>
      )}

      {/* ── Regular grid ── */}
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {loading ? (
          <div className="col-span-full rounded-3xl border border-border-default bg-surface-card p-8 text-center">
            Loading products...
          </div>
        ) : filtered.length === 0 ? (
          <div className="col-span-full rounded-3xl border border-border-default bg-surface-card p-8 text-center">
            No crop products found.
          </div>
        ) : (
          filtered.map((product) => {
            const isBoosted = isProductBoosted(product);
            return (
              <div
                key={product.id}
                className={`rounded-3xl border p-6 shadow-sm transition-all duration-200 ${
                  isBoosted
                    ? 'border-yellow-400 bg-gradient-to-br from-yellow-50 via-white to-amber-50 shadow-yellow-100 shadow-md ring-2 ring-yellow-300'
                    : 'border-border-default bg-surface-card'
                }`}
              >
                {product.imageUrl && (
                  <div className="mb-4 h-40 w-full overflow-hidden rounded-2xl">
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  </div>
                )}

                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h2 className="text-lg font-bold text-text-main leading-snug">{product.title}</h2>
                    <p className="text-xs text-text-muted mt-0.5">{product.category || 'Crop'}</p>
                    {product.region && (
                      <p className="mt-1 flex items-center gap-1 text-xs text-text-muted">
                        <LuMapPin size={11} /> {product.region}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    {isBoosted && (
                      <span className="inline-flex items-center gap-1 rounded-2xl bg-yellow-400 px-2.5 py-0.5 text-xs font-bold text-yellow-900 shadow-sm">
                        ⚡ Boosted
                      </span>
                    )}
                    <span className="rounded-2xl bg-primary-light px-3 py-1 text-xs font-semibold text-emerald-700">
                      Crop
                    </span>
                  </div>
                </div>

                <p className="text-sm text-text-subtle mb-4 line-clamp-2">
                  {product.description || 'No description available.'}
                </p>
                <div className="mb-5 flex items-center justify-between gap-4">
                  <p className="text-2xl font-bold text-text-main">
                    EGP {Number(product.price).toLocaleString()}
                  </p>
                  <p className="text-sm text-text-muted">{product.unit || 'unit'}</p>
                </div>

                <button
                  onClick={() => addToCart(product, 'crop')}
                  className="inline-flex items-center justify-center gap-2 w-full rounded-3xl bg-primary-base px-5 py-3 text-sm font-semibold text-white hover:bg-primary-hover"
                >
                  <LuPlus /> Add to Cart
                </button>

                {user?.role === 'FARMER' && (
                  <button
                    onClick={() => navigate('/marketplace')}
                    className="mt-3 w-full rounded-3xl border border-border-default px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-surface-secondary"
                  >
                    Create Crop Product
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CropMarket;
