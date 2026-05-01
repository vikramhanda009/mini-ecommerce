import React, { useEffect, useMemo, useRef, useCallback, useState } from "react";
import styled from "styled-components";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import {
  fetchProducts,
  setSearchQuery,
  setSelectedCategory,
  setSelectedSize,
  selectFilteredSortedProducts,
} from "../features/products/productsSlice";
import ProductCard, { ProductCardSkeleton } from "../components/ProductCard";
const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const PAGE_SIZE = 24;

// ─── Styled Components ────────────────────────────────────────────────────────

const PageWrap = styled.div`
  min-height: 100vh;
  background: #f7f4ef;
`;

const Hero = styled.div`
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%);
  padding: 56px 32px 48px;
  text-align: center;
  position: relative;
  overflow: hidden;
  &::after {
    content: "";
    position: absolute;
    bottom: -1px;
    left: 0;
    right: 0;
    height: 40px;
    background: #f7f4ef;
    clip-path: ellipse(55% 100% at 50% 100%);
  }
`;

const HeroTitle = styled.h1`
  font-family: "Playfair Display", Georgia, serif;
  font-size: clamp(32px, 5vw, 60px);
  font-weight: 700;
  color: #fff;
  margin: 0 0 8px;
  letter-spacing: -0.01em;
`;

const HeroSub = styled.p`
  color: rgba(255,255,255,0.55);
  font-size: 15px;
  margin: 0;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

const FiltersBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  padding: 28px 32px 0;
  max-width: 1400px;
  margin: 0 auto;
`;

const SearchInput = styled.input`
  flex: 1;
  min-width: 220px;
  padding: 12px 18px;
  border: 2px solid #e0ddd8;
  border-radius: 12px;
  font-size: 14px;
  background: #fff;
  outline: none;
  transition: border-color 0.2s;
  font-family: inherit;
  &:focus { border-color: #e07b39; }
  &::placeholder { color: #b0aca6; }
`;

const Select = styled.select`
  padding: 12px 18px;
  border: 2px solid #e0ddd8;
  border-radius: 12px;
  font-size: 14px;
  background: #fff;
  outline: none;
  cursor: pointer;
  font-family: inherit;
  transition: border-color 0.2s;
  &:focus { border-color: #e07b39; }
`;

const ResultCount = styled.span`
  font-size: 13px;
  color: #999;
  margin-left: auto;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 24px;
  padding: 28px 32px 60px;
  max-width: 1400px;
  margin: 0 auto;
`;

const ErrorBox = styled.div`
  text-align: center;
  padding: 80px 32px;
  color: #c0392b;
  font-size: 16px;
`;

const RetryBtn = styled.button`
  margin-top: 16px;
  padding: 10px 28px;
  background: #e07b39;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-family: inherit;
`;

const EndMessage = styled.div`
  text-align: center;
  padding: 32px;
  color: #aaa;
  font-size: 14px;
`;

// ─── Component ────────────────────────────────────────────────────────────────

const HomePage: React.FC = () => {
  const dispatch = useAppDispatch();
 const productsState = useAppSelector((state) => state.products);
const { items, loading, error, searchQuery, selectedCategory, selectedSize } = productsState;
const filteredProducts = useAppSelector(selectFilteredSortedProducts);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (items.length === 0) dispatch(fetchProducts());
  }, [dispatch, items.length]);

  // Derive categories
const categories = useMemo(() => {
  return ["", ...new Set(items.map(p => p.category))];
}, [items]);

  const filtered = filteredProducts;


  const visible = filtered.slice(0, visibleCount);

  // Infinite scroll
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && visibleCount < filtered.length) {
        setVisibleCount((c) => c + PAGE_SIZE);
      }
    },
    [visibleCount, filtered.length]
  );

  useEffect(() => {
    const el = loaderRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(handleObserver, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [handleObserver]);

  // Reset visible when filters change
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [searchQuery, selectedCategory, selectedSize]);

  return (
    <PageWrap>
      <Hero>
        <HeroTitle>DRIP SHOP</HeroTitle>
        <HeroSub>Premium styles · {items.length}+ products</HeroSub>
      </Hero>

      <FiltersBar>
        <SearchInput
          placeholder="Search products…"
          value={searchQuery}
          onChange={(e) => dispatch(setSearchQuery(e.target.value))}
        />
        <Select
          value={selectedCategory}
          onChange={(e) => dispatch(setSelectedCategory(e.target.value))}
        >
          <option value="">All Categories</option>
          {categories.filter(Boolean).map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </Select>
        <Select
          value={selectedSize}
          onChange={(e) => dispatch(setSelectedSize(e.target.value))}
        >
          <option value="">All Sizes</option>
          {SIZES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </Select>
        {!loading && (
          <ResultCount>
            {filtered.length} product{filtered.length !== 1 ? "s" : ""}
          </ResultCount>
        )}
      </FiltersBar>

      {error && (
        <ErrorBox>
          <p>⚠️ {error}</p>
          <RetryBtn onClick={() => dispatch(fetchProducts())}>Retry</RetryBtn>
        </ErrorBox>
      )}

      <Grid>
        {loading && items.length === 0
          ? Array.from({ length: 24 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))
          : visible.map((p) => <ProductCard key={p.uid} product={p} />)}
      </Grid>

      {!loading && visible.length < filtered.length && (
        <div ref={loaderRef} style={{ height: 1 }} />
      )}

      {!loading && !error && visible.length >= filtered.length && filtered.length > 0 && (
        <EndMessage>You've seen all {filtered.length} products ✓</EndMessage>
      )}

      {!loading && !error && filtered.length === 0 && items.length > 0 && (
        <EndMessage>No products match your filters.</EndMessage>
      )}
    </PageWrap>
  );
};

export default HomePage;
