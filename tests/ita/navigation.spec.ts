import { test, expect } from '@playwright/test';
import { fileUrl } from '../_helpers';

test.describe('Navigation flow (ITA, file scheme)', () => {
  test('TOP → 会員一覧 → 売上一覧 → TOP → ログイン', async ({ page }) => {
    await page.goto(fileUrl('templates/index.html'));
    await expect(page.getByRole('heading', { name: '業務画面へようこそ！' })).toBeVisible();

    // 会員メニューを展開して「会員一覧」へ
    await page.getByRole('link', { name: '会員' }).click();
    await page.getByRole('link', { name: '会員一覧' }).click();
    await expect(page).toHaveURL(fileUrl('templates/members.html'));
    await expect(page.getByRole('heading', { name: '会員一覧' })).toBeVisible();

    // 売上メニューを展開して「売上一覧」へ
    await page.getByRole('link', { name: '売上' }).click();
    await page.getByRole('link', { name: '売上一覧' }).click();
    await expect(page).toHaveURL(fileUrl('templates/sales.html'));
    await expect(page.getByRole('heading', { name: '売上一覧' })).toBeVisible();

    // ヘッダのブランドリンクでTOPへ
    await page.getByRole('link', { name: 'Management Sample' }).click();
    await expect(page).toHaveURL(fileUrl('templates/index.html'));
    await expect(page.getByRole('heading', { name: '業務画面へようこそ！' })).toBeVisible();

    // ログアウト → ログイン画面
    await page.getByRole('link', { name: 'ログアウト' }).click();
    await expect(page).toHaveURL(fileUrl('templates/login.html'));
    await expect(page.getByLabel('メールアドレス')).toBeVisible();
  });

  test('TOP → 管理ユーザー一覧 → 管理ユーザー詳細 → 管理ユーザー登録', async ({ page }) => {
    await page.goto(fileUrl('templates/index.html'));

    // 管理ユーザーメニュー
    await page.getByRole('link', { name: '管理ユーザー' }).click();

    // 一覧
    await page.getByRole('link', { name: '管理ユーザー一覧' }).click();
    await expect(page).toHaveURL(fileUrl('templates/admin-users.html'));
    await expect(page.getByRole('heading', { name: '管理ユーザー一覧' })).toBeVisible();

    // 詳細
    await page.getByRole('link', { name: '管理ユーザー詳細' }).click();
    await expect(page).toHaveURL(fileUrl('templates/admin-user-detail.html'));
    await expect(page.getByRole('heading', { name: /管理ユーザー詳細/ })).toBeVisible();

    // 登録
    await page.getByRole('link', { name: '管理ユーザー登録' }).click();
    await expect(page).toHaveURL(fileUrl('templates/admin-user-create.html'));
    await expect(page.getByRole('heading', { name: '管理ユーザー登録（サンプル）' })).toBeVisible();
    await expect(page.getByLabel('ユーザーID')).toBeVisible();
  });
});
