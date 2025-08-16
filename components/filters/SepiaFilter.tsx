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
const SepiaFilter: React.FC<FilterComponentProps> = React.memo(({
  image,
  width,
  height,
  isBaseLayer = true,
  options = {},
}) => {
  const { opacity = 0.8, intensity = 1.0 } = options;
  
  // セピア効果のカラーマトリックス（強度に応じて調整）
  const sepiaMatrix = useMemo(() => {
    const i = intensity;
    return [
      0.393 * i + (1 - i), 0.769 * i, 0.189 * i, 0, 0,
      0.349 * i, 0.686 * i + (1 - i), 0.168 * i, 0, 0,
      0.272 * i, 0.534 * i, 0.131 * i + (1 - i), 0, 0,
      0, 0, 0, 1, 0,
    ];
  }, [intensity]);

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
        opacity={opacity}
        {...(!isBaseLayer && { blendMode: 'overlay' })}
      >
        <ColorMatrix matrix={sepiaMatrix} />
      </Image>
    </Group>
  );
});

SepiaFilter.displayName = 'SepiaFilter';

export default SepiaFilter;
