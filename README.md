# Bloom

SPAJAM 2025 で作ったアプリケーション。画像にフィルターを適用するための拡張可能なシステムを提供します。

## 🎯 主な機能

- **動的フィルター管理**: 新しいフィルターを簡単に追加・削除
- **拡張可能アーキテクチャ**: プラグアブルなフィルターシステム
- **型安全性**: TypeScript による完全な型サポート
- **カスタムフィルター**: セピア、ブルートーン、ImageMagick風、ギラギラ、オーバーレイなど

## 📖 ドキュメント

フィルターシステムの詳細な使用方法とAPIドキュメント:
- [フィルターシステムガイド](docs/FILTER_SYSTEM.md)

## 開発環境のセットアップ

### 必要なもの

各自好きな方法で以下のツールをインストールしてください。

- Node.js v22.18.0
- Taskfile(https://taskfile.dev/)

### main push を防止する

以下のコマンドを実行して、main ブランチへの push を防止します。

```bash
$ task precommit:enable
```

以下のような出力が得られます。

```bash
$ task precommit:enable
task: [precommit:enable] chmod +x .githooks/*
task: [precommit:enable] git config core.hooksPath .githooks/
```

### 依存関係をインストールする

```bash
$ npm install
```

### 起動する

```bash
$ task up
```

もしくは

```bash
$ npm start
```

### (任意) VS Code もしくはその fork を使っている人向け

Workspace設定を用意しているのでそれを使うと設定が共有できるので便利です。

```bash
$ code .vscode/bloom.code-workspace
```

## 関連ドキュメント

- [Expo](https://expo.dev)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo
- [Expo documentation](https://docs.expo.dev/)
  - [guides](https://docs.expo.dev/guides/).
  - [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/)
  - [development build](https://docs.expo.dev/develop/development-builds/introduction/)
  - [file-based routing](https://docs.expo.dev/router/introduction).
  - [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
  - [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
