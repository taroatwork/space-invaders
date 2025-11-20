# Space Invaders 開発報告書

## 概要

本プロジェクトは、1978年のアーケードゲーム「スペースインベーダー」をWebアプリケーションとして再現したものです。TypeScriptとHTML5 Canvasを使用し、PWA対応のモバイルフレンドリーなゲームとして完成させました。

**開発期間**: 2024年11月
**デプロイURL**: https://space-invaders-gamma-bay.vercel.app/
**GitHubリポジトリ**: https://github.com/taroatwork/space-invaders

---

## 開発フェーズ

### Phase 1: 基本ゲームメカニクス

#### 実装内容
- プロジェクト初期設定（Vite + TypeScript）
- HTML5 Canvasによるレンダリングシステム
- ゲームループ（60FPS）
- プレイヤー（自機）の移動と射撃
- インベーダー編隊（5行×11列）の配置と移動
- 当たり判定システム
- スコアシステムとHUD表示

#### バグ修正
開発中に以下の問題を発見し修正しました：

1. **シールドの当たり判定問題**
   - 問題: シールドがミサイルを正しく防御しない
   - 解決: ピクセル単位の当たり判定を実装

2. **ミサイルの移動速度**
   - 問題: インベーダーのミサイルが速すぎる
   - 解決: 速度定数を調整

3. **インベーダーの加速**
   - 問題: 残数減少時の加速が不十分
   - 解決: オリジナルの「バグ」を再現した加速ロジックを実装

4. **複数弾の実装**
   - 問題: 1発ずつしか撃てない
   - 解決: 最大3発同時発射可能に変更

5. **連射機能**
   - 問題: 連射できない
   - 解決: キー押しっぱなしで15フレームごとに発射

---

### Phase 2: サウンドシステム

#### 実装内容
Web Audio APIを使用したレトロサウンドシステムを実装しました。

- **4音ベースライン**: インベーダー移動時（A1, G1, F1, E1の循環）
- **射撃音**: 高音から低音へのスウィープ
- **インベーダー爆発音**: 低周波のノイズ
- **プレイヤー爆発音**: 長めの低音爆発
- **シールドヒット音**: 短い高音のクラックル
- **ゲームオーバーメロディ**: 下降音階（G4-F4-E4-D4-C4）
- **UFOサウンド**: LFOによるワーブリング音

---

### Phase 3: UFO（ミステリーシップ）

#### 実装内容
- 約20-30秒間隔でランダム出現
- 画面上部を横断
- 撃墜時に50-300点のランダムスコア
- 撃墜位置にスコア表示（1秒間）

---

### Phase 4: モバイル対応

#### 実装内容

1. **タッチコントロール**
   - 画面下部に3つのボタン配置: [◀][FIRE][▶]
   - ボタン中心間隔20mm（ユーザー実測でのフィードバックに基づく調整）
   - 円形ボタン（直径60px、緑色ボーダー）

2. **デバイス検出**
   - `'ontouchstart' in window || navigator.maxTouchPoints > 0`
   - タッチデバイスのみコントロールボタンを表示
   - PCブラウザでは非表示

3. **レイアウト最適化**
   - キャンバス上部配置（`justify-content: flex-start`）
   - 上部パディング10px、下部80px
   - タッチボタンとゲーム画面の重なり防止

4. **デバイス別メッセージ**
   - PC: "PRESS SPACE TO RESTART"
   - モバイル: "TAP FIRE TO RESTART"

#### ユーザーフィードバックによる調整
- ボタン間隔: 15px → 30px → 45px → 55px（実測13mm → 18mm → 20mm）
- ボタン配置: 左右分離 → 中央揃え[左][火][右]

---

### Phase 5: PWA化

#### 実装内容

1. **vite-plugin-pwa設定**
   ```typescript
   VitePWA({
     registerType: 'autoUpdate',
     manifest: {
       name: 'Space Invaders',
       short_name: 'Invaders',
       display: 'standalone',
       orientation: 'portrait',
     },
     workbox: {
       globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
     },
   })
   ```

2. **PWAアイコン作成**
   - pwa-192x192.svg
   - pwa-512x512.svg
   - スペースインベーダーのドット絵をSVGで再現

3. **Service Worker**
   - Workboxによるオフラインキャッシュ
   - Google Fontsのキャッシュ設定

---

## 追加機能実装

### ゲームオーバー後のリスタート機能
- スペースキー（PC）またはFIREボタン（モバイル）でリスタート
- ゲーム状態の完全リセット

### ゲームオーバーオーバーレイ
- 半透明黒背景（rgba(0, 0, 0, 0.7)）
- インベーダーと文字の重なり防止

### キャンバス解像度向上
- ピクセル比を2x → 3x → 4x → 5x に段階的に調整
- ユーザーフィードバック: 「眠い感じ」→「とても良くなりました」

### シールドリセット
- ステージクリア時にシールドを初期状態にリセット
- `initializeShields()`を stage clear ロジックに追加

### ポーズ機能
- **PC**: Pキーでトグル
- **モバイル**: ゲーム画面タップでトグル
- 黄色「PAUSED」表示とデバイス別再開メッセージ

---

## 技術的課題と解決

### iOS AudioContext問題

#### 問題
iOS Safari/Chromeでは、AudioContextが「suspended」状態で開始されるため、音が鳴らない。

#### 解決
1. `init()`でAudioContext作成後に`resume()`を呼び出し
2. 各サウンド再生メソッドで`ensureResumed()`を呼び出し
3. Promiseとして呼び出しエラーをキャッチ

```typescript
private ensureResumed(): void {
  if (this.audioContext && this.audioContext.state === 'suspended') {
    this.audioContext.resume().catch(() => {});
  }
}
```

### モバイルネットワークテスト

#### 問題
ローカル開発サーバーにモバイルから接続できない。

#### 解決
```bash
npm run dev -- --host
```
同一Wi-Fiネットワーク上でIPアドレス経由でアクセス。

---

## デプロイメント

### GitHub + Vercel自動デプロイ

1. GitHubリポジトリ作成: `taroatwork/space-invaders`
2. Vercelプロジェクト連携
3. `git push origin main`で自動ビルド・デプロイ

#### 初回プッシュ時の問題
- リモートにREADME.mdが存在
- `git push --force`で解決

### Vercel CLI環境構築

1. グローバルインストール: `npm install -g vercel`
2. ログイン: `vercel login`（ブラウザ認証）
3. プロジェクトリンク: `vercel link --project space-invaders --yes`

---

## 最終成果物

### 機能一覧
- オリジナルに忠実なゲームプレイ
- 5種類のインベーダースプライト
- 4種類の防御壁
- UFO（ミステリーシップ）
- 8種類のサウンドエフェクト
- モバイルタッチコントロール
- ポーズ機能
- PWA対応（オフライン動作、ホーム画面追加）
- レスポンシブデザイン

### 技術スタック
- TypeScript
- Vite
- HTML5 Canvas（5x解像度）
- Web Audio API
- vite-plugin-pwa + Workbox
- Vercel

### プロジェクト構成
```
Space_Invaders_01/
├── src/
│   ├── main.ts
│   ├── types/
│   ├── game/
│   │   ├── Game.ts
│   │   ├── entities/
│   │   └── utils/
│   ├── rendering/
│   └── audio/
├── public/
│   ├── pwa-192x192.svg
│   └── pwa-512x512.svg
├── index.html
├── vite.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## コミット履歴

1. 初期実装（Phase 1-3完了）
2. Phase 4: モバイルタッチコントロール
3. Phase 5: PWA設定
4. ステージクリア時のシールドリセット
5. iOS AudioContext修正
6. ポーズ機能追加
7. iOS Chrome AudioContext修正
8. README.md追加

---

## 今後の改善案

1. ハイスコアのローカルストレージ保存
2. 難易度選択（EASY/NORMAL/HARD）
3. ステージごとの難易度上昇
4. タッチ操作の振動フィードバック
5. BGM追加
6. リーダーボード機能

---

## 結論

本プロジェクトは、クラシックアーケードゲームのWeb再現として、オリジナルの雰囲気を保ちながらモダンな技術スタックで実装することに成功しました。特にモバイル対応とPWA化により、スマートフォンでのネイティブアプリに近い体験を提供できています。

ユーザーフィードバックを随時取り入れながら、ボタン間隔や解像度など細部の調整を行い、実用的なゲームアプリケーションとして完成させることができました。

---

*本報告書は Claude Code による AI支援開発の記録です。*
