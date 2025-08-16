import React, { useMemo } from 'react';
import {
  Image,
  ColorMatrix,
  Group,
} from '@shopify/react-native-skia';
import type { SkImage } from '@shopify/react-native-skia';

interface GlitteryFilterProps {
  image: SkImage;
  width: number;
  height: number;
}

const GlitteryFilter: React.FC<GlitteryFilterProps> = ({
  image,
  width,
  height,
}) => {
  // ハイライト強調マトリックス（光る部分を作る）
  const highlightMatrix = useMemo(() => [
    1.8, 0.3, 0.3, 0, 0.2,  // 赤を強調
    0.3, 1.8, 0.3, 0, 0.2,  // 緑を強調
    0.3, 0.3, 1.8, 0, 0.2,  // 青を強調
    0, 0, 0, 1, 0,
  ], []);

  // メタリック効果マトリックス（銀色っぽく）
  const metallicMatrix = useMemo(() => [
    10000, 10000, 100000, 10000, 10000,
    2.8, 2.2, 0.8, 0, 0.15,
    2.8, 2.8, 1.2, 0, 0.15,
    -100, -100, -100, -100, -100,
  ], []);

  // ゴールド効果マトリックス（金色っぽく）
  const goldMatrix = useMemo(() => [
    1.5, 1.0, 0.3, 0, 0.1,  // 赤と緑を強調して金色に
    1.0, 1.3, 0.5, 0, 0.05,
    0.2, 0.4, 0.8, 0, 0.0,
    0, 0, 0, 1, 0,
  ], []);

  // シャープネス強調マトリックス（エッジをくっきり）
  const sharpnessMatrix = useMemo(() => [
    2.0, -0.3, -0.3, 0, 0,
    -0.3, 2.0, -0.3, 0, 0,
    -0.3, -0.3, 2.0, 0, 0,
    0, 0, 0, 1, 0,
  ], []);

  // 彩度爆上げマトリックス（ギラギラ感を出す）
  const hyperSaturationMatrix = useMemo(() => {
    const saturation = 4.0; // 超高彩度
    const lumR = 0.3086;
    const lumG = 0.6094;
    const lumB = 0.0820;
    
    const sr = (1 - saturation) * lumR;
    const sg = (1 - saturation) * lumG;
    const sb = (1 - saturation) * lumB;

    return [
      sr + saturation, sg, sb, 0, 0.1,
      sr, sg + saturation, sb, 0, 0.1,
      sr, sg, sb + saturation, 0, 0.1,
      0, 0, 0, 1, 0,
    ];
  }, []);

  // コントラスト強化マトリックス
  const highContrastMatrix = useMemo(() => [
    1.8, 0, 0, 0, -0.2,     // 高コントラスト
    0, 1.8, 0, 0, -0.2,
    0, 0, 1.8, 0, -0.2,
    0, 0, 0, 1, 0,
  ], []);

  return (
    <Group>
      {/* Layer 1: ベースのシャープネス強化 */}
      <Image
        image={image}
        x={0}
        y={0}
        width={width}
        height={height}
        fit="cover"
        opacity={0.4}
      >
        <ColorMatrix matrix={sharpnessMatrix} />
      </Image>

      {/* Layer 2: 超高彩度でギラギラ感 */}
      <Image
        image={image}
        x={0}
        y={0}
        width={width}
        height={height}
        fit="cover"
        opacity={0.6}
      >
        <ColorMatrix matrix={hyperSaturationMatrix} />
      </Image>

      {/* Layer 3: メタリック効果 */}
      <Image
        image={image}
        x={0}
        y={0}
        width={width}
        height={height}
        fit="cover"
        opacity={0.3}
      >
        <ColorMatrix matrix={metallicMatrix} />
      </Image>

      {/* Layer 4: ゴールド効果 */}
      <Image
        image={image}
        x={0}
        y={0}
        width={width}
        height={height}
        fit="cover"
        opacity={0.4}
      >
        <ColorMatrix matrix={goldMatrix} />
      </Image>

      {/* Layer 5: ハイライト強調 */}
      <Image
        image={image}
        x={0}
        y={0}
        width={width}
        height={height}
        fit="cover"
        opacity={0.5}
      >
        <ColorMatrix matrix={highlightMatrix} />
      </Image>

      {/* Layer 6: 最終コントラスト強化 */}
      <Image
        image={image}
        x={0}
        y={0}
        width={width}
        height={height}
        fit="cover"
        opacity={0.4}
      >
        <ColorMatrix matrix={highContrastMatrix} />
      </Image>
    </Group>
  );
};

export default GlitteryFilter;