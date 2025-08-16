import React, { useMemo } from 'react';
import {
  Image,
  ColorMatrix,
  Group,
} from '@shopify/react-native-skia';
import type { FilterComponentProps, GlitteryFilterOptions } from '@/types/filters';

const GlitteryFilter: React.FC<FilterComponentProps> = React.memo(({
  image,
  width,
  height,
  isBaseLayer = true,
  options = {},
}) => {
  const { 
    opacity = 0.7, 
    intensity = 1.0, 
    sparkleIntensity = 1.0 
  } = options as GlitteryFilterOptions;
  
  // シャープネス強調マトリックス（控えめに）
  const sharpnessMatrix = useMemo(() => {
    const i = intensity;
    return [
      1.4 * i + (1 - i), -0.1 * i, -0.1 * i, 0, 0,
      -0.1 * i, 1.4 * i + (1 - i), -0.1 * i, 0, 0,
      -0.1 * i, -0.1 * i, 1.4 * i + (1 - i), 0, 0,
      0, 0, 0, 1, 0,
    ];
  }, [intensity]);

  // 彩度爆上げマトリックス（ギラギラ感を出す）
  const hyperSaturationMatrix = useMemo(() => {
    const saturation = 2.8 * sparkleIntensity; // 高彩度だが合成を考慮
    const lumR = 0.3086;
    const lumG = 0.6094;
    const lumB = 0.0820;
    
    const sr = (1 - saturation) * lumR;
    const sg = (1 - saturation) * lumG;
    const sb = (1 - saturation) * lumB;

    return [
      sr + saturation, sg, sb, 0, 0.08 * sparkleIntensity,
      sr, sg + saturation, sb, 0, 0.08 * sparkleIntensity,
      sr, sg, sb + saturation, 0, 0.08 * sparkleIntensity,
      0, 0, 0, 1, 0,
    ];
  }, [sparkleIntensity]);

  // メタリック効果マトリックス（銀色っぽく、控えめに）
  const metallicMatrix = useMemo(() => {
    const s = sparkleIntensity;
    return [
      1.4 * s + (1 - s), 1.2 * s, 1.0 * s, 0, 0.1 * s,
      1.2 * s, 1.4 * s + (1 - s), 1.0 * s, 0, 0.1 * s,
      1.0 * s, 1.0 * s, 1.2 * s + (1 - s), 0, 0.1 * s,
      0, 0, 0, 1, 0,
    ];
  }, [sparkleIntensity]);

  // ハイライト強調マトリックス（光る部分を作る）
  const highlightMatrix = useMemo(() => {
    const s = sparkleIntensity;
    return [
      1.5 * s + (1 - s), 0.2 * s, 0.2 * s, 0, 0.15 * s,  // 赤を強調
      0.2 * s, 1.5 * s + (1 - s), 0.2 * s, 0, 0.15 * s,  // 緑を強調
      0.2 * s, 0.2 * s, 1.5 * s + (1 - s), 0, 0.15 * s,  // 青を強調
      0, 0, 0, 1, 0,
    ];
  }, [sparkleIntensity]);

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
        opacity={opacity * 0.6}
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
        opacity={opacity * 0.7}
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
        opacity={opacity * 0.5}
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
        opacity={opacity * 0.6}
        {...(!isBaseLayer && { blendMode: 'lighten' })}
      >
        <ColorMatrix matrix={highlightMatrix} />
      </Image>
    </Group>
  );
});

GlitteryFilter.displayName = 'GlitteryFilter';

export default GlitteryFilter;