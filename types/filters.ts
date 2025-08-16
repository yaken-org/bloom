import type { SkImage } from '@shopify/react-native-skia';

export type FilterType = 'overlay' | 'imageMagick' | 'glittery';

export type OverlayType = 'vintage' | 'grunge' | 'light' | 'texture';

export interface FilterState {
  imageMagick: boolean;
  glittery: boolean;
  overlay: boolean;
}

export interface FilterConfig {
  type: FilterType;
  enabled: boolean;
  options?: {
    overlayType?: OverlayType;
  };
}

export interface FilterComponentProps {
  image: SkImage;
  width: number;
  height: number;
  isBaseLayer?: boolean;
}

export interface OverlayFilterProps extends FilterComponentProps {
  overlayImageUrl?: string;
  blendMode?: 'multiply' | 'overlay' | 'screen';
  opacity?: number;
}
