import { ColorMatrix, Group, Image } from "@shopify/react-native-skia";
import React, { useMemo } from "react";
import type { FilterComponentProps } from "@/types/filters";

/**
 * Electricフィルター
 * 強いコントラストと蛍光カラーで電気的なビビッド感を演出
 */
const ElectricFilter: React.FC<FilterComponentProps> = React.memo(
  ({ image, width, height, isBaseLayer = true, options = {} }) => {
    const { opacity = 0.85, intensity = 1.0 } = options;

    // ビビッドブルー・イエロー強調マトリックス
    const electricMatrix = useMemo(() => {
      const i = intensity;
      return [
        2.4 * i, 0, 0, 0, 0,   // 赤をやや強め
        0, 2.5 * i, 0, 0, 0,   // 緑を強め
        0, 0, 3.0 * i, 0, 0,   // 青を最大限強め
        0, 0, 0, 1, 0,
      ];
    }, [intensity]);

    // 輝きと彩度の微調整
    const glowMatrix = useMemo(() => {
      const i = intensity;
      return [
        1.2 * i, 0, 0, 0, 0.05 * i,
        0, 1.2 * i, 0, 0, 0.05 * i,
        0, 0, 1.5 * i, 0, 0.1 * i,
        0, 0, 0, 1, 0,
      ];
    }, [intensity]);

    return (
      <Group>
        {/* ベースレイヤー */}
        {isBaseLayer && (
          <Image image={image} x={0} y={0} width={width} height={height} fit="cover" />
        )}

        {/* Electricカラー強調 */}
        <Image
          image={image}
          x={0}
          y={0}
          width={width}
          height={height}
          fit="cover"
          opacity={opacity * 0.7}
          {...(!isBaseLayer && { blendMode: "multiply" })}
        >
          <ColorMatrix matrix={electricMatrix} />
        </Image>

        {/* 輝き・ネオン風調整 */}
        <Image
          image={image}
          x={0}
          y={0}
          width={width}
          height={height}
          fit="cover"
          opacity={opacity * 0.5}
          {...(!isBaseLayer && { blendMode: "overlay" })}
        >
          <ColorMatrix matrix={glowMatrix} />
        </Image>
      </Group>
    );
  }
);

ElectricFilter.displayName = "ElectricFilter";

export default ElectricFilter;
