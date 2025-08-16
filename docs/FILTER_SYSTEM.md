# 拡張可能フィルターシステム

このシステムは画像にフィルターを動的に適用するための拡張可能なアーキテクチャを提供します。

## 🎯 主な特徴

- **動的フィルター管理**: FilterFactory による拡張可能な設計
- **型安全性**: TypeScript による完全な型サポート
- **プラグアブル**: 新しいフィルターを簡単に追加可能
- **状態管理**: useFilterState フックによる簡潔な状態管理
- **後方互換性**: 既存のコードとの互換性を維持

## 📁 アーキテクチャ

```
lib/filters/
  ├── FilterFactory.ts          # フィルター登録と管理
  ├── FilterStateManager.ts     # フィルター状態の管理
  └── customFilters.ts          # カスタムフィルターの登録例

components/
  ├── FilterRenderer.tsx        # フィルターレンダリング
  ├── FilterView.tsx           # メインビューコンポーネント
  ├── FilterControls.tsx       # コントロールUI
  └── filters/                 # 個別フィルター
      ├── ImageMagickFilter.tsx
      ├── GlitteryFilter.tsx
      ├── OverlayFilter.tsx
      ├── SepiaFilter.tsx       # カスタムフィルター例
      └── BlueFilter.tsx        # カスタムフィルター例

hooks/
  └── useFilterState.ts        # フィルター状態管理フック

types/
  └── filters.ts               # 型定義
```

## 🚀 基本的な使用方法

### 1. コンポーネントでの使用

```tsx
import React, { useState } from 'react';
import FilterView from '@/components/FilterView';
import FilterControls from '@/components/FilterControls';
import { useFilterState } from '@/hooks/useFilterState';

const MyComponent: React.FC = () => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [overlayImageUrl, setOverlayImageUrl] = useState<string | null>(null);
  
  const {
    filterStates,
    filterOrder,
    activeFilters,
    toggleFilter,
    setFilterOrder,
  } = useFilterState();

  return (
    <>
      {imageUri && (
        <FilterView 
          imageUrl={imageUri}
          filters={activeFilters}
          overlayImageUrl={overlayImageUrl}
        />
      )}
      
      <FilterControls
        filterStates={filterStates}
        filterOrder={filterOrder}
        overlayImageUrl={overlayImageUrl}
        onToggleFilter={toggleFilter}
        onReorderFilter={setFilterOrder}
      />
    </>
  );
};
```

### 2. 新しいフィルターの作成

```tsx
// components/filters/MyCustomFilter.tsx
import React, { useMemo } from 'react';
import { Image, ColorMatrix, Group } from '@shopify/react-native-skia';
import type { FilterComponentProps } from '@/types/filters';

const MyCustomFilter: React.FC<FilterComponentProps> = ({
  image,
  width,
  height,
  isBaseLayer = true,
}) => {
  const customMatrix = useMemo(() => [
    1.2, 0, 0, 0, 0,
    0, 1.0, 0, 0, 0,
    0, 0, 0.8, 0, 0,
    0, 0, 0, 1, 0,
  ], []);

  return (
    <Group>
      {isBaseLayer && (
        <Image image={image} x={0} y={0} width={width} height={height} fit="cover" />
      )}
      
      <Image
        image={image}
        x={0} y={0} width={width} height={height}
        fit="cover"
        opacity={0.7}
        {...(!isBaseLayer && { blendMode: 'overlay' })}
      >
        <ColorMatrix matrix={customMatrix} />
      </Image>
    </Group>
  );
};

export default MyCustomFilter;
```

### 3. フィルターの登録

```tsx
// lib/filters/registerMyFilters.ts
import { filterFactory } from '@/lib/filters/FilterFactory';
import MyCustomFilter from '@/components/filters/MyCustomFilter';

filterFactory.registerFilter({
  type: 'myCustom',
  name: 'マイカスタム',
  description: 'カスタムエフェクト',
  component: MyCustomFilter,
  defaultEnabled: false,
  color: '#FF6347',
  category: 'artistic'
});
```

## 🛠️ API リファレンス

### FilterFactory

フィルターの登録と管理を行うシングルトンクラス。

```tsx
import { filterFactory } from '@/lib/filters/FilterFactory';

// フィルター登録
filterFactory.registerFilter(config);

// フィルター取得
const config = filterFactory.getFilterConfig('filterType');
const component = filterFactory.getFilterComponent('filterType');

// 全フィルター取得
const allConfigs = filterFactory.getAllFilterConfigs();
const availableTypes = filterFactory.getAvailableFilterTypes();
```

### useFilterState フック

フィルター状態を管理するReactフック。

```tsx
const {
  filterStates,        // フィルターの有効/無効状態
  filterOrder,         // フィルターの適用順序
  activeFilters,       // 有効なフィルターのリスト
  toggleFilter,        // フィルターのON/OFF切り替え
  setFilterOrder,      // 順序の変更
  moveFilterUp,        // フィルターを上に移動
  moveFilterDown,      // フィルターを下に移動
  disableAllFilters,   // 全フィルターを無効化
  hasActiveFilters,    // 有効なフィルターがあるか
  isFilterEnabled,     // 特定フィルターが有効か
} = useFilterState();
```

### FilterConfiguration 型

```tsx
interface FilterConfiguration {
  type: FilterType;                    // ユニークなフィルタータイプ
  name: string;                        // 表示名
  description: string;                 // 説明
  component: FilterComponent;          // フィルターコンポーネント
  defaultEnabled: boolean;             // デフォルトで有効か
  color: string;                       // UI表示色
  category: 'enhancement' | 'artistic' | 'blend' | 'effect';
  requiresAsset?: boolean;             // 追加アセットが必要か
  options?: {                          // オプション設定
    blendMode?: BlendMode;
    opacity?: number;
  };
}
```

## 📝 ベストプラクティス

1. **フィルターの独立性**: 各フィルターは独立して動作するように設計する
2. **パフォーマンス**: useMemo でマトリックスなどの重い計算をメモ化する
3. **型安全性**: FilterComponentProps を適切に実装する
4. **ブレンドモード**: isBaseLayer の値に応じてブレンドモードを適切に使い分ける
5. **エラーハンドリング**: フィルターが見つからない場合の処理を考慮する

## 🔄 マイグレーション

このシステムは最新の拡張可能なアーキテクチャを採用しています：

```tsx
// 基本的な使用方法
import FilterView from '@/components/FilterView';
import FilterControls from '@/components/FilterControls';
import { useFilterState } from '@/hooks/useFilterState';
```

## 🧪 テスト

TestPage.tsx がシステム全体の使用例とリファレンス実装を提供します。新しいフィルターの動作確認やシステムの理解に活用してください。
