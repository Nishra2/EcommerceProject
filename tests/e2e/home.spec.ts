// tests/e2e/home.spec.ts
import { test, expect } from '@playwright/test';

test.describe("Home page functionality", () => {
  test.beforeEach(async ({ page }) => {
   
    await page.route('/api/products', route => {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { 
            id: '1',
            name: 'Blue sneakers', 
            price: 99.99, 
            description: 'Casual footwear to get you from place to place',
            images: [
              "https://media.istockphoto.com/id/495204892/photo/sneakers.jpg?s=612x612&w=0&k=20&c=QSkl09_Rx2lvayG93dWBmoCsVPThoAB1VgcSyh6Jy_4="
            ],
            category: 'shoes'
          },
          { 
            id: '2',
            name: 'Logitech mouse', 
            price: 999.99, 
            description: 'Make life easier with the logitech mouse.',
            images: [
              "https://m.media-amazon.com/images/I/51WN5aXZWIL.__AC_SX300_SY300_QL70_ML2_.jpg"
            ],
            category: 'Technology'
          },
          { 
            id: '3',
            name: 'Bluey toy', 
            price: 24.99, 
            description: 'For the kids own excitement',
            images: [
              "https://hnau.imgix.net/media/catalog/product/0/1/01-p-1080.png?auto=compress&auto=format&fill-color=FFFFFF&fit=fill&fill=solid&w=992&h=558"
            ],
            category: 'Toys'
          },
          { 
            id: '4',
            name: 'PS5 Pro', 
            price: 499.99, 
            description: 'Sony interactive console',
            images: ["https://press-start.com.au/wp-content/uploads/2024/09/PS5-Proooo-Design.jpg"],
            category: 'Gaming'
          },
          { 
            id: '5',
            name: 'xbox 360', 
            price: 799.99, 
            description: 'Micosofts interactive gaming console',
            images: ['https://www.bigw.com.au/medias/sys_master/images/images/h2b/h22/63840342573086.jpg'],
            category: 'Technology'
          },
          { 
            id: '6',
            name: 'Acer swift laptop', 
            price: 34.99, 
            description: 'Brand new Acer laptop, for casual or professional use',
            images: ["https://dmau.imgix.net/media/catalog/product/a/c/acer-swift-16-ai-sf16-51t-with-fingerprint-with-backlit-wp-oled-logo-gold-black-02_1_giesmu4tdqmceb60.jpg"],
            category: 'Toys'
          }
        ])
      });
    });

    
    await page.route('/api/categories', route => {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(['shoes', 'Technology', 'Toys', 'Gaming'])
      });
    });
  });
  
  test('displays all products on load', async ({ page }) => {
    await page.goto('/');
    
    
    await page.waitForSelector('[data-testid="product-card"]', { 
      state: 'visible',
      timeout: 5000
    });
    
    
    await expect(page.locator('[data-testid="product-card"]')).toHaveCount(6);
    
    
    await expect(page.locator('[data-testid="product-name"]')).toContainText(['Blue sneakers', 'Logitech mouse']);
    await expect(page.locator('[data-testid="product-price"]')).toContainText(['$99.99', '$999.99']);
  });
  
  test('filters products by category', async ({ page }) => {
    await page.goto('/');
    
    
    await page.waitForSelector('[data-testid="product-card"]', { state: 'visible' });
    await page.waitForSelector('[data-testid="category-filter-All"]', { state: 'visible' });
    
    
    await expect(page.locator('[data-testid="product-card"]')).toHaveCount(6);
    
    
    await page.locator('[data-testid="category-filter-Technology"]').click();
    
    
    await expect(page.locator('[data-testid="product-card"]')).toHaveCount(2);
    await expect(page.locator('[data-testid="product-name"]')).toContainText(['Logitech mouse', 'xbox 360']);
    
    
    await page.locator('[data-testid="category-filter-Toys"]').click();
    
    
    await expect(page.locator('[data-testid="product-card"]')).toHaveCount(2);
    await expect(page.locator('[data-testid="product-name"]')).toContainText(['Bluey toy', 'Acer swift laptop']);
    
    
    await page.locator('[data-testid="category-filter-All"]').click();
    
    
    await expect(page.locator('[data-testid="product-card"]')).toHaveCount(6);
  });


  test('product cards display correct information', async ({ page }) => {
    await page.goto('/');
    
    await page.waitForSelector('[data-testid="product-card"]', { state: 'visible' });
    
    const firstProductCard = page.locator('[data-testid="product-card"]').first();
    
    await expect(firstProductCard.locator('[data-testid="product-name"]')).toBeVisible();
    await expect(firstProductCard.locator('[data-testid="product-description"]')).toBeVisible();
    await expect(firstProductCard.locator('[data-testid="product-price"]')).toBeVisible();
    await expect(firstProductCard.locator('[data-testid="product-image"]')).toBeVisible();
    
    await expect(firstProductCard.locator('[data-testid="product-name"]')).toContainText('Blue sneakers');
    await expect(firstProductCard.locator('[data-testid="product-price"]')).toContainText('$99.99');
  });

  test('searches for products with the search bar', async ({ page }) => {
    
    await page.goto('/');
    await page.waitForSelector('[data-testid="products-grid"]', { state: 'visible' });
    await expect(page.locator('[data-testid="product-card"]')).toHaveCount(6);
    
    
    const searchInput = page.locator('[data-testid="search-input"]');
    await searchInput.fill('Logitech');
    
    
    await page.waitForTimeout(300); 

    await expect(page.locator('[data-testid="product-card"]')).toHaveCount(1);
    await expect(page.locator('[data-testid="product-name"]')).toContainText('Logitech mouse');
    
    
    await searchInput.fill('');
    await page.waitForTimeout(300);
    
    
    await expect(page.locator('[data-testid="product-card"]')).toHaveCount(6);
    
   
    await searchInput.fill('nonexistent product');
    await page.waitForTimeout(300);
    
   
    await expect(page.locator('[data-testid="product-card"]')).toHaveCount(0);
    await expect(page.locator('[data-testid="no-products-message"]')).toBeVisible();
  });

  test('adds product to cart and navigates to cart page', async ({ page }) => {
    
    await page.goto('/');
    
    
    await page.waitForSelector('[data-testid="product-card"]', { state: 'visible' });
    
   
    const addToCartButton = page.locator('[data-testid="add-to-cart-button"]').first();
    await addToCartButton.click();
    
    
    const cartCount = page.locator('[data-testid="cart-count"]');
    await expect(cartCount).toHaveText('1');
    
    
    const cartNavButton = page.locator('[data-testid="cart-button"]');
    await cartNavButton.click();
    
    
    await expect(page).toHaveURL('/cart');
    
    
  });



});
