import { test, expect } from '@playwright/test';
import { fileUrl } from '../_helpers';

test.describe('Admin users list UI', () => {
  test('search form can fill and reset fields', async ({ page }) => {
    await page.goto(fileUrl('templates/admin-users.html'));

    const form = page.locator('form').first();
    await expect(form).toBeVisible();

    await form.getByLabel('ユーザーID').fill('admin01');
    await form.getByLabel('氏名').fill('管理 太郎');
    await form.getByLabel('権限').fill('ADMIN');
    await form.getByLabel('最終ログイン').fill('2025-01-15 09:10');

    await expect(form.getByLabel('ユーザーID')).toHaveValue('admin01');
    await expect(form.getByLabel('氏名')).toHaveValue('管理 太郎');
    await expect(form.getByLabel('権限')).toHaveValue('ADMIN');
    await expect(form.getByLabel('最終ログイン')).toHaveValue('2025-01-15 09:10');

    await form.getByRole('button', { name: 'クリア' }).click();

    await expect(form.getByLabel('ユーザーID')).toHaveValue('');
    await expect(form.getByLabel('氏名')).toHaveValue('');
    await expect(form.getByLabel('権限')).toHaveValue('');
    await expect(form.getByLabel('最終ログイン')).toHaveValue('');
  });

  test('clicking a user navigates to detail page', async ({ page }) => {
    await page.goto(fileUrl('templates/admin-users.html'));

    await page.getByRole('link', { name: 'admin01' }).click();
    await expect(page).toHaveURL(fileUrl('templates/admin-user-detail.html'));
  });
});

