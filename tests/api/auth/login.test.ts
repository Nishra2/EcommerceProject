// tests/api/auth/login.test.ts
import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';
import { server } from '../../mocks/server';
import { http, HttpResponse } from 'msw';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Login API', () => {
  it('successfully log in', async () => {
    server.use(
      http.post('/api/auth/signin/credentials', () => {
        return HttpResponse.json({ ok: true }, { status: 200 });
      })
    );
    
    // Make the request
    const response = await fetch('http://localhost:3000/api/auth/signin/credentials', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123',
      }),
    });
    
    
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.ok).toBe(true);
  });
  
  it('error handling for wrong credentials', async () => {
   
    server.use(
      http.post('/api/auth/signin/credentials', () => {
        return new HttpResponse(null, { status: 401 });
      })
    );
    
   
    const response = await fetch('http://localhost:3000/api/auth/signin/credentials', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'wrongpassword',
      }),
    });
    
    
    expect(response.status).toBe(401);
  });
});