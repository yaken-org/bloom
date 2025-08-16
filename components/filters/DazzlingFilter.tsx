import { ColorMatrix, Group, Image } from "@shopify/react-native-skia";
import React, { useMemo } from "react";
import type { FilterComponentProps } from "@/types/filters";

/**
 * DazzlingFilter - 超派手ギラギラ版
 * ゴールド・白系の眩しい光を中心に派手ギラギラ
 */
const DazzlingFilter: React.FC<FilterComponentProps> = React.memo(
  ({ image, width, height, isBaseLayer = true, options = {} }) => {
    const { opacity = 1.0, intensity = 1.0 } = options;

    // RGB強調＋ゴールド・白ハイライト
    const dazzlingMatrix = useMemo(() => {
      const i = intensity;
      return [
        1.8*i, 0.3*i, 0.1*i, 0, 0.1*i,
        0.2*i, 1.7*i, 0.2*i, 0, 0.1*i,
        0.1*i, 0.2*i, 2.0*i, 0, 0.1*i,
        0, 0, 0, 1, 0,
      ];
    }, [intensity]);

    // コントラスト・光の広がり用
    const glowMatrix = useMemo(() => {
      const i = intensity;
      return [
        2.0*i, 0.2*i, 0.1*i, 0, 0,
        0.2*i, 2.0*i, 0.2*i, 0, 0,
        0.1*i, 0.2*i, 2.0*i, 0, 0,
        0, 0, 0, 1, 0,
      ];
    }, [intensity]);

    return (
      <Group>
        {isBaseLayer && (
          <Image image={image} x={0} y={0} width={width} height={height} fit="cover" />
        )}

        <Image image={image} x={0} y={0} width={width} height={height} fit="cover" opacity={opacity}>
          <ColorMatrix matrix={dazzlingMatrix} />
        </Image>

        <Image
          image={image}
          x={0} y={0} width={width} height={height} fit="cover"
          opacity={opacity*0.8} blendMode="screen"
        >
          <ColorMatrix matrix={glowMatrix} />
        </Image>
      </Group>
    );
  }
);

DazzlingFilter.displayName = "DazzlingFilter";
export default DazzlingFilter;
