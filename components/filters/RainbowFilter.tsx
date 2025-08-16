import { ColorMatrix, Group, Image } from "@shopify/react-native-skia";
import React, { useMemo } from "react";
import type { FilterComponentProps } from "@/types/filters";

/**
 * RainbowFilter
 * 虹色グラデーション＋発光感で超カラフル
 */
const RainbowFilter: React.FC<FilterComponentProps> = React.memo(
  ({ image, width, height, isBaseLayer = true, options = {} }) => {
    const { opacity = 0.8, intensity = 1.0 } = options;

    const rainbowMatrix = useMemo(() => {
      const i = intensity;
      return [
        1.5*i, 0.0, 0.2*i, 0, 0.0,
        0.0, 1.5*i, 0.2*i, 0, 0.0,
        0.2*i, 0.2*i, 1.5*i, 0, 0.0,
        0, 0, 0, 1, 0,
      ];
    }, [intensity]);

    const glowMatrix = useMemo(() => {
      const i = intensity;
      return [
        1.3*i, 0.1*i, 0.1*i, 0, 0,
        0.1*i, 1.3*i, 0.1*i, 0, 0,
        0.1*i, 0.1*i, 1.3*i, 0, 0,
        0,0,0,1,0,
      ];
    }, [intensity]);

    return (
      <Group>
        {isBaseLayer && (
          <Image image={image} x={0} y={0} width={width} height={height} fit="cover" />
        )}

        <Image image={image} x={0} y={0} width={width} height={height} fit="cover" opacity={opacity}>
          <ColorMatrix matrix={rainbowMatrix} />
        </Image>

        <Image
          image={image}
          x={0}
          y={0}
          width={width}
          height={height}
          fit="cover"
          opacity={opacity*0.6}
          blendMode="screen"
        >
          <ColorMatrix matrix={glowMatrix} />
        </Image>
      </Group>
    );
  }
);

RainbowFilter.displayName = "RainbowFilter";
export default RainbowFilter;
