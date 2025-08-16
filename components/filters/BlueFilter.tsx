import React, { useMemo } from 'react';
import {
  Image,
  ColorMatrix,
  Group,
} from '@shopify/react-native-skia';
import type { FilterComponentProps } from '@/types/filters';

/**
 * ブルーフィルター
 * 写真にクールで青みがかった効果を適用
 */
const BlueFilter: React.FC<FilterComponentProps> = ({
  image,
  width,
  height,
  isBaseLayer = true,
}) => {
  // ブルートーン強調のカラーマトリックス
  const blueEnhanceMatrix = useMemo(() => [
    0.8, 0.1, 0.1, 0, 0,     // 赤を抑制
    0.0, 0.9, 0.1, 0, 0,     // 緑を少し抑制
    0.0, 0.2, 1.4, 0, 0.1,   // 青を強調
    0, 0, 0, 1, 0,
  ], []);

  // 彩度とコントラストの調整
  const coolToneMatrix = useMemo(() => [
    1.1, 0.0, 0.0, 0, -0.02,
    0.0, 1.0, 0.1, 0, 0.0,
    0.1, 0.1, 1.3, 0, 0.05,
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
      
      {/* ブルートーン強調 */}
      <Image
        image={image}
        x={0}
        y={0}
        width={width}
        height={height}
        fit="cover"
        opacity={0.7}
        {...(!isBaseLayer && { blendMode: 'multiply' })}
      >
        <ColorMatrix matrix={blueEnhanceMatrix} />
      </Image>

      {/* クールトーンの微調整 */}
      <Image
        image={image}
        x={0}
        y={0}
        width={width}
        height={height}
        fit="cover"
        opacity={0.5}
        {...(!isBaseLayer && { blendMode: 'overlay' })}
      >
        <ColorMatrix matrix={coolToneMatrix} />
      </Image>
    </Group>
  );
};

export default BlueFilter;
