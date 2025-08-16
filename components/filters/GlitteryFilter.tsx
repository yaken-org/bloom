import React, { useMemo } from 'react';
import {
  Image,
  ColorMatrix,
  Group,
} from '@shopify/react-native-skia';
import type { FilterComponentProps } from '@/types/filters';

const GlitteryFilter: React.FC<FilterComponentProps> = ({
  image,
  width,
  height,
  isBaseLayer = true,
}) => {
  // シャープネス強調マトリックス（控えめに）
  const sharpnessMatrix = useMemo(() => [
    1.4, -0.1, -0.1, 0, 0,
    -0.1, 1.4, -0.1, 0, 0,
    -0.1, -0.1, 1.4, 0, 0,
    0, 0, 0, 1, 0,
  ], []);

  // 彩度爆上げマトリックス（ギラギラ感を出す）
  const hyperSaturationMatrix = useMemo(() => {
    const saturation = 2.8; // 高彩度だが合成を考慮
    const lumR = 0.3086;
    const lumG = 0.6094;
    const lumB = 0.0820;
    
    const sr = (1 - saturation) * lumR;
    const sg = (1 - saturation) * lumG;
    const sb = (1 - saturation) * lumB;

    return [
      sr + saturation, sg, sb, 0, 0.08,
      sr, sg + saturation, sb, 0, 0.08,
      sr, sg, sb + saturation, 0, 0.08,
      0, 0, 0, 1, 0,
    ];
  }, []);

  // メタリック効果マトリックス（銀色っぽく、控えめに）
  const metallicMatrix = useMemo(() => [
    1.4, 1.2, 1.0, 0, 0.1,
    1.2, 1.4, 1.0, 0, 0.1,
    1.0, 1.0, 1.2, 0, 0.1,
    0, 0, 0, 1, 0,
  ], []);

  // ハイライト強調マトリックス（光る部分を作る）
  const highlightMatrix = useMemo(() => [
    1.5, 0.2, 0.2, 0, 0.15,  // 赤を強調
    0.2, 1.5, 0.2, 0, 0.15,  // 緑を強調
    0.2, 0.2, 1.5, 0, 0.15,  // 青を強調
    0, 0, 0, 1, 0,
  ], []);

  return (
    <Group>
      {/* ベースレイヤーが必要な場合のみベース画像を表示 */}
      {isBaseLayer && (
        <Image
          image={image}
          x={0}
          y={0}
          width={width}
          height={height}
          fit="cover"
        />
      )}
      
      {/* Layer 1: シャープネス強化 */}
      <Image
        image={image}
        x={0}
        y={0}
        width={width}
        height={height}
        fit="cover"
        opacity={0.6}
        {...(!isBaseLayer && { blendMode: 'overlay' })}
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
        opacity={0.7}
        {...(!isBaseLayer && { blendMode: 'colorDodge' })}
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
        opacity={0.5}
        {...(!isBaseLayer && { blendMode: 'screen' })}
      >
        <ColorMatrix matrix={metallicMatrix} />
      </Image>

      {/* Layer 4: ハイライト強調 */}
      <Image
        image={image}
        x={0}
        y={0}
        width={width}
        height={height}
        fit="cover"
        opacity={0.6}
        {...(!isBaseLayer && { blendMode: 'lighten' })}
      >
        <ColorMatrix matrix={highlightMatrix} />
      </Image>
    </Group>
  );
};

export default GlitteryFilter;