import { ColorMatrix, Group, Image } from "@shopify/react-native-skia";
import React, { useMemo } from "react";
import type { FilterComponentProps } from "@/types/filters";

/**
 * DazzlingFilter
 * ゴールド・白系の眩しい光を中心に派手ギラギラ
 */
const DazzlingFilter: React.FC<FilterComponentProps> = React.memo(
  ({ image, width, height, isBaseLayer = true, options = {} }) => {
    const { opacity = 0.9, intensity = 1.0 } = options;

    const goldMatrix = useMemo(() => {
      const i = intensity;
      return [
        1.3 * i + (1 - i), 0.2 * i, 0, 0, 0.05 * i,
        0.1 * i, 1.2 * i + (1 - i), 0.1 * i, 0, 0.05 * i,
        0, 0.1 * i, 1.4 * i + (1 - i), 0, 0.05 * i,
        0, 0, 0, 1, 0,
      ];
    }, [intensity]);

    const contrastMatrix = useMemo(() => {
      const i = intensity;
      return [
        1.5 * i + (1 - i), 0, 0, 0, -0.05 * i,
        0, 1.4 * i + (1 - i), 0, 0, -0.05 * i,
        0, 0, 1.6 * i + (1 - i), 0, -0.05 * i,
        0, 0, 0, 1, 0,
      ];
    }, [intensity]);

    return (
      <Group>
        {isBaseLayer && (
          <Image image={image} x={0} y={0} width={width} height={height} fit="cover" />
        )}

        <Image image={image} x={0} y={0} width={width} height={height} fit="cover" opacity={opacity}>
          <ColorMatrix matrix={goldMatrix} />
        </Image>

        <Image
          image={image}
          x={0}
          y={0}
          width={width}
          height={height}
          fit="cover"
          opacity={opacity * 0.7}
          blendMode="screen"
        >
          <ColorMatrix matrix={contrastMatrix} />
        </Image>
      </Group>
    );
  }
);

DazzlingFilter.displayName = "DazzlingFilter";
export default DazzlingFilter;
