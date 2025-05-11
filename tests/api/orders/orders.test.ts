// tests/api/orders/orders.test.ts
import { describe, it, expect, beforeAll, afterEach, afterAll, vi } from 'vitest';
import { server } from '../../mocks/server';
import { http, HttpResponse } from 'msw';

const mockGetServerSession = vi.fn();

vi.mock('next-auth/next', () => ({
  getServerSession: mockGetServerSession
}));

beforeAll(() => {
  server.listen();
  mockGetServerSession.mockReturnValue({
    user: { role: 'ADMIN' }
  });
});

afterEach(() => {
  server.resetHandlers();
  mockGetServerSession.mockReset();
  mockGetServerSession.mockReturnValue({
    user: { role: 'ADMIN' }
  });
});

afterAll(() => server.close());

describe('Orders API', () => {
  it('fetches all orders for admin user', async () => {
    server.use(
      http.get('/api/orders', () => {
        return HttpResponse.json([
          { id: '1', totalAmount: 300, email: 'test@example.com', userId: 1 },
          { id: '2', totalAmount: 500, email: 'test2@example.com', userId: 2 },
        ]);
      })
    );
    
    const response = await fetch('http://localhost:3000/api/orders');
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
    expect(data).toHaveLength(2);
  });
  
  it('returns unauthorized error for non-admin users', async () => {
    mockGetServerSession.mockReturnValueOnce({
      user: { role: 'USER' }
    });
    
    server.use(
      http.get('/api/orders', () => {
        return new HttpResponse(
          JSON.stringify({ message: 'unauthorized user' }),
          { status: 401 }
        );
      })
    );
    
    const response = await fetch('http://localhost:3000/api/orders');
    const data = await response.json();
    
    expect(response.status).toBe(401);
    expect(data.message).toBe('unauthorized user');
  });
});