import { test, expect } from '@playwright/test';
import { fileUrl } from '../_helpers';

test.describe('Navigation flow (ITA, file scheme)', () => {
  test('index ➜ members ➜ sales ➜ TOP ➜ login', async ({ page }) => {
    await page.goto(fileUrl('templates/index.html'));
    await expect(page.locator('h1')).toBeVisible();

    // Expand Members and navigate to members list
    await page.locator('a[data-bs-toggle="collapse"][href="#menuMembers"]').click();
    await expect(page.locator('#menuMembers')).toHaveClass(/show/);
    await page.locator('#menuMembers a[href="members.html"]').click();
    await expect(page).toHaveURL(/members\.html$/);
    await expect(page.locator('main h1')).toBeVisible();
    await expect(page.locator('aside a.active[href="members.html"]')).toBeVisible();

    // Expand Sales and navigate to sales list
    await page.locator('a[data-bs-toggle="collapse"][href="#menuSales"]').click();
    await expect(page.locator('#menuSales')).toHaveClass(/show/);
    await page.locator('#menuSales a[href="sales.html"]').click();
    await expect(page).toHaveURL(/sales\.html$/);
    await expect(page.locator('aside a.active[href="sales.html"]')).toBeVisible();

    // Navigate back to TOP via header
    await page.getByRole('link', { name: /Management Sample/i }).click();
    await expect(page).toHaveURL(/index\.html$/);
    await expect(page.locator('aside a.active[href="index.html"]')).toBeVisible();

    // Logout to login page
    await page.getByRole('link', { name: /logout|ログアウト/i }).click();
    await expect(page).toHaveURL(/login\.html$/);
    await expect(page.locator('form input#email')).toBeVisible();
  });

  test('index ➜ admin users ➜ admin detail ➜ admin create', async ({ page }) => {
    await page.goto(fileUrl('templates/index.html'));

    // Expand Admin
    await page.locator('a[data-bs-toggle="collapse"][href="#menuAdmin"]').click();
    await expect(page.locator('#menuAdmin')).toHaveClass(/show/);

    // Admin users list
    await page.locator('#menuAdmin a[href="admin-users.html"]').click();
    await expect(page).toHaveURL(/admin-users\.html$/);
    await expect(page.locator('aside a.active[href="admin-users.html"]')).toBeVisible();

    // Admin detail (via sidebar link to detail template)
    await page.locator('#menuAdmin a[href="admin-user-detail.html"]').click();
    await expect(page).toHaveURL(/admin-user-detail\.html$/);
    await expect(page.locator('aside a.active[href="admin-user-detail.html"]')).toBeVisible();

    // Admin create (via sidebar link)
    await page.locator('#menuAdmin a[href="admin-user-create.html"]').click();
    await expect(page).toHaveURL(/admin-user-create\.html$/);
    await expect(page.locator('#au-userid')).toBeVisible();
  });
});
