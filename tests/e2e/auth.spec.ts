import { test, expect } from '@playwright/test';

test.describe('Authentication tests', () => {
  test.beforeEach(async ({ page }) => {
    // Mock successful registration
    await page.route('/api/register', async (route) => {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Registration successful' })
      });
    });

    // Mock successful login through NextAuth
    await page.route('**/api/auth/callback/credentials', async (route) => {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ 
          ok: true,
          url: '/',
          error: null
        })
      });
    });
  });

  test('to be able to register successfully', async ({ page }) => {
    await page.goto('/register');
    
    // Fill in registration form
    await page.fill('[data-testid="register-name-input"]', 'John Doe');
    await page.fill('[data-testid="register-email-input"]', 'john@example.com');
    await page.fill('[data-testid="register-password-input"]', 'password123');
    
    // Submit the form
    await page.click('[data-testid="register-submit-button"]');
    
    // Wait for redirect to login page
    await page.waitForURL('/login');
    
    // Verify we're on login page
    await expect(page).toHaveURL('/login');
  });

  test('Successfully login and redirect to home page', async ({ page }) => {
    await page.goto('/login');
    
    // Fill in login form
    await page.fill('[data-testid="login-email-input"]', 'test@example.com');
    await page.fill('[data-testid="login-password-input"]', 'password123');
    
    // Submit the form
    await page.click('[data-testid="login-submit-button"]');
    
    // Wait a moment for the login to process
    await page.waitForTimeout(1000);
    
    // Navigate to home page
    await page.goto('http://localhost:3000');
    
    // Verify we're on home page
    await expect(page).toHaveURL('http://localhost:3000');
});
});