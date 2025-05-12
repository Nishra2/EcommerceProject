// tests/api/auth/register.test.ts
import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';
import { server } from '../../mocks/server';
import { http, HttpResponse } from 'msw';


beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Register API', () => {
  it('be able to register a new user', async () => {
    
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      }),
    });
    
    const data = await response.json();
    
   
    expect(response.status).toBe(200);
    expect(data.message).toBe('User created successfully');
  });
  
  it('returns error when required fields are missing', async () => {
    
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
       
      }),
    });
    
    const data = await response.json();
    
   
    expect(response.status).toBe(400);
    expect(data.message).toBe('Please provide all the required fields');
  });
  
  it('error handling for existing user', async () => {
    
    server.use(
      http.post('/api/register', () => {
        return new HttpResponse(
          JSON.stringify({ message: 'User with this email already exists' }),
          { status: 400 }
        );
      })
    );
    
    
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'existing@example.com',
        password: 'password123',
      }),
    });
    
    const data = await response.json();
    

    expect(response.status).toBe(400);
    expect(data.message).toBe('User with this email already exists');
  });
});