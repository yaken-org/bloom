import type { SkImage } from "@shopify/react-native-skia";
import type { ComponentType } from "react";

// フィルタータイプの定義（型安全性向上）
export type FilterType =
  | "sepia"
  | "blue"
  | "overlay"
  | "glittery"
  | "imageMagick"
  | string; // 拡張性のためstringも許可

// ブレンドモードの定義
export type BlendMode =
  | "multiply"
  | "overlay"
  | "screen"
  | "colorDodge"
  | "lighten";

// フィルターカテゴリー
export type FilterCategory = "enhancement" | "artistic" | "blend" | "effect";

// フィルター状態の管理
export type FilterState = Record<FilterType, boolean>;

// フィルターオプションの基本型
export interface BaseFilterOptions {
  opacity?: number;
  intensity?: number;
}

// オーバーレイフィルター用オプション
export interface OverlayFilterOptions extends BaseFilterOptions {
  blendMode?: BlendMode;
  overlayImageUrl?: string;
}

// グリッターフィルター用オプション
export interface GlitteryFilterOptions extends BaseFilterOptions {
  particleCount?: number;
  sparkleIntensity?: number;
}

// フィルターオプションのユニオン型
export type FilterOptions =
  | BaseFilterOptions
  | OverlayFilterOptions
  | GlitteryFilterOptions;

// フィルターコンポーネントの基本Props
export interface FilterComponentProps {
  image: SkImage;
  width: number;
  height: number;
  isBaseLayer?: boolean;
  options?: FilterOptions;
}

// フィルターコンポーネントの型
export type FilterComponent = ComponentType<FilterComponentProps>;

// フィルター設定の完全な型定義
export interface FilterConfiguration {
  type: FilterType;
  name: string;
  description: string;
  component: FilterComponent;
  defaultEnabled: boolean;
  color: string;
  category: FilterCategory;
  requiresAsset?: boolean;
  defaultOptions?: FilterOptions;
}

// フィルターインスタンスの設定
export interface FilterInstance {
  type: FilterType;
  enabled: boolean;
  order: number;
  options: FilterOptions;
}

// フィルター設定の統合インターface
export interface FilterSettings {
  states: FilterState;
  order: FilterType[];
  options: Record<FilterType, FilterOptions>;
}
