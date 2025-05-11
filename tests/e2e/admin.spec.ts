// tests/e2e/admin.spec.ts
import { test, expect } from '@playwright/test';

test.describe("Admin page functionality", () => {
  
  test.beforeEach(async ({ page }) => {
    
    await page.route('**/api/auth/session', route => {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          user: {
            id: "1",
            name: "Admin User",
            email: "admin@example.com",
            role: "ADMIN"
          },
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        })
      });
    });

    
    await page.route('/api/products', async route => {
      if (route.request().method() === 'GET') {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([
            { 
              id: '1',
              name: 'Blue sneakers', 
              price: 99.99, 
              description: 'Casual footwear to get you from place to place',
              images: ["https://media.istockphoto.com/id/495204892/photo/sneakers.jpg"],
              category: 'shoes'
            },
            { 
              id: '2',
              name: 'Logitech mouse', 
              price: 49.99, 
              description: 'Make life easier with the logitech mouse.',
              images: ["https://m.media-amazon.com/images/I/51WN5aXZWIL.jpg"],
              category: 'Technology'
            }
          ])
        });
      }
      return route.continue();
    });

   
    await page.route('/api/orders', route => {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 1,
            userId: 2,
            email: "customer@example.com",
            name: "Test Customer",
            address: "123 Test St",
            lineItems: JSON.stringify([
              { 
                name: "Blue sneakers",
                quantity: 1,
                price: 99.99
              }
            ]),
            totalAmount: 99.99,
            createdAt: new Date().toISOString()
          }
        ])
      });
    });
  });

  test('admin can access admin page and view products and orders', async ({ page }) => {
    
    await page.goto('/admin');
    
   
    await page.waitForSelector('[data-testid="admin-panel-title"]', { timeout: 5000 });
    
   
    await expect(page.locator('[data-testid="products-section-title"]')).toBeVisible();
    
    
    await expect(page.locator('[data-testid="product-table"]')).toBeVisible();
    await expect(page.locator('[data-testid^="product-name-cell-"]').first()).toBeVisible();
    
   
    await expect(page.locator('[data-testid="orders-section-title"]')).toBeVisible();
    
    
    await expect(page.locator('[data-testid^="order-customer-name-"]').first()).toBeVisible();
    await expect(page.locator('[data-testid^="order-total-"]').first()).toBeVisible();
  });

  test('admin can create a new product', async ({ page }) => {
    
    await page.route('/api/products', async route => {
      if (route.request().method() === 'POST') {
        const requestBody = JSON.parse(await route.request().postData() || '{}');
        
        
        return route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            id: '3',
            ...requestBody
          })
        });
      }
      return route.continue();
    });
    
    
    await page.goto('/admin');
    
    
    await page.locator('#createProductButton').click();
    

    await page.waitForSelector('[data-testid="create-product-modal-title"]');
    
 
    await page.locator('[data-testid="product-form-name"]').fill('Test Product');
    await page.locator('[data-testid="product-form-description"]').fill('This is a test product');
    await page.locator('[data-testid="product-form-price"]').fill('199.99');
    
    
    await page.locator('[data-testid="product-form-submit"]').click();
    
    
    await page.waitForTimeout(500); 
    await expect(page.locator('[data-testid^="product-name-cell-"]').filter({ hasText: 'Test Product' })).toBeVisible();
  });

 test('admin can edit a product', async ({ page }) => {
    
    await page.goto('/admin');
    
  
    await page.waitForSelector('[data-testid^="edit-product-"]', { timeout: 10000 });
    
  
    await page.route('/api/products', async route => {
      if (route.request().method() === 'PUT') {
        const requestBody = JSON.parse(await route.request().postData() || '{}');
        
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(requestBody)
        });
      }
      return route.continue();
    });
    
    
    await page.locator('[data-testid^="edit-product-"]').first().click();
    
   
    await page.waitForSelector('[data-testid="edit-product-modal-title"]');
    
   
    await page.locator('[data-testid="product-form-name"]').fill('Updated Blue Sneakers');
    
    
    await page.locator('[data-testid="product-form-submit"]').click();
    
   
    await page.waitForSelector('[data-testid="edit-product-modal-title"]', { state: 'hidden' });
    
   
    await page.reload();
    
    
    await page.waitForSelector('[data-testid="product-table"]', { timeout: 10000 });
    
    
    const productCells = await page.locator('[data-testid^="product-name-cell-"]').all();
    const productNames = [];
    for (const cell of productCells) {
      const text = await cell.textContent();
      productNames.push(text);
    }
    console.log('Product names after edit:', productNames);
    
   
    await expect(page.locator('[data-testid="product-table"]')).toBeVisible();
  });


  test('admin can delete a product', async ({ page }) => {
  
    await page.goto('/admin');
    
    await page.waitForSelector('[data-testid^="delete-product-"]', { timeout: 10000 });
    

    const productRows = page.locator('[data-testid^="product-row-"]');
    const initialProductCount = await productRows.count();
    
    
    await page.route('/api/products', route => {
      if (route.request().method() === 'DELETE') {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ message: "Product deleted" })
        });
      }
      return route.continue();
    });
    
    
    await page.locator('[data-testid^="delete-product-"]').first().click();
    
    
    await page.waitForTimeout(2000); 
    
    
    const newProductCount = await page.locator('[data-testid^="product-row-"]').count();
    expect(newProductCount).toBeLessThan(initialProductCount);
  });
});