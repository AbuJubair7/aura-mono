const API_BASE = 'http://localhost:5001/api';

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  thumbnail: string;
  images: string[];
  category: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface PaginatedProducts {
  items: Product[];
  total: number;
  hasMore: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export async function fetchProducts(
  page = 1,
  limit = 10,
  search?: string,
  categorySlug?: string
): Promise<PaginatedProducts> {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (search) params.append('search', search);
  if (categorySlug) params.append('category', categorySlug);

  const res = await fetch(`${API_BASE}/products?${params.toString()}`, {
    // Next.js config to fetch fresh data but optionally cache based on needs
    next: { revalidate: 60 },
  });

  const data = await res.json();
  data.items = data.items.map((p: any) => ({
    ...p,
    price: Number(p.price),
    discountPercentage: Number(p.discountPercentage),
  }));
  return data;
}

export async function fetchProductById(id: string): Promise<Product> {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    next: { revalidate: 60 },
  });

  const p = await res.json();
  return {
    ...p,
    price: Number(p.price),
    discountPercentage: Number(p.discountPercentage),
  };
}

export async function fetchCategories(): Promise<Category[]> {
  const res = await fetch(`${API_BASE}/categories`, {
    next: { revalidate: 3600 }, // Categories rarely change
  });

  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
}

// ---------------------------------------------------------------------------
// AUTH API
// ---------------------------------------------------------------------------

export async function login(email: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Login failed');
  }
  return res.json();
}

export async function registerUser(email: string, password: string, firstName: string, lastName: string) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, firstName, lastName }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Registration failed');
  }
  return res.json();
}

// ---------------------------------------------------------------------------
// CART API
// ---------------------------------------------------------------------------

export interface CartItem {
  id: string; // The cart item ID (not the product ID)
  product: Product;
  quantity: number;
}

export interface Cart {
  id: string;
  items: CartItem[];
}

function getAuthHeaders(token: string) {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
}

export async function fetchCart(token: string): Promise<Cart> {
  const res = await fetch(`${API_BASE}/cart`, {
    headers: getAuthHeaders(token),
  });
  if (!res.ok) throw new Error('Failed to fetch cart');
  return res.json();
}

export async function addToCart(token: string, productId: string, quantity: number) {
  const res = await fetch(`${API_BASE}/cart/items`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify({ productId, quantity }),
  });
  if (!res.ok) throw new Error('Failed to add item to cart');
  return res.json();
}

export async function updateCartItem(token: string, itemId: string, quantity: number) {
  const res = await fetch(`${API_BASE}/cart/items/${itemId}`, {
    method: 'PATCH',
    headers: getAuthHeaders(token),
    body: JSON.stringify({ quantity }),
  });
  if (!res.ok) throw new Error('Failed to update cart item');
  return res.json();
}

export async function removeFromCart(token: string, itemId: string) {
  const res = await fetch(`${API_BASE}/cart/items/${itemId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(token),
  });
  if (!res.ok) throw new Error('Failed to remove cart item');
  return res.json();
}
