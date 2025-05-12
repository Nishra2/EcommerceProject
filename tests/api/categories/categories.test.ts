// tests/api/categories/categories.test.ts
import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';
import { server } from '../../mocks/server';

// Set up API testing
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Categories API', () => {
  it('retrieve all categories', async () => {
    
    const response = await fetch('/api/categories');
    const data = await response.json();
    
   
    expect(response.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
    expect(data).toContain('Electronics');
    expect(data).toContain('Clothing');
    expect(data).toContain('Books');
  });
});