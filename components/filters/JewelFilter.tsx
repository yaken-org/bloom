import { ColorMatrix, Group, Image } from "@shopify/react-native-skia";
import React, { useMemo } from "react";
import type { FilterComponentProps } from "@/types/filters";

/**
 * JewelFilter
 * 宝石のように鮮やかで華やかな効果を写真に適用
 */
const JewelFilter: React.FC<FilterComponentProps> = React.memo(
  ({ image, width, height, isBaseLayer = true, options = {} }) => {
    const { opacity = 0.7, intensity = 1.0 } = options;

    // 彩度・コントラスト強め、色相を少しずらすマトリックス
    const jewelMatrix = useMemo(() => {
      const i = intensity;
      return [
        2.0 * i, 0, 0, 0, 0,        // 赤
        0, 2.2 * i, 0, 0, 0,        // 緑
        0, 0, 2.5 * i, 0, 0.05 * i, // 青、青に少しシフト
        0, 0, 0, 1, 0,
      ];
    }, [intensity]);

    return (
      <Group>
        {/* ベース画像 */}
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

        {/* 宝石トーン */}
        <Image
          image={image}
          x={0}
          y={0}
          width={width}
          height={height}
          fit="cover"
          opacity={opacity}
          {...(!isBaseLayer && { blendMode: "overlay" })}
        >
          <ColorMatrix matrix={jewelMatrix} />
        </Image>
      </Group>
    );
  }
);

JewelFilter.displayName = "JewelFilter";
export default JewelFilter;
