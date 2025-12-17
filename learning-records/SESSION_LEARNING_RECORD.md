# Space Invaders 開発セッション - 学習記録

## セッション概要

**開発期間**: 2024年11月20日
**開発形態**: AI（Claude Code）との共同開発
**成果物**: Space Invaders Webアプリケーション（PWA対応）
**デプロイURL**: https://space-invaders-gamma-bay.vercel.app/

---

## 学習目標と達成事項

### 1. プロジェクト管理とバージョン管理

#### 学んだこと
- **Git/GitHubの実践的な使用**
  - コミットメッセージの書き方
  - リモートリポジトリへのプッシュ
  - force pushの使い所と注意点

- **継続的デプロイ（CD）**
  - GitHub連携による自動デプロイ
  - Vercel CLIによる手動デプロイ
  - デプロイ方法の使い分け

#### 実践した操作
```bash
git add -A
git commit -m "message"
git push origin main
git push --force  # 必要な場合のみ
```

---

### 2. モダンWebアプリケーション開発

#### TypeScript + Vite環境

**学んだ技術スタック**:
- TypeScript: 型安全なコード記述
- Vite: 高速な開発サーバーとビルドツール
- HTML5 Canvas: グラフィックスレンダリング
- Web Audio API: サウンド生成

**プロジェクト構造の理解**:
```
src/
├── main.ts           # エントリーポイント
├── types/            # 型定義の集約
├── game/             # ゲームロジック
├── rendering/        # 描画システム
└── audio/            # サウンドシステム
```

**学習ポイント**:
- 関心の分離（Separation of Concerns）
- 責任の明確化（各クラスが単一の責任を持つ）
- 型定義による保守性向上

---

### 3. ゲーム開発の基礎

#### ゲームループの理解

```typescript
private gameLoop(timestamp: number): void {
  const deltaTime = timestamp - this.lastFrameTime;

  if (deltaTime >= FRAME_TIME) {
    this.update();  // ゲーム状態更新
    this.render();  // 描画
    this.lastFrameTime = timestamp;
  }

  requestAnimationFrame((t) => this.gameLoop(t));
}
```

**学習ポイント**:
- 60FPSの実現方法
- `requestAnimationFrame`の使用
- デルタタイムによるフレーム管理

#### 状態管理

**GamePhaseによる状態遷移**:
```
PLAYING → STAGE_CLEAR → PLAYING → GAME_OVER
   ↑                                  ↓
   └──────── RESTART ←────────────────┘
```

**学習ポイント**:
- 列挙型（Enum）による状態管理
- 状態に応じた処理の分岐
- フラグ管理の重要性

---

### 4. インタラクティブUI/UX

#### デバイス検出とレスポンシブ対応

```typescript
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
```

**学習ポイント**:
- タッチデバイスの判定方法
- デバイスごとの操作方法の出し分け
- ユーザビリティの重要性

#### タッチコントロールの実装

**実践した調整プロセス**:
1. 初期実装: 左右分離配置
2. フィードバック: ボタンが遠すぎる
3. 改善: 中央揃え配置
4. フィードバック: ボタン間隔が狭い（13mm）
5. 最終調整: 20mm間隔に拡大

**学習ポイント**:
- 実機テストの重要性
- 物理的な寸法（mm）での調整
- ユーザーフィードバックに基づく反復改善

---

### 5. Web Audio API

#### AudioContextの扱い

**遭遇した課題**:
iOSでは自動再生ポリシーによりAudioContextが`suspended`状態になる

**解決方法**:
```typescript
init(): void {
  this.audioContext = new AudioContext();

  if (this.audioContext.state === 'suspended') {
    this.audioContext.resume().catch(() => {});
  }
}

private ensureResumed(): void {
  if (this.audioContext && this.audioContext.state === 'suspended') {
    this.audioContext.resume().catch(() => {});
  }
}
```

**学習ポイント**:
- ブラウザごとの挙動の違い
- ユーザー操作後の音声再生という制約
- クロスブラウザ対応の重要性

#### レトロサウンドの生成

```typescript
oscillator.type = 'square';  // 矩形波で8bitサウンド
oscillator.frequency.setValueAtTime(1200, now);
oscillator.frequency.exponentialRampToValueAtTime(200, now + 0.1);
```

**学習ポイント**:
- オシレーターによる音波生成
- 周波数エンベロープ
- ゲインノードによる音量制御

---

### 6. PWA（Progressive Web App）

#### vite-plugin-pwaの設定

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

**学習ポイント**:
- Service Workerによるオフライン対応
- マニフェストファイルの役割
- 「ホーム画面に追加」機能

**実際に達成できたこと**:
- iPhoneのSafariで「ホーム画面に追加」
- オフラインでのゲームプレイ
- ネイティブアプリに近い体験

---

### 7. デバッグとトラブルシューティング

#### 問題解決のプロセス

**事例1: iOS Chromeで音が出ない**

1. **問題の特定**: iOS Safariでは動作するがChromeでは音が出ない
2. **原因の調査**: ChromeとSafariでAudioContextの挙動が異なる
3. **仮説の立案**: `resume()`のPromise処理が必要
4. **実装と検証**: `ensureResumed()`を各サウンドメソッドに追加
5. **確認**: 実機で動作確認

**事例2: タッチボタンの間隔調整**

1. **問題の報告**: ボタンが狭くて押しにくい
2. **定量的な測定**: 実際に物理的な寸法（mm）を測定
3. **段階的な調整**: 15px → 30px → 45px → 55px
4. **各段階での確認**: 13mm → 18mm → 20mm
5. **最終決定**: 20mmで確定

**学習ポイント**:
- 問題を定量的に捉える
- 段階的なアプローチ
- フィードバックループの重要性

---

### 8. ローカル開発環境とネットワーク

#### モバイル実機テスト

```bash
npm run dev -- --host
```

**実践したこと**:
- ローカルネットワーク上でのサーバー起動
- IPアドレスによるモバイルからのアクセス
- 同一Wi-Fiネットワークの必要性の理解

**遭遇した問題**:
- モバイルのテザリング使用時は接続不可
- Wi-Fi切り替えで解決

**学習ポイント**:
- ネットワーク環境の重要性
- 実機テストの必須性
- 開発時のネットワーク構成

---

### 9. デプロイメント戦略

#### GitHub + Vercel自動デプロイ

**学んだワークフロー**:
```
コード変更 → git commit → git push → GitHub更新 → Vercel自動ビルド → 本番デプロイ
```

**利点**:
- コードとデプロイの同期
- デプロイ履歴の追跡
- ロールバックの容易さ

#### Vercel CLI

**セットアップ手順**:
```bash
npm install -g vercel
vercel login
vercel link --project space-invaders --yes
```

**使い分け**:
- 通常: GitHub経由（履歴が残る）
- 緊急時: CLI（即座にデプロイ）

**学習ポイント**:
- 複数のデプロイ手段を持つ意義
- OAuth認証フローの理解
- プロジェクトリンクの概念

---

### 10. Canvas描画とグラフィックス

#### 高解像度対応

```typescript
const pixelRatio = 5;
canvas.width = CANVAS_WIDTH * pixelRatio;
canvas.height = CANVAS_HEIGHT * pixelRatio;
ctx.scale(pixelRatio, pixelRatio);
```

**調整プロセス**:
- 2x: ボケている
- 3x: まだ不十分
- 4x: 改善したがもう少し
- 5x: 「とても良くなりました」

**学習ポイント**:
- デバイスピクセル比の概念
- スケーリングによる高精細化
- 視覚的な品質の重要性

#### スプライトシステム

```typescript
interface Sprite {
  width: number;
  height: number;
  pixels: number[][];
}
```

**学習ポイント**:
- ピクセル単位のグラフィックス表現
- 2次元配列によるスプライトデータ
- レトロゲームの描画手法

---

### 11. ゲームデザイン

#### ステージクリア演出

**実装した「間」の演出**:
```typescript
if (this.aliveInvaderCount === 0) {
  this.state.phase = GamePhase.STAGE_CLEAR;
  this.stageClearTimer = 120; // 2秒
}
```

**学習ポイント**:
- ゲーム体験における「間」の重要性
- 状態遷移のタイミング
- プレイヤーへの達成感の提供

#### ユーザーエクスペリエンス

**段階的な改善プロセス**:
1. ゲームオーバー後のリスタート機能
2. デバイス別のメッセージ表示
3. ポーズ機能の追加
4. ステージクリア演出

**学習ポイント**:
- 小さな改善の積み重ね
- ユーザーの立場で考える
- フィードバックの重要性

---

## 技術的な深い学び

### 1. 当たり判定の実装

#### AABB衝突判定

```typescript
private isColliding(a: Rectangle, b: Rectangle): boolean {
  return a.x < b.x + b.width &&
         a.x + a.width > b.x &&
         a.y < b.y + b.height &&
         a.y + a.height > b.y;
}
```

**学習ポイント**:
- 軸平行境界ボックス（AABB）の概念
- 効率的な矩形衝突判定
- ゲーム物理の基礎

#### ピクセルパーフェクト衝突

```typescript
checkCollision(x: number, y: number, damageRadius: number): boolean {
  // ピクセル単位の衝突判定と破壊
}
```

**学習ポイント**:
- 粗い判定と精密な判定の組み合わせ
- パフォーマンスと精度のトレードオフ

---

### 2. オブジェクト指向設計

#### エンティティの設計

```
Entity (基底概念)
├── Player
├── Invader
├── Bullet
├── Missile
├── Shield
└── UFO
```

**各エンティティの責任**:
- 自身の状態管理
- 移動・更新ロジック
- 衝突判定用のデータ提供
- スプライトデータ保持

**学習ポイント**:
- 単一責任の原則
- カプセル化
- インターフェースによる抽象化

---

### 3. イベント駆動プログラミング

#### キーボード入力

```typescript
window.addEventListener('keydown', (e) => {
  this.keys.add(e.key.toLowerCase());
});

window.addEventListener('keyup', (e) => {
  this.keys.delete(e.key.toLowerCase());
});
```

**学習ポイント**:
- イベントリスナーの登録
- キー状態のセット管理
- 複数キー同時押しの対応

#### タッチイベント

```typescript
btn.addEventListener('touchstart', (e) => {
  e.preventDefault();
  this.keys.add(key);
});

btn.addEventListener('touchend', (e) => {
  e.preventDefault();
  this.keys.delete(key);
});
```

**学習ポイント**:
- タッチイベントの種類（start, end, cancel）
- `preventDefault()`の重要性
- モバイル特有のイベント処理

---

## 開発プロセスから学んだこと

### 1. 反復的開発（Iterative Development）

**実践したサイクル**:
```
実装 → テスト → フィードバック → 改善 → 実装...
```

**具体例**:
- キャンバス解像度: 2x → 3x → 4x → 5x
- ボタン間隔: 15px → 30px → 45px → 55px
- オーディオ対応: Safari → Chrome対応追加

**学習ポイント**:
- 完璧を目指すより、まず動くものを作る
- フィードバックに基づく改善
- 小さな変更を積み重ねる

---

### 2. 問題解決のアプローチ

#### 体系的なデバッグ手法

1. **問題の特定**: 何が起きているか
2. **再現性の確認**: いつ起きるか
3. **原因の仮説**: なぜ起きるか
4. **検証**: 仮説が正しいか
5. **修正**: どう直すか
6. **確認**: 直ったか

**実例: iOS Chromeオーディオ問題**
1. 特定: iOS Chromeで音が出ない
2. 再現: 常に音が出ない
3. 仮説: AudioContext.resume()の呼び方が不適切
4. 検証: ensureResumed()を追加
5. 修正: 各サウンドメソッドで呼び出し
6. 確認: 実機で音が出ることを確認

---

### 3. ドキュメンテーションの重要性

**作成した資料**:
- README.md: ユーザー向け説明書
- DEVELOPMENT_REPORT.md: 開発履歴
- SESSION_LEARNING_RECORD.md: 学習記録（本資料）

**学習ポイント**:
- 将来の自分のための記録
- 他者への説明能力
- プロジェクトの価値の可視化

---

## AI協調開発から学んだこと

### 1. コミュニケーション

**効果的だったこと**:
- 具体的な指示（「ボタン間隔を20mmに」）
- 定量的なフィードバック（「現在13mm」）
- 動作確認の報告（「確認できました」）

**学習ポイント**:
- 明確な指示の重要性
- 測定可能な指標の使用
- フィードバックループの確立

---

### 2. 段階的な開発

**Phase 1-5の計画的な進行**:
- Phase 1: 基本ゲーム
- Phase 2: サウンド
- Phase 3: UFO
- Phase 4: モバイル対応
- Phase 5: PWA化

**学習ポイント**:
- 大きな目標を小さなステップに分解
- 各フェーズの完了を確認
- 段階的な複雑化

---

### 3. 柔軟な対応

**計画外の追加機能**:
- リスタート機能
- ポーズ機能
- ステージクリア演出
- シールドリセット

**学習ポイント**:
- 開発中の気づきを取り入れる
- 完璧な計画は不要
- ユーザー体験の改善を優先

---

## 実践的なスキル習得

### 1. ターミナル操作

**使用したコマンド**:
```bash
# 開発
npm install
npm run dev
npm run build

# Git
git add -A
git commit -m "message"
git push origin main
git status

# Vercel
vercel login
vercel link
vercel --prod
```

---

### 2. ブラウザ開発者ツール

**活用した機能**:
- コンソールでのエラー確認
- ネットワークタブでのリソース確認
- デバイスモードでのモバイル確認

---

### 3. 実機テスト

**テストした環境**:
- iPhone Safari
- iPhone Chrome
- PCブラウザ
- PWAとしてのインストール

**学習ポイント**:
- エミュレータと実機の違い
- デバイス固有の問題の発見
- クロスプラットフォーム対応

---

## 今後の学習計画

### 短期的な目標

1. **TypeScriptの深化**
   - ジェネリクス
   - 高度な型システム
   - デコレータ

2. **Canvasアニメーション**
   - パーティクルシステム
   - スプライトアニメーション
   - エフェクト実装

3. **Web Audio APIの応用**
   - BGM実装
   - サウンドミキシング
   - オーディオエフェクト

---

### 中期的な目標

1. **ゲームエンジンの理解**
   - Phaser.js
   - PixiJS
   - Three.js

2. **状態管理ライブラリ**
   - Redux
   - MobX
   - Zustand

3. **テスト駆動開発**
   - Jest
   - Vitest
   - E2Eテスト

---

### 長期的な目標

1. **複雑なゲームの開発**
   - RPG
   - アクションゲーム
   - マルチプレイヤーゲーム

2. **パフォーマンス最適化**
   - プロファイリング
   - メモリ管理
   - レンダリング最適化

3. **商用アプリケーション開発**
   - 収益化
   - 分析
   - マーケティング

---

## 重要な気づき

### 1. 完璧主義より反復改善

最初から完璧を目指すのではなく、動くものを作ってから改善する方が効率的。

### 2. ユーザーフィードバックの価値

実際に使ってみないと分からない問題が多数存在する。

### 3. 技術的負債は早めに返済

問題を先送りすると後で大きな修正が必要になる。

### 4. ドキュメントは未来の自分への贈り物

後から見返したときに理解できる記録を残す。

### 5. 小さな成功の積み重ね

大きな目標は小さなステップに分解して達成する。

---

## 最後に

このセッションを通じて、単にゲームを作るだけでなく、以下のことを学びました：

1. **モダンWeb開発の全体像**
2. **問題解決のアプローチ**
3. **ユーザー中心の開発**
4. **継続的な改善の重要性**
5. **AI協調開発の可能性**

この経験は、今後のソフトウェア開発における強固な基盤となります。

---

**記録日**: 2024年11月20日
**プロジェクト**: Space Invaders Web Application
**開発者**: 山田健太郎 with Claude Code
