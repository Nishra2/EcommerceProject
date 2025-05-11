# Test info

- Name: Authentication - Success Tests Only >> Login - Success with Redirect
- Location: C:\Users\nashb\OneDrive\Desktop\EcommerceProject\tests\e2e\auth.spec.ts:46:7

# Error details

```
Error: page.waitForURL: Test timeout of 30000ms exceeded.
=========================== logs ===========================
waiting for navigation to "/" until "load"
============================================================
    at C:\Users\nashb\OneDrive\Desktop\EcommerceProject\tests\e2e\auth.spec.ts:55:14
```

# Page snapshot

```yaml
- navigation:
  - link "Flowbite React Logo Speed Merch":
    - /url: /
    - img "Flowbite React Logo"
    - text: Speed Merch
  - link "Notifications 0":
    - /url: /cart
    - button "Notifications 0":
      - img
      - text: Notifications 0
  - button "User"
- heading "Login" [level=1]
- text: Email
- textbox "Email": test@example.com
- text: Password
- textbox "Password": password123
- button "Login"
- link "Register":
  - /url: /register
- alert
- button "Open Next.js Dev Tools":
  - img
- button "Open issues overlay": 1 Issue
- button "Collapse issues badge":
  - img
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 |
   3 | test.describe('Authentication - Success Tests Only', () => {
   4 |   test.beforeEach(async ({ page }) => {
   5 |     // Mock successful registration
   6 |     await page.route('/api/register', async (route) => {
   7 |       return route.fulfill({
   8 |         status: 200,
   9 |         contentType: 'application/json',
  10 |         body: JSON.stringify({ message: 'Registration successful' })
  11 |       });
  12 |     });
  13 |
  14 |     // Mock successful login through NextAuth
  15 |     await page.route('**/api/auth/callback/credentials', async (route) => {
  16 |       return route.fulfill({
  17 |         status: 200,
  18 |         contentType: 'application/json',
  19 |         body: JSON.stringify({ 
  20 |           ok: true,
  21 |           url: '/',
  22 |           error: null
  23 |         })
  24 |       });
  25 |     });
  26 |   });
  27 |
  28 |   test('Registration - Success', async ({ page }) => {
  29 |     await page.goto('/register');
  30 |     
  31 |     // Fill in registration form
  32 |     await page.fill('[data-testid="register-name-input"]', 'John Doe');
  33 |     await page.fill('[data-testid="register-email-input"]', 'john@example.com');
  34 |     await page.fill('[data-testid="register-password-input"]', 'password123');
  35 |     
  36 |     // Submit the form
  37 |     await page.click('[data-testid="register-submit-button"]');
  38 |     
  39 |     // Wait for redirect to login page
  40 |     await page.waitForURL('/login');
  41 |     
  42 |     // Verify we're on login page
  43 |     await expect(page).toHaveURL('/login');
  44 |   });
  45 |
  46 |   test('Login - Success with Redirect', async ({ page }) => {
  47 |     await page.goto('/login');
  48 |     
  49 |     // Fill in login form
  50 |     await page.fill('[data-testid="login-email-input"]', 'test@example.com');
  51 |     await page.fill('[data-testid="login-password-input"]', 'password123');
  52 |     
  53 |     // Submit the form and wait for navigation
  54 |     await Promise.all([
> 55 |         page.waitForURL('/'),
     |              ^ Error: page.waitForURL: Test timeout of 30000ms exceeded.
  56 |         page.click('[data-testid="login-submit-button"]')
  57 |     ]);
  58 |     
  59 |     // Verify we're on home page
  60 |     await page.goto('/');
  61 |     await expect(page).toHaveURL('http://localhost:3000');
  62 |     
  63 |     // Optional: Wait for specific elements that indicate the page has loaded
  64 |     // For example, if you have a header or specific content on the home page
  65 |     // await expect(page.locator('[data-testid="home-header"]')).toBeVisible();
  66 | });
  67 | });
```