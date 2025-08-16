import { ColorMatrix, Group, Image } from "@shopify/react-native-skia";
import React, { useMemo } from "react";
import type { FilterComponentProps } from "@/types/filters";

const ElectricFilter: React.FC<FilterComponentProps> = React.memo(
  ({ image, width, height, isBaseLayer = true, options = {} }) => {
    const { opacity = 0.9, intensity = 1.0 } = options;

    const electricMatrix = useMemo(() => {
      const i = intensity;
      return [
        1.9 * i, 0, 0.1 * i, 0, 0,
        0.1 * i, 1.9 * i, 0, 0, 0,
        0, 0.1 * i, 1.9 * i, 0, 0,
        0, 0, 0, 1, 0,
      ];
    }, [intensity]);

    const flashMatrix = useMemo(() => {
      const i = intensity;
      return [
        2.5 * i, 0, 0, 0, -0.1,
        0, 2.5 * i, 0, 0, -0.1,
        0, 0, 2.5 * i, 0, -0.1,
        0, 0, 0, 1, 0,
      ];
    }, [intensity]);

    return (
      <Group>
        {isBaseLayer && (
          <Image image={image} x={0} y={0} width={width} height={height} fit="cover" />
        )}
        <Image image={image} x={0} y={0} width={width} height={height} fit="cover" opacity={opacity} blendMode="screen">
          <ColorMatrix matrix={electricMatrix} />
        </Image>
        <Image image={image} x={0} y={0} width={width} height={height} fit="cover" opacity={opacity * 0.8} blendMode="overlay">
          <ColorMatrix matrix={flashMatrix} />
        </Image>
      </Group>
    );
  }
);

ElectricFilter.displayName = "ElectricFilter";
export default ElectricFilter;
