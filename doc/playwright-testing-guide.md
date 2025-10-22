# Playwright テスト運用ガイド（チーム開発向け）

## 目的
- 大規模・複数人開発でも「壊れにくく」「読みやすく」「保守しやすい」UIテストを実現するための共通ルールを定義します。
- 本ドキュメントの方針に従い、実装・レビュー・運用を統一します。

## セレクタ方針（優先度）
1. getByRole / getByLabel / getByPlaceholder（アクセシビリティに準拠）
2. getByText（限定的に）
3. getByTestId（`data-testid`。必要箇所のみ）
4. CSS / XPath（最終手段）

- 文字列依存を減らすため、テキストではなくロール/ラベル取得を優先
- `data-testid` はラベル/ロールで取りにくい箇所のみ付与し、命名は `page-section-element[-action]`
- `playwright.config.ts` に `testIdAttribute: 'data-testid'` を設定
- 避ける: CSSクラス連結、`.nth()` の乱用、`force: true` クリック、`waitForTimeout`

例
```ts
// 推奨
await page.getByRole('button', { name: '保存' }).click();
await page.getByRole('dialog', { name: '確認' }).getByRole('link', { name: '保存する' }).click();

// 回避（脆い）
await page.locator('a.btn.btn-primary').click();
```

## i18n/表記ゆらぎ対策
- 実行環境を固定: `locale: 'ja-JP'`, `timezoneId: 'Asia/Tokyo'`, `colorScheme: 'light'`
- UI文言変更に強くする: 取れる箇所は `aria-label` / `aria-labelledby` を付与して安定名で取得
- 日時/金額等の表示は、テストでは値段やフォーマット期待を過度に固定化しない（必要な最小条件のみ）

## ディレクトリ構成
- `tests/e2e/**`: 画面や機能横断のE2E
- `tests/ui/**`: 画面単位のUIテスト
- `tests/pages/**`: Page Object（薄く）
- `tests/components/**`: 再利用可能なUIコンポーネントオブジェクト（モーダル/テーブルなど）
- `tests/fixtures/**`: 共通フィクスチャ・データビルダ
- `tests/utils/**`: 小さなヘルパ（共通操作）

## Page Object / コンポーネントオブジェクト
- 目的: セレクタの集中管理とテストの可読性向上（抽象化はやり過ぎない）
- 命名: 「何をするか」が伝わるメソッド名（例: `saveAndConfirm`）
- Locator は遅延評価で保持、`readonly` プロパティ化して重複排除
- 共通UI（モーダル、検索フォーム、ページネーション、テーブル）はコンポーネント化

例: 管理ユーザー編集ページ
```ts
import type { Page } from '@playwright/test';
import { fileUrl } from '../_helpers';

export class AdminUserEditPage {
  constructor(private readonly page: Page) {}
  readonly form = this.page.locator('form').first();

  async open() {
    await this.page.goto(fileUrl('templates/admin-user-edit.html'));
  }

  async fill(data: Partial<{ name: string; email: string; role: 'ADMIN'|'MANAGER'|'OPERATOR' }>) {
    if (data.name)  await this.form.getByLabel('氏名').fill(data.name);
    if (data.email) await this.form.getByLabel('メール').fill(data.email);
    if (data.role)  await this.form.getByLabel('権限').selectOption({ label: data.role });
  }

  async saveAndConfirm() {
    await this.page.getByRole('button', { name: '保存' }).first().click();
    await this.page.getByRole('dialog', { name: '確認' }).getByRole('link', { name: '保存する' }).click();
  }
}
```

## フィクスチャ / ロール別実行
- `test.extend` で共通の前処理（ログイン済み、POの提供、テストデータ用APIなど）
- `storageState` をロールごとに作成し `projects` で切替
- baseURL を使える環境では `use.baseURL` を統一

例
```ts
// tests/fixtures/auth.ts
import { test as base } from '@playwright/test';

export const test = base.extend({
  storageState: 'storage/admin.json',
});
export const expect = test.expect;
```

## Playwright 設定（推奨）
```ts
// playwright.config.ts（抜粋）
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [['html'], ['junit', { outputFile: 'reports/junit.xml' }]],
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    testIdAttribute: 'data-testid',
    locale: 'ja-JP',
    timezoneId: 'Asia/Tokyo',
    colorScheme: 'light',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});
```

## データ/ネットワーク戦略
- 本番相当E2E（遅いが信頼性高）は専用テストデータをDB/バックエンドに用意し、ID/状態を固定
- 疎結合・高速テストは `page.route` でAPIモック or HAR を利用、`APIRequestContext` で初期データ投入
- 外部サービス依存を排除し、CIで安定再現可能に

## 安定性/フレーク対策
- 自動待機を信頼し、`waitForTimeout` は原則禁止
- アニメーションの影響を抑える: `test.use({ reducedMotion: 'reduce' })`
- モーダル等は `getByRole('dialog')` で可視化を確認
- 非DOM状態は `expect.poll` を利用
- テーブル行選択はキー列で `data-testid="user-row-<id>"` を付与

## スクリーンショット/VRT（必要に応じて）
- 重要UIのみに `toHaveScreenshot()` を導入し、差分承認フローを定義
- 実行環境のフォント/ズーム/OSテーマを固定

## 命名・レビュー・テスト設計
- テスト名: 「ユーザー価値/結果」を明確に（例: `保存で確認モーダルが開き保存すると詳細に戻る`）
- 1テスト1目的（Arrange/Act/Assert を視認できる構成）
- 重複が3回以上出ればヘルパ/PO抽出、4画面以上で同パターンならコンポーネント化
- レビューの禁止事項チェック
  - 脆いセレクタ（CSS連結、`.nth()` 乱用）
  - `force: true`、`waitForTimeout` の使用
  - 冗長なリトライロジック

## CI/CD 運用
- PR: 重要経路のスモーク（タグ `@smoke`）を実行、失敗時はトレース/スクショ/動画をアーティファクト
- Nightly: 全スイート＋複数ブラウザ/解像度の拡張実行、レポート集約
- シャーディング・並列・リトライの有効化

## 追加のチームルール（運用実務）
- Node/PNPM/Yarn のバージョン固定（例: `.tool-versions` や Volta）
- テスト実行コマンドの標準化
  - `npm run test:ui`（UI/ユニット）
  - `npm run test:e2e`（E2E）
  - `npm run test:report`（レポート閲覧）
- ESLint/Prettier でテストコードも整形・静的解析（`eslint-plugin-playwright` の導入検討）
- 変更伴うときはテストの「意図（何を守るか）」をPRに明記
- 重要フローはテストケース一覧を `/doc/test-cases.md` で管理（カバレッジの見える化）
- `data-testid` の追加・変更は必ずPR記載（テスト影響範囲の合意）

## 導入チェックリスト
- [ ] `playwright.config.ts` を本ガイド準拠に更新
- [ ] 主要画面のPO/コンポーネントを `tests/pages/**`, `tests/components/**` に作成
- [ ] `data-testid` の命名規則および付与ポリシーを周知
- [ ] CIで `trace/screenshot/video` の収集とアーティファクト保管
- [ ] レビュー用チェックリストをPRテンプレートに組み込み

---

このガイドの更新はPRで行い、変更理由と適用範囲を記述してください。テストの安定性/速度/可読性のトレードオフは定期的に振り返ります。

