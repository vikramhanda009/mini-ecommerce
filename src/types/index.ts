export interface Product {
  id: number;
  uid: string;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
  size?: string;
}

export type SortOption = "default" | "price-asc" | "price-desc" | "rating" | "uid";;
