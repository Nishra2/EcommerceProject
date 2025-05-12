// tests/api/checkout/checkout.test.ts
import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';
import { server } from '../../mocks/server';
import { http, HttpResponse } from 'msw';


beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Checkout API', () => {
  it('create a successful checkout', async () => {
    
    const cartItems = [
      { id: '1', name: 'Product 1', price: 100, quantity: 2 },
      { id: '2', name: 'Product 2', price: 200, quantity: 1 },
    ];
    
    
    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cartItems }),
    });
    
    const data = await response.json();
    
    
    expect(response.status).toBe(200);
    expect(data.url).toBe('https://checkout.stripe.com/c/pay/mock-session');
  });
  
  it('error handling when no items are in cart', async () => {
    
    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cartItems: [] }),
    });
    
    const data = await response.json();
    
    
    expect(response.status).toBe(400);
    expect(data.message).toBe('No cart items provided');
  });
  
  it('handle stripe errors', async () => {
    
    server.use(
      http.post('/api/checkout', () => {
        return new HttpResponse(
          JSON.stringify({ error: 'Stripe API Error' }),
          { status: 500 }
        );
      })
    );
    
    
    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cartItems: [{ id: '1', name: 'Product 1', price: 100, quantity: 2 }],
      }),
    });
    
    const data = await response.json();
    
   
    expect(response.status).toBe(500);
    expect(data.error).toBe('Stripe API Error');
  });
});