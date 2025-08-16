import { ColorMatrix, Group, Image } from "@shopify/react-native-skia";
import React, { useMemo } from "react";
import type { FilterComponentProps } from "@/types/filters";

const whiteGradientImage = require("@/assets/filters/whiteGradient.png");
const rainbowFlareImage = require("@/assets/filters/rainbowFlare.png");
const glitterImage = require("@/assets/filters/glitter.png");

const RainbowFilter: React.FC<FilterComponentProps> = React.memo(
  ({ image, width, height, isBaseLayer = true, options = {} }) => {
    const { opacity = 0.8, intensity = 1.0 } = options;

    // 彩度強化・色相回転
    const rainbowMatrix = useMemo(() => {
      const i = intensity;
      return [
        1.2 * i,
        0,
        0,
        0,
        0,
        0,
        1.2 * i,
        0,
        0,
        0,
        0,
        0,
        1.2 * i,
        0,
        0,
        0,
        0,
        0,
        1,
        0,
      ];
    }, [intensity]);

    return (
      <Group>
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

        <Image
          image={image}
          x={0}
          y={0}
          width={width}
          height={height}
          fit="cover"
          opacity={opacity * 0.6}
        >
          <ColorMatrix matrix={rainbowMatrix} />
        </Image>

        <Image
          image={whiteGradientImage}
          x={0}
          y={0}
          width={width}
          height={height}
          fit="cover"
          opacity={opacity * 0.2}
          blendMode="screen"
        />
        <Image
          image={rainbowFlareImage}
          x={0}
          y={0}
          width={width}
          height={height}
          fit="cover"
          opacity={opacity * 0.3}
          blendMode="screen"
        />
        <Image
          image={glitterImage}
          x={0}
          y={0}
          width={width}
          height={height}
          fit="cover"
          opacity={opacity * 0.25}
          blendMode="screen"
        />
      </Group>
    );
  },
);

RainbowFilter.displayName = "RainbowFilter";
export default RainbowFilter;
