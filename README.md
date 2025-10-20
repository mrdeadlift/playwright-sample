# Management Sample (Thymeleaf-style static UI)

このプロジェクトは、Thymeleaf を想定した静的な業務画面サンプルです。動的な処理は実装しておらず、Bootstrap 5 でデザインしています。

## 構成

- `templates/`
  - `login.html` ログイン画面（メール、パスワード）
  - `index.html` ログイン後の TOP 画面
  - `members.html` 会員一覧
  - `sales.html` 売上一覧
  - `admin-users.html` 管理ユーザー一覧
  - `fragments/`
    - `header.html` ヘッダー（ログイン状態を右上に表示）
    - `sidebar.html` 左メニュー
    - `footer.html` フッター
- `assets/css/styles.css` 追加スタイル

Thymeleaf のフラグメント（`th:replace`）を使う前提の構造ですが、そのまま静的 HTML としても閲覧できます。

## 使い方（静的確認）

1. `templates/login.html` をブラウザで開く
2. 任意のメール・パスワードを入力して「ログイン」を押下（実際には検証のみ、`index.html` に遷移）
3. 画面上部にヘッダー、左にメニュー、下部にフッターが表示され、TOP から各一覧に遷移できます

## 備考

- 右上の「ログイン中」表示はサンプルとして固定のメールを表示しています（`demo@example.com`）。
- Spring Boot + Thymeleaf に組み込む場合は `templates/` と `static/` の構成に合わせてパスを調整してください。

