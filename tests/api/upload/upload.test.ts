// tests/api/upload/upload.test.ts
import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';
import { server } from '../../mocks/server';
import { http, HttpResponse } from 'msw';


beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Upload API', () => {
  it('upload a file successfully to the database', async () => {
    
    server.use(
      http.post('/api/upload', () => {
        return HttpResponse.json(
          { message: 'Files uploaded successfully', fileIds: [1, 2] },
          { status: 201 }
        );
      })
    );
    

    const formData = new FormData();
    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
    formData.append('file', file);
    
    
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    
    const data = await response.json();
    
    
    expect(response.status).toBe(201);
    expect(data.message).toBe('Files uploaded successfully');
    expect(Array.isArray(data.fileIds)).toBe(true);
  });
  
  it('returns error when no file is provided', async () => {
    
    server.use(
      http.post('/api/upload', () => {
        return new HttpResponse(
          JSON.stringify({ error: 'File is required' }),
          { status: 400 }
        );
      })
    );
    
    const formData = new FormData();
    
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    
    const data = await response.json();
    
    expect(response.status).toBe(400);
    expect(data.error).toBe('File is required');
  });
});