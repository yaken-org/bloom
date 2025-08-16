import React, { useMemo } from 'react';
import {
  Image,
  ColorMatrix,
  Group,
  useImage,
} from '@shopify/react-native-skia';
import type { SkImage } from '@shopify/react-native-skia';

interface OverlayFilterProps {
  image: SkImage;
  width: number;
  height: number;
  templateType?: 'vintage' | 'grunge' | 'light' | 'texture';
}

const OverlayFilter: React.FC<OverlayFilterProps> = ({
  image,
  width,
  height,
  templateType = 'vintage',
}) => {
  // テンプレート画像のURL（実際のプロジェクトでは適切な画像URLを使用）
  const templateUrls = {
    vintage: 'https://picsum.photos/400/300?grayscale&blur=1', // ヴィンテージ風
    grunge: 'https://picsum.photos/seed/grunge/400/300', // グランジ風
    light: 'https://picsum.photos/seed/light/400/300', // ライト効果
    texture: 'https://picsum.photos/seed/texture/400/300', // テクスチャ
  };

  const templateImage = useImage(templateUrls[templateType]);

  // ベース画像の調整マトリックス
  const baseAdjustMatrix = useMemo(() => {
    switch (templateType) {
      case 'vintage':
        return [
          0.9, 0.1, 0.0, 0, 0.1,   // 赤みを少し加える
          0.1, 0.8, 0.1, 0, 0.05,  // 緑を抑える
          0.0, 0.1, 0.7, 0, 0.0,   // 青を抑えてセピア風
          0, 0, 0, 1, 0,
        ];
      case 'grunge':
        return [
          1.2, 0.1, 0.1, 0, 0.0,   // コントラスト強化
          0.1, 1.2, 0.1, 0, 0.0,
          0.1, 0.1, 1.2, 0, 0.0,
          0, 0, 0, 1, 0,
        ];
      case 'light':
        return [
          1.1, 0.05, 0.05, 0, 0.15,  // 明るく
          0.05, 1.1, 0.05, 0, 0.15,
          0.05, 0.05, 1.1, 0, 0.15,
          0, 0, 0, 1, 0,
        ];
      case 'texture':
        return [
          1.0, 0.0, 0.0, 0, 0.0,   // そのまま
          0.0, 1.0, 0.0, 0, 0.0,
          0.0, 0.0, 1.0, 0, 0.0,
          0, 0, 0, 1, 0,
        ];
      default:
        return [
          1.0, 0.0, 0.0, 0, 0.0,
          0.0, 1.0, 0.0, 0, 0.0,
          0.0, 0.0, 1.0, 0, 0.0,
          0, 0, 0, 1, 0,
        ];
    }
  }, [templateType]);

  // テンプレート画像の調整マトリックス
  const templateMatrix = useMemo(() => {
    switch (templateType) {
      case 'vintage':
        return [
          0.8, 0.4, 0.2, 0, 0.0,   // セピア調に
          0.6, 0.6, 0.2, 0, 0.0,
          0.4, 0.3, 0.5, 0, 0.0,
          0, 0, 0, 0.6, 0,         // 透明度調整
        ];
      case 'grunge':
        return [
          0.5, 0.5, 0.5, 0, 0.0,   // グレースケール化
          0.5, 0.5, 0.5, 0, 0.0,
          0.5, 0.5, 0.5, 0, 0.0,
          0, 0, 0, 0.4, 0,         // 少し透明に
        ];
      case 'light':
        return [
          1.5, 1.5, 1.5, 0, 0.2,   // 明るく白っぽく
          1.5, 1.5, 1.5, 0, 0.2,
          1.5, 1.5, 1.5, 0, 0.2,
          0, 0, 0, 0.3, 0,         // かなり透明に
        ];
      case 'texture':
        return [
          0.7, 0.7, 0.7, 0, 0.0,   // グレーベースのテクスチャ
          0.7, 0.7, 0.7, 0, 0.0,
          0.7, 0.7, 0.7, 0, 0.0,
          0, 0, 0, 0.5, 0,
        ];
      default:
        return [
          1.0, 0.0, 0.0, 0, 0.0,
          0.0, 1.0, 0.0, 0, 0.0,
          0.0, 0.0, 1.0, 0, 0.0,
          0, 0, 0, 1, 0,
        ];
    }
  }, [templateType]);

  // オーバーレイの設定
  const overlaySettings = useMemo(() => {
    switch (templateType) {
      case 'vintage':
        return { opacity: 0.7, baseOpacity: 0.8 };
      case 'grunge':
        return { opacity: 0.6, baseOpacity: 0.9 };
      case 'light':
        return { opacity: 0.4, baseOpacity: 1.0 };
      case 'texture':
        return { opacity: 0.8, baseOpacity: 0.85 };
      default:
        return { opacity: 0.5, baseOpacity: 1.0 };
    }
  }, [templateType]);

  return (
    <Group>
      {/* ベース画像 (調整済み) */}
      <Image
        image={image}
        x={0}
        y={0}
        width={width}
        height={height}
        fit="cover"
        opacity={overlaySettings.baseOpacity}
      >
        <ColorMatrix matrix={baseAdjustMatrix} />
      </Image>

      {/* テンプレート画像のオーバーレイ */}
      {templateImage && (
        <Image
          image={templateImage}
          x={0}
          y={0}
          width={width}
          height={height}
          fit="cover"
          opacity={overlaySettings.opacity}
        >
          <ColorMatrix matrix={templateMatrix} />
        </Image>
      )}

      {/* 追加の効果レイヤー（テンプレートタイプに応じて） */}
      {templateType === 'vintage' && (
        <Image
          image={image}
          x={0}
          y={0}
          width={width}
          height={height}
          fit="cover"
          opacity={0.3}
        >
          <ColorMatrix matrix={[
            0.6, 0.3, 0.1, 0, 0.1,   // さらにセピア強化
            0.3, 0.6, 0.1, 0, 0.05,
            0.1, 0.2, 0.4, 0, 0.0,
            0, 0, 0, 1, 0,
          ]} />
        </Image>
      )}

      {templateType === 'grunge' && (
        <Image
          image={image}
          x={0}
          y={0}
          width={width}
          height={height}
          fit="cover"
          opacity={0.2}
        >
          <ColorMatrix matrix={[
            1.5, 0.0, 0.0, 0, -0.1,   // 高コントラスト
            0.0, 1.5, 0.0, 0, -0.1,
            0.0, 0.0, 1.5, 0, -0.1,
            0, 0, 0, 1, 0,
          ]} />
        </Image>
      )}
    </Group>
  );
};

export default OverlayFilter;