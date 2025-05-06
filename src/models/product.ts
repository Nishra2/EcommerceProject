export interface Product {
  id?: number;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  images: string[];
  isFeatured?: boolean;
}
