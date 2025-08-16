import { ColorMatrix, Group, Image } from "@shopify/react-native-skia";
import React, { useMemo } from "react";
import type { FilterComponentProps } from "@/types/filters";

const PachinkoFilter: React.FC<FilterComponentProps> = React.memo(
  ({ image, width, height, isBaseLayer = true, options = {} }) => {
    const { opacity = 0.9, intensity = 1.0 } = options;

    const pachinkoMatrix = useMemo(() => {
      const i = intensity;
      return [
        2.0 * i, 0.2 * i, 0, 0, 0,
        0.2 * i, 2.0 * i, 0, 0, 0,
        0, 0, 2.0 * i, 0, 0,
        0, 0, 0, 1, 0,
      ];
    }, [intensity]);

    const sparkleMatrix = useMemo(() => {
      const i = intensity;
      return [
        2.2 * i, 0, 0.2 * i, 0, 0,
        0, 2.2 * i, 0.2 * i, 0, 0,
        0.2 * i, 0, 2.2 * i, 0, 0,
        0, 0, 0, 1, 0,
      ];
    }, [intensity]);

    return (
      <Group>
        {isBaseLayer && (
          <Image image={image} x={0} y={0} width={width} height={height} fit="cover" />
        )}
        <Image image={image} x={0} y={0} width={width} height={height} fit="cover" opacity={opacity} blendMode="screen">
          <ColorMatrix matrix={pachinkoMatrix} />
        </Image>
        <Image image={image} x={0} y={0} width={width} height={height} fit="cover" opacity={opacity * 0.9} blendMode="overlay">
          <ColorMatrix matrix={sparkleMatrix} />
        </Image>
      </Group>
    );
  }
);

PachinkoFilter.displayName = "PachinkoFilter";
export default PachinkoFilter;
