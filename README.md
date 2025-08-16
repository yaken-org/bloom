# Bloom

SPAJAM 2025 で作ったアプリケーション。（後で埋める）

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
