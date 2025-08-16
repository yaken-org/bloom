import { ColorMatrix, Group, Image } from "@shopify/react-native-skia";
import React, { useMemo } from "react";
import type { FilterComponentProps } from "@/types/filters";

const JewelFilter: React.FC<FilterComponentProps> = React.memo(
  ({ image, width, height, isBaseLayer = true, options = {} }) => {
    const { opacity = 0.95, intensity = 1.0 } = options;

    const jewelMatrix = useMemo(() => {
      const i = intensity;
      return [
        2.5 * i, 0, 0.5 * i, 0, 0,
        0.5 * i, 2.5 * i, 0, 0, 0,
        0, 0.5 * i, 2.5 * i, 0, 0,
        0, 0, 0, 1, 0,
      ];
    }, [intensity]);

    const shineMatrix = useMemo(() => {
      const i = intensity;
      return [
        3.0 * i, 0, 0, 0, -0.1,
        0, 3.0 * i, 0, 0, -0.1,
        0, 0, 3.0 * i, 0, -0.1,
        0, 0, 0, 1, 0,
      ];
    }, [intensity]);

    return (
      <Group>
        {isBaseLayer && (
          <Image image={image} x={0} y={0} width={width} height={height} fit="cover" />
        )}
        <Image image={image} x={0} y={0} width={width} height={height} fit="cover" opacity={opacity} blendMode="screen">
          <ColorMatrix matrix={jewelMatrix} />
        </Image>
        <Image image={image} x={0} y={0} width={width} height={height} fit="cover" opacity={opacity * 0.85} blendMode="overlay">
          <ColorMatrix matrix={shineMatrix} />
        </Image>
      </Group>
    );
  }
);

JewelFilter.displayName = "JewelFilter";
export default JewelFilter;
