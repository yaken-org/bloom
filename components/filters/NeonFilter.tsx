import { ColorMatrix, Group, Image } from "@shopify/react-native-skia";
import React, { useMemo } from "react";
import type { FilterComponentProps } from "@/types/filters";

const NeonFilter: React.FC<FilterComponentProps> = React.memo(
  ({ image, width, height, isBaseLayer = true, options = {} }) => {
    const { opacity = 0.9, intensity = 1.0 } = options;

    const neonMatrix = useMemo(() => {
      const i = intensity;
      return [
        1.8 * i, 0, 0.3 * i, 0, 0,
        0.3 * i, 1.8 * i, 0, 0, 0,
        0, 0.3 * i, 1.8 * i, 0, 0,
        0, 0, 0, 1, 0,
      ];
    }, [intensity]);

    const glowMatrix = useMemo(() => {
      const i = intensity;
      return [
        2.2 * i, 0, 0, 0, 0,
        0, 2.2 * i, 0, 0, 0,
        0, 0, 2.2 * i, 0, 0,
        0, 0, 0, 1, 0,
      ];
    }, [intensity]);

    return (
      <Group>
        {isBaseLayer && (
          <Image image={image} x={0} y={0} width={width} height={height} fit="cover" />
        )}
        <Image image={image} x={0} y={0} width={width} height={height} fit="cover" opacity={opacity} blendMode="screen">
          <ColorMatrix matrix={neonMatrix} />
        </Image>
        <Image image={image} x={0} y={0} width={width} height={height} fit="cover" opacity={opacity * 0.9} blendMode="overlay">
          <ColorMatrix matrix={glowMatrix} />
        </Image>
      </Group>
    );
  }
);

NeonFilter.displayName = "NeonFilter";
export default NeonFilter;
