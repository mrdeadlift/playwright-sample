import { test, expect } from '@playwright/test';
import { fileUrl } from '../_helpers';

test.describe('Login UI', () => {
  test('can fill and submit login form, then navigate to TOP', async ({ page }) => {
    await page.goto(fileUrl('templates/login.html'));

    const form = page.locator('form').first();
    await expect(form).toBeVisible();

    await form.getByLabel('メールアドレス').fill('user@example.com');
    await form.getByLabel('パスワード').fill('password123');

    await form.getByRole('button', { name: 'ログイン' }).click();

    await expect(page).toHaveURL(fileUrl('templates/index.html'));
  });
});

