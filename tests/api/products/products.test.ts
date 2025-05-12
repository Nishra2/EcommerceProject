// tests/api/products/products.test.ts
import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';
import { server } from '../../mocks/server';
import { http } from 'msw';


beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Products API', () => {
  it('fetches all products', async () => {
   
    const response = await fetch('/api/products');
    const data = await response.json();
    
   
    expect(response.status).toBe(200);
    expect(data).toHaveLength(2);
    expect(data[0].name).toBe('Product 1');
    expect(data[1].name).toBe('Product 2');
  });
  
  it('filters products by isFeatured parameter', async () => {
   
    const response = await fetch('/api/products?isFeatured=true');
    const data = await response.json();
    
    
    expect(response.status).toBe(200);
    expect(data).toHaveLength(1);
    expect(data[0].name).toBe('Product 1');
    expect(data[0].isFeatured).toBe(true);
  });
  
  it('handles API errors', async () => {
  
    server.use(
      http.get('/api/products', () => {
        return new Response(JSON.stringify({ error: 'Failed to fetch products' }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json'
          }
        });
      })
    );
    
    
    const response = await fetch('/api/products');
    const data = await response.json();
    
   
    expect(response.status).toBe(500);
    expect(data.error).toBe('Failed to fetch products');
  });
});