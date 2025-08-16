import type { SkImage } from '@shopify/react-native-skia';
import type { ComponentType } from 'react';

// 基本的なフィルタータイプ（拡張可能）
export type FilterType = string;

// 廃止予定のタイプ（後方互換性のため）
export type OverlayType = 'vintage' | 'grunge' | 'light' | 'texture';

// フィルター状態を動的に管理するための型
export type FilterState = Record<FilterType, boolean>;

// 従来の設定（後方互換性のため）
export interface FilterConfig {
  type: FilterType;
  enabled: boolean;
  options?: {
    overlayType?: OverlayType;
  };
}

// フィルターコンポーネントの基本Props
export interface FilterComponentProps {
  image: SkImage;
  width: number;
  height: number;
  isBaseLayer?: boolean;
}

// オーバーレイフィルター専用のProps
export interface OverlayFilterProps extends FilterComponentProps {
  overlayImageUrl?: string;
  blendMode?: 'multiply' | 'overlay' | 'screen' | 'colorDodge' | 'lighten';
  opacity?: number;
}

// フィルターコンポーネントの型
export type FilterComponent = ComponentType<FilterComponentProps | OverlayFilterProps>;

// フィルター設定の完全な型定義
export interface FilterConfiguration {
  type: FilterType;
  name: string;
  description: string;
  component: FilterComponent;
  defaultEnabled: boolean;
  color: string;
  category: 'enhancement' | 'artistic' | 'blend' | 'effect';
  requiresAsset?: boolean;
  options?: {
    blendMode?: 'multiply' | 'overlay' | 'screen' | 'colorDodge' | 'lighten';
    opacity?: number;
  };
}

// フィルターインスタンスの設定
export interface FilterInstance {
  type: FilterType;
  enabled: boolean;
  order: number;
  options?: Record<string, any>;
}
