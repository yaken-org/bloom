import { ColorMatrix, Group, Image } from "@shopify/react-native-skia";
import React, { useMemo } from "react";
import type { FilterComponentProps } from "@/types/filters";

const DazzlingFilter: React.FC<FilterComponentProps> = React.memo(
  ({ image, width, height, isBaseLayer = true, options = {} }) => {
    const { opacity = 0.9, intensity = 1.0 } = options;

    const dazzlingMatrix = useMemo(() => {
      const i = intensity;
      return [
        1.8 * i, 0, 0, 0, 0,
        0, 1.8 * i, 0, 0, 0,
        0, 0, 1.8 * i, 0, 0,
        0, 0, 0, 1, 0,
      ];
    }, [intensity]);

    const contrastMatrix = useMemo(() => {
      const i = intensity;
      return [
        2.5 * i, 0, 0, 0, -0.2,
        0, 2.5 * i, 0, 0, -0.2,
        0, 0, 2.5 * i, 0, -0.2,
        0, 0, 0, 1, 0,
      ];
    }, [intensity]);

    return (
      <Group>
        {isBaseLayer && (
          <Image image={image} x={0} y={0} width={width} height={height} fit="cover" />
        )}
        <Image image={image} x={0} y={0} width={width} height={height} fit="cover" opacity={opacity} blendMode="screen">
          <ColorMatrix matrix={dazzlingMatrix} />
        </Image>
        <Image image={image} x={0} y={0} width={width} height={height} fit="cover" opacity={opacity * 0.7} blendMode="overlay">
          <ColorMatrix matrix={contrastMatrix} />
        </Image>
      </Group>
    );
  }
);

DazzlingFilter.displayName = "DazzlingFilter";
export default DazzlingFilter;
