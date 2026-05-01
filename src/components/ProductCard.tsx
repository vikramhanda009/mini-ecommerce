import React from "react";
import { Link } from "react-router-dom";
import type { Product } from "../types";
import styled, { keyframes } from "styled-components";

const shimmer = keyframes`
  0% { background-position: -468px 0; }
  100% { background-position: 468px 0; }
`;

const Card = styled(Link)`
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  transition: transform 0.22s ease, box-shadow 0.22s ease;
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 32px rgba(0,0,0,0.12);
  }
`;

const ImageWrap = styled.div`
  width: 100%;
  aspect-ratio: 1;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  position: relative;
  overflow: hidden;
`;

const Img = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  transition: transform 0.3s ease;
  ${Card}:hover & {
    transform: scale(1.06);
  }
`;

const Body = styled.div`
  padding: 14px 16px 18px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
`;

const Category = styled.span`
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #e07b39;
`;

const Title = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: #1a1a2e;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;
`;

const Description = styled.p`
  font-size: 12px;
  color: #888;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.5;
  flex: 1;
`;

const Price = styled.span`
  font-size: 18px;
  font-weight: 700;
  color: #1a1a2e;
  margin-top: 4px;
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #666;
`;

const Stars = styled.span`
  color: #f5a623;
`;

// Skeleton styles
const SkeletonBase = styled.div`
  background: linear-gradient(to right, #f0f0f0 8%, #e0e0e0 18%, #f0f0f0 33%);
  background-size: 800px 104px;
  animation: ${shimmer} 1.5s infinite linear;
  border-radius: 6px;
`;

const SkeletonCard = styled.div`
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
`;

const SkeletonImage = styled(SkeletonBase)`
  width: 100%;
  aspect-ratio: 1;
  border-radius: 0;
`;

const SkeletonBody = styled.div`
  padding: 14px 16px 18px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const SkeletonLine = styled(SkeletonBase)<{ w?: string; h?: string }>`
  width: ${(p) => p.w || "100%"};
  height: ${(p) => p.h || "14px"};
`;

export function ProductCardSkeleton() {
  return (
    <SkeletonCard>
      <SkeletonImage />
      <SkeletonBody>
        <SkeletonLine w="50%" h="11px" />
        <SkeletonLine w="90%" />
        <SkeletonLine w="70%" />
        <SkeletonLine w="80%" h="12px" />
        <SkeletonLine w="80%" h="12px" />
        <SkeletonLine w="40%" h="20px" />
      </SkeletonBody>
    </SkeletonCard>
  );
}

interface Props {
  product: Product;
}

const ProductCard: React.FC<Props> = ({ product }) => {
  const stars = "★".repeat(Math.round(product.rating?.rate || 0)) +
    "☆".repeat(5 - Math.round(product.rating?.rate || 0));

  return (
    <Card to={`/product/${product.id}`}>
      <ImageWrap>
        <Img src={product.image} alt={product.title} loading="lazy" />
      </ImageWrap>
      <Body>
        <Category>{product.category}</Category>
        <Title>{product.title}</Title>
        <Description>{product.description}</Description>
        <Rating>
          <Stars>{stars}</Stars>
          <span>({product.rating?.count || 0})</span>
        </Rating>
        <Price>${product.price.toFixed(2)}</Price>
      </Body>
    </Card>
  );
};

export default ProductCard;
