import React, { useMemo } from 'react';
import {
  Image,
  ColorMatrix,
  Group,
} from '@shopify/react-native-skia';
import type { FilterComponentProps } from '@/types/filters';

/**
 * セピアフィルター
 * 写真にビンテージな茶色がかった効果を適用
 */
const SepiaFilter: React.FC<FilterComponentProps> = ({
  image,
  width,
  height,
  isBaseLayer = true,
}) => {
  // セピア効果のカラーマトリックス
  const sepiaMatrix = useMemo(() => [
    0.393, 0.769, 0.189, 0, 0,
    0.349, 0.686, 0.168, 0, 0,
    0.272, 0.534, 0.131, 0, 0,
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
      
      {/* セピア効果を適用 */}
      <Image
        image={image}
        x={0}
        y={0}
        width={width}
        height={height}
        fit="cover"
        opacity={0.8}
        {...(!isBaseLayer && { blendMode: 'overlay' })}
      >
        <ColorMatrix matrix={sepiaMatrix} />
      </Image>
    </Group>
  );
};

export default SepiaFilter;
