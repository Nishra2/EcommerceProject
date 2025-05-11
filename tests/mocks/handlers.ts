// tests/mocks/handlers.ts
import { http, HttpResponse } from 'msw';

export const handlers = [
  // Product API handlers
  http.get('/api/products', ({ request }) => {
    const url = new URL(request.url);
    const isFeatured = url.searchParams.get('isFeatured');
    
    // Mock products data
    const products = [
      { id: '1', name: 'Product 1', price: 100, isFeatured: true },
      { id: '2', name: 'Product 2', price: 200, isFeatured: false },
    ];
    
    if (isFeatured !== null) {
      return HttpResponse.json(
        products.filter(p => String(p.isFeatured) === isFeatured)
      );
    }
    
    return HttpResponse.json(products);
  }),
  
  // Categories API handler
  http.get('/api/categories', () => {
    return HttpResponse.json(['Electronics', 'Clothing', 'Books']);
  }),
  
  // Auth handlers
  http.post('/api/register', async ({ request }) => {
    const body = await request.json() as { name: string; email: string; password: string };
    const { name, email, password } = body;
    
    if (!name || !email || !password) {
      return new HttpResponse(
        JSON.stringify({ message: 'Please provide all the required fields' }),
        { status: 400 }
      );
    }
    
    return HttpResponse.json({ message: 'User created successfully' });
  }),
  
  // Checkout handlers
  http.post('/api/checkout', async ({ request }) => {
    const body = await request.json() as { cartItems: { id: string; quantity: number }[] };
    const { cartItems } = body;
    
    if (!cartItems || cartItems.length === 0) {
      return new HttpResponse(
        JSON.stringify({ message: 'No cart items provided' }),
        { status: 400 }
      );
    }
    
    return HttpResponse.json({ url: 'https://checkout.stripe.com/c/pay/mock-session' });
  }),
  
  // Orders handler
  http.get('/api/orders', () => {
    return HttpResponse.json([
      { id: '1', totalAmount: 300, email: 'test@example.com', userId: 1 },
      { id: '2', totalAmount: 500, email: 'test2@example.com', userId: 2 },
    ]);
  }),

  http.post('/api/auth/callback/credentials', async () => {
    return HttpResponse.json({ ok: true });
  }),
  
  http.post('/api/auth/signin/credentials', async () => {
    return HttpResponse.json({ url: '/api/auth/callback/credentials' });
  }),
];