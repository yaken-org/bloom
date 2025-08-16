import React, { useMemo } from 'react';
import {
  Image,
  ColorMatrix,
  Group,
} from '@shopify/react-native-skia';
import type { SkImage } from '@shopify/react-native-skia';

interface ImageMagickFilterProps {
  image: SkImage;
  width: number;
  height: number;
}

const ImageMagickFilter: React.FC<ImageMagickFilterProps> = ({
  image,
  width,
  height,
}) => {
  // エッジ検出のためのカラーマトリックス
  const edgeDetectionMatrix = useMemo(() => [
    // エッジ検出風の効果を作るためのカラーマトリックス
    1.5, -0.5, -0.5, 0, 0,
    -0.5, 1.5, -0.5, 0, 0,
    -0.5, -0.5, 1.5, 0, 0,
    0, 0, 0, 1, 0,
  ], []);

  // 色反転のためのカラーマトリックス
  const negateMatrix = useMemo(() => [
    -1, 0, 0, 0, 1,
    0, -1, 0, 0, 1,
    0, 0, -1, 0, 1,
    0, 0, 0, 1, 0,
  ], []);

  // 彩度強化とカラー調整のマトリックス
  // modulate 100,300,100 (彩度3倍) + colorize 10,50,80の効果
  const modulateColorizeMatrix = useMemo(() => {
    const saturation = 2.5; // 彩度強化
    const lumR = 0.3086;
    const lumG = 0.6094;
    const lumB = 0.0820;
    
    const sr = (1 - saturation) * lumR;
    const sg = (1 - saturation) * lumG;
    const sb = (1 - saturation) * lumB;

    return [
      sr + saturation * 1.1, sg * 0.9, sb * 0.8, 0, 0.1, // Red channel + colorize
      sr * 0.8, sg + saturation * 1.5, sb * 0.7, 0, 0.5, // Green channel + colorize
      sr * 0.6, sg * 0.8, sb + saturation * 1.8, 0, 0.8, // Blue channel + colorize
      0, 0, 0, 1, 0,
    ];
  }, []);

  // 最終合成用のマトリックス（全体の効果を調整）
  const finalMatrix = useMemo(() => [
    0.8, 0.1, 0.1, 0, 0.1,
    0.2, 0.9, 0.2, 0, 0.0,
    0.3, 0.3, 1.2, 0, 0.0,
    0, 0, 0, 1, 0,
  ], []);

  return (
    <Group>
      {/* Step 1: エッジ検出効果 */}
      <Image
        image={image}
        x={0}
        y={0}
        width={width}
        height={height}
        fit="cover"
        opacity={0.3}
      >
        <ColorMatrix matrix={edgeDetectionMatrix} />
      </Image>

      {/* Step 2: 色反転効果 */}
      <Image
        image={image}
        x={0}
        y={0}
        width={width}
        height={height}
        fit="cover"
        opacity={0.4}
      >
        <ColorMatrix matrix={negateMatrix} />
      </Image>

      {/* Step 3: 彩度強化とカラーライズ効果 */}
      <Image
        image={image}
        x={0}
        y={0}
        width={width}
        height={height}
        fit="cover"
        opacity={0.6}
      >
        <ColorMatrix matrix={modulateColorizeMatrix} />
      </Image>

      {/* Step 4: 最終合成 */}
      <Image
        image={image}
        x={0}
        y={0}
        width={width}
        height={height}
        fit="cover"
        opacity={0.5}
      >
        <ColorMatrix matrix={finalMatrix} />
      </Image>
    </Group>
  );
};

export default ImageMagickFilter;