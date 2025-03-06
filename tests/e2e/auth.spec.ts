import { test, expect, type Page } from '@playwright/test';
import { cleanupTestUser, cleanupAllTestUsers, closeConnection } from '../helpers/db';

// Test data
const TEST_USER = {
  email: `test-${Date.now()}@example.com`,
  password: 'Test123!@#',
  name: 'Test User'
};

async function registerUser(page: Page) {
  await page.goto('/register');
  await page.getByLabel('Name').fill(TEST_USER.name);
  await page.getByLabel('Email').fill(TEST_USER.email);
  await page.getByLabel('Password', { exact: true }).fill(TEST_USER.password);
  await page.getByLabel('Confirm Password', { exact: true }).fill(TEST_USER.password);
  
  // Click and wait for navigation
  await Promise.all([
    page.waitForURL('/login'),
    page.getByRole('button', { name: /create account/i }).click()
  ]);
}

async function loginUser(page: Page) {
  await page.goto('/login');
  await page.getByLabel('Email').fill(TEST_USER.email);
  await page.getByLabel('Password').fill(TEST_USER.password);
  
  // Click and wait for navigation
  await Promise.all([
    page.waitForURL('/activities'),
    page.getByRole('button', { name: /sign in/i }).click()
  ]);
}

test.describe('Authentication Flow', () => {
  test.beforeAll(async () => {
    try {
      // Clean up any leftover test users from previous runs
      await cleanupAllTestUsers();
    } catch (error) {
      console.error('Error in beforeAll cleanup:', error);
      // Don't throw here, let the tests run and potentially fail naturally
    }
  });

  test.afterAll(async () => {
    try {
      // Clean up and close the database connection
      await cleanupAllTestUsers();
      await closeConnection();
    } catch (error) {
      console.error('Error in afterAll cleanup:', error);
    }
  });

  test.afterEach(async () => {
    try {
      // Clean up the test user after each test
      await cleanupTestUser(TEST_USER.email);
    } catch (error) {
      console.error('Error in afterEach cleanup:', error);
      throw error; // Rethrow to mark the test as failed
    }
  });

  test('should allow user registration', async ({ page }) => {
    await registerUser(page);
    
    // Wait for the success state
    await expect(page.getByText(/account created successfully/i, { exact: false })).toBeVisible();
    
    // Verify we're on the login page
    await expect(page).toHaveURL('/login');
  });

  test('should allow user login', async ({ page }) => {
    // Register first
    await registerUser(page);
    await loginUser(page);
    
    // Verify we're on the dashboard
    await expect(page).toHaveURL('/activities');
    await expect(page.getByText(TEST_USER.name)).toBeVisible();
  });

  test('should show dashboard after authentication', async ({ page }) => {
    // Register first
    await registerUser(page);
    await loginUser(page);
    
    // Verify dashboard elements
    await expect(page.getByRole('heading', { name: /activities/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /new activity/i })).toBeVisible();
    
    // Verify user menu is present
    await expect(page.getByRole('button', { name: /user menu/i })).toBeVisible();
  });

  test('should allow logout', async ({ page }) => {
    // Register and login first
    await registerUser(page);
    await loginUser(page);
    
    // Click user menu and logout
    await page.getByRole('button', { name: /user menu/i }).click();
    await page.getByRole('button', { name: /sign out/i }).click();
    
    // Verify we're logged out
    await expect(page).toHaveURL('/login');
  });
}); 