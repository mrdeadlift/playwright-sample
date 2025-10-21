import { test, expect } from '@playwright/test';
import { fileUrl } from '../_helpers';

test.describe('templates/login.html (unit)', () => {
  test('renders core structure', async ({ page }) => {
    await page.goto(fileUrl('templates/login.html'));

    await expect(page.locator('h1')).toHaveText(/Management Sample/);
    await expect(page.locator('h2')).toBeVisible();
    await expect(page.locator('form[method="get"]')).toBeVisible();
  });

  test('has email + password inputs with required', async ({ page }) => {
    await page.goto(fileUrl('templates/login.html'));

    const email = page.locator('input#email[type="email"]');
    const password = page.locator('input#password[type="password"]');
    await expect(email).toBeVisible();
    await expect(password).toBeVisible();
    await expect(email).toHaveAttribute('required', '');
    await expect(password).toHaveAttribute('required', '');
  });

  test('submit button exists and is primary', async ({ page }) => {
    await page.goto(fileUrl('templates/login.html'));
    const submit = page.getByRole('button', { name: /login|ログイン|signin|sign in/i });
    // Be flexible with localized text; ensure a button exists.
    await expect(page.locator('button[type="submit"]')).toBeVisible();
    // Primary class present
    await expect(page.locator('button[type="submit"].btn.btn-primary')).toBeVisible();
  });

  test('thymeleaf attributes are present (not yet processed)', async ({ page }) => {
    await page.goto(fileUrl('templates/login.html'));
    // Ensure thymeleaf namespace and attributes remain in template stage
    await expect(page.locator('html')).toHaveAttribute('xmlns:th', /thymeleaf/);
    await expect(page.locator('form')).toHaveAttribute('th:action', /\@\{\/index\.html\}/);
  });
});
