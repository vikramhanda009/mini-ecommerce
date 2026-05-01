import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import type { Product } from "../types";
import { useAppSelector } from "../hooks/redux";

// ─── Skeleton shimmer ────────────────────────────────────────────────────────
const shimmer = keyframes`
  0% { background-position: -468px 0; }
  100% { background-position: 468px 0; }
`;

const SkeletonBase = styled.div`
  background: linear-gradient(to right, #f0f0f0 8%, #e0e0e0 18%, #f0f0f0 33%);
  background-size: 800px 104px;
  animation: ${shimmer} 1.5s infinite linear;
  border-radius: 8px;
`;

// ─── Styled Components ────────────────────────────────────────────────────────
const PageWrap = styled.div`
  min-height: 100vh;
  background: #f7f4ef;
`;

const Nav = styled.div`
  padding: 20px 32px;
  background: #1a1a2e;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const BackLink = styled(Link)`
  color: rgba(255,255,255,0.7);
  text-decoration: none;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: color 0.2s;
  &:hover { color: #fff; }
`;

const Brand = styled(Link)`
  font-family: "Playfair Display", Georgia, serif;
  font-size: 20px;
  color: #fff;
  text-decoration: none;
  font-weight: 700;
`;

const Separator = styled.span`
  color: rgba(255,255,255,0.3);
`;

const Content = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 48px 32px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 56px;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 32px;
  }
`;

const ImageCard = styled.div`
  background: #fff;
  border-radius: 24px;
  padding: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 24px rgba(0,0,0,0.07);
  aspect-ratio: 1;
`;

const ProductImage = styled.img`
  max-width: 100%;
  max-height: 420px;
  object-fit: contain;
`;

const InfoSide = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-top: 8px;
`;

const CategoryBadge = styled.span`
  display: inline-block;
  padding: 5px 14px;
  background: #fff3eb;
  color: #e07b39;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  width: fit-content;
`;

const Title = styled.h1`
  font-family: "Playfair Display", Georgia, serif;
  font-size: clamp(22px, 3vw, 34px);
  font-weight: 700;
  color: #1a1a2e;
  margin: 0;
  line-height: 1.3;
`;

const PriceRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const Price = styled.span`
  font-size: 36px;
  font-weight: 800;
  color: #1a1a2e;
`;

const RatingRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #666;
`;

const Stars = styled.span`
  color: #f5a623;
  font-size: 18px;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #e8e5e0;
  margin: 4px 0;
`;

const DescLabel = styled.h3`
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #999;
  margin: 0;
`;

const Description = styled.p`
  font-size: 15px;
  color: #555;
  line-height: 1.7;
  margin: 0;
`;

const AddToCartBtn = styled.button`
  padding: 16px 32px;
  background: #1a1a2e;
  color: #fff;
  border: none;
  border-radius: 14px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
  letter-spacing: 0.04em;
  transition: background 0.2s, transform 0.15s;
  margin-top: 8px;
  &:hover { background: #e07b39; transform: translateY(-2px); }
`;

const ErrorBox = styled.div`
  text-align: center;
  padding: 80px 32px;
  color: #c0392b;
  font-size: 16px;
`;

// Skeleton detail
const SkeletonImage = styled(SkeletonBase)`
  width: 100%;
  aspect-ratio: 1;
  border-radius: 24px;
`;

const SkeletonLine = styled(SkeletonBase)<{ w?: string; h?: string }>`
  width: ${(p) => p.w || "100%"};
  height: ${(p) => p.h || "18px"};
`;

// ─── Component ────────────────────────────────────────────────────────────────

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const cachedItems = useAppSelector((s) => s.products.items);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);

    // Check cache first
    const cached = cachedItems.find((p) => p.id === Number(id));
    if (cached) {
      setProduct(cached);
      setLoading(false);
      return;
    }

    // Fetch from API (FakeStore only for non-dummyjson IDs)
    const numId = Number(id);
    const url =
      numId >= 1000
        ? `https://dummyjson.com/products/${numId - 1000}`
        : `https://fakestoreapi.com/products/${numId}`;

    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error("Product not found");
        return r.json();
      })
      .then((data) => {
        if (numId >= 1000) {
          setProduct({
            id: numId,
            uid: `${numId}-${data.title}`,
            title: data.title,
            price: data.price,
            description: data.description,
            category: data.category,
            image: data.thumbnail,
            rating: { rate: data.rating, count: data.stock },
          });
        } else {
          setProduct(data);
        }
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, [id, cachedItems]);

  const stars =
    "★".repeat(Math.round(product?.rating?.rate || 0)) +
    "☆".repeat(5 - Math.round(product?.rating?.rate || 0));

  return (
    <PageWrap>
      <Nav>
        <Brand to="/">HANDA STORE</Brand>
        <Separator>/</Separator>
        <BackLink to="/">← Back to Products</BackLink>
      </Nav>

      {error && (
        <ErrorBox>
          <p>⚠️ {error}</p>
          <Link to="/" style={{ color: "#e07b39" }}>← Back to products</Link>
        </ErrorBox>
      )}

      {loading && (
        <Content>
          <SkeletonImage />
          <InfoSide>
            <SkeletonLine w="40%" h="22px" />
            <SkeletonLine w="80%" h="34px" />
            <SkeletonLine w="60%" h="34px" />
            <SkeletonLine w="30%" h="22px" />
            <Divider />
            <SkeletonLine w="20%" h="13px" />
            <SkeletonLine />
            <SkeletonLine />
            <SkeletonLine w="85%" />
          </InfoSide>
        </Content>
      )}

      {!loading && product && (
        <Content>
          <ImageCard>
            <ProductImage src={product.image} alt={product.title} />
          </ImageCard>
          <InfoSide>
            <CategoryBadge>{product.category}</CategoryBadge>
            <Title>{product.title}</Title>
            <PriceRow>
              <Price>${product.price.toFixed(2)}</Price>
            </PriceRow>
            <RatingRow>
              <Stars>{stars}</Stars>
              <span>{product.rating?.rate?.toFixed(1)} · {product.rating?.count} reviews</span>
            </RatingRow>
            <Divider />
            <DescLabel>Description</DescLabel>
            <Description>{product.description}</Description>
            <AddToCartBtn>Add to Cart</AddToCartBtn>
          </InfoSide>
        </Content>
      )}
    </PageWrap>
  );
};

export default ProductDetailPage;
