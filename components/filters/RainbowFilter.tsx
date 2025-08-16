import { ColorMatrix, Group, Image } from "@shopify/react-native-skia";
import React, { useMemo } from "react";
import type { FilterComponentProps } from "@/types/filters";

/**
 * RainbowFilter
 * 写真に鮮やかで虹のような色合いを適用
 */
const RainbowFilter: React.FC<FilterComponentProps> = React.memo(
  ({ image, width, height, isBaseLayer = true, options = {} }) => {
    const { opacity = 0.8, intensity = 1.0 } = options;

    // 彩度・明度・色相回転を強調するカラーマトリックス
    const rainbowMatrix = useMemo(() => {
      const i = intensity;
      return [
        1.8 * i, 0, 0, 0, 0,  // R
        0, 2.0 * i, 0, 0, 0,  // G
        0, 0, 3.0 * i, 0, 0,  // B
        0, 0, 0, 1, 0,         // A
      ];
    }, [intensity]);

    // 色相回転を追加（擬似的に RGB 操作で虹っぽく）
    const hueShiftMatrix = useMemo(() => {
      const angle = (120 * Math.PI) / 180; // 120deg
      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);
      return [
        0.299 + 0.701 * cosA + -0.168 * sinA, 0.587 - 0.587 * cosA + -0.330 * sinA, 0.114 - 0.114 * cosA + 0.498 * sinA, 0, 0,
        0.299 - 0.299 * cosA + 0.143 * sinA, 0.587 + 0.413 * cosA + 0.140 * sinA, 0.114 - 0.114 * cosA - 0.283 * sinA, 0, 0,
        0.299 - 0.300 * cosA - 0.328 * sinA, 0.587 - 0.588 * cosA + 0.328 * sinA, 0.114 + 0.886 * cosA + 0.000 * sinA, 0, 0,
        0, 0, 0, 1, 0,
      ];
    }, []);

    return (
      <Group>
        {/* ベース画像 */}
        {isBaseLayer && (
          <Image image={image} x={0} y={0} width={width} height={height} fit="cover" />
        )}

        {/* 彩度・明度調整 */}
        <Image
          image={image}
          x={0}
          y={0}
          width={width}
          height={height}
          fit="cover"
          opacity={opacity * 0.7}
          {...(!isBaseLayer && { blendMode: "overlay" })}
        >
          <ColorMatrix matrix={rainbowMatrix} />
        </Image>

        {/* 色相回転で虹色効果 */}
        <Image
          image={image}
          x={0}
          y={0}
          width={width}
          height={height}
          fit="cover"
          opacity={opacity * 0.5}
          {...(!isBaseLayer && { blendMode: "screen" })}
        >
          <ColorMatrix matrix={hueShiftMatrix} />
        </Image>
      </Group>
    );
  }
);

RainbowFilter.displayName = "RainbowFilter";
export default RainbowFilter;
