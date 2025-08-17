import { ColorMatrix, Group, Image } from "@shopify/react-native-skia";
import React, { useMemo } from "react";
import type { FilterComponentProps } from "@/types/filters";

/**
 * RainbowNeonGradientFilter - 横方向にネオン発色の虹色グラデーション
 */
const RainbowNeonGradientFilter: React.FC<FilterComponentProps> = React.memo(
  ({ image, width, height, isBaseLayer = true, options = {} }) => {
    const { opacity = 1.0, intensity = 1.0 } = options;

    const baseIntensity = 1.2 * intensity; // 色の強さ

    const leftMatrix = useMemo(
      () => [
        1.6 * baseIntensity,
        0,
        0,
        0,
        0, // 赤強め
        0,
        0.6 * baseIntensity,
        0,
        0,
        0,
        0,
        0,
        0.8 * baseIntensity,
        0,
        0,
        0,
        0,
        0,
        1,
        0,
      ],
      [baseIntensity],
    );

    const centerMatrix = useMemo(
      () => [
        0.8 * baseIntensity,
        0,
        0,
        0,
        0,
        0,
        1.5 * baseIntensity,
        0,
        0,
        0, // 緑強め
        0,
        0,
        0.8 * baseIntensity,
        0,
        0,
        0,
        0,
        0,
        1,
        0,
      ],
      [baseIntensity],
    );

    const rightMatrix = useMemo(
      () => [
        0.8 * baseIntensity,
        0,
        0,
        0,
        0,
        0,
        0.8 * baseIntensity,
        0,
        0,
        0,
        0,
        0,
        1.6 * baseIntensity,
        0,
        0, // 青強め
        0,
        0,
        0,
        1,
        0,
      ],
      [baseIntensity],
    );

    return (
      <Group>
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

        {/* 左側赤 */}
        <Image
          image={image}
          x={0}
          y={0}
          width={width}
          height={height}
          fit="cover"
          opacity={opacity * 0.4}
        >
          <ColorMatrix matrix={leftMatrix} />
        </Image>

        {/* 中央緑 */}
        <Image
          image={image}
          x={0}
          y={0}
          width={width}
          height={height}
          fit="cover"
          opacity={opacity * 0.4}
        >
          <ColorMatrix matrix={centerMatrix} />
        </Image>

        {/* 右側青 */}
        <Image
          image={image}
          x={0}
          y={0}
          width={width}
          height={height}
          fit="cover"
          opacity={opacity * 0.4}
        >
          <ColorMatrix matrix={rightMatrix} />
        </Image>
      </Group>
    );
  },
);

RainbowNeonGradientFilter.displayName = "RainbowNeonGradientFilter";

export default RainbowNeonGradientFilter;
