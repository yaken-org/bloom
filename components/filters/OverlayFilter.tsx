import React from 'react';
import {
  Image,
  Group,
  useImage,
} from '@shopify/react-native-skia';
import type { OverlayFilterProps } from '@/types/filters';

const OverlayFilter: React.FC<OverlayFilterProps> = ({
  image,
  width,
  height,
  overlayImageUrl,
  blendMode = 'multiply',
  opacity = 0.5,
  isBaseLayer = true,
}) => {
  const overlayImage = useImage(overlayImageUrl);

  return (
    <Group>
      {/* ベース画像 - ベースレイヤーの場合のみ表示 */}
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

      {/* オーバーレイ画像 */}
      {overlayImage && (
        <Image
          image={overlayImage}
          x={0}
          y={0}
          width={width}
          height={height}
          fit="cover"
          opacity={opacity}
          blendMode={blendMode}
        />
      )}
    </Group>
  );
};

export default OverlayFilter;