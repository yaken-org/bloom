import { ColorMatrix, Group, Image } from "@shopify/react-native-skia";
import React, { useMemo } from "react";
import type { FilterComponentProps } from "@/types/filters";

const electricGlowImage = require("@/assets/filters/electricGlow.png");
const whiteGradientImage = require("@/assets/filters/whiteGradient.png");
const glitterImage = require("@/assets/filters/glitter.png");

const ElectricFilter: React.FC<FilterComponentProps> = React.memo(
  ({ image, width, height, isBaseLayer = true, options = {} }) => {
    const { opacity = 0.85, intensity = 1.0 } = options;

    const electricMatrix = useMemo(() => {
      const i = intensity;
      return [
        1.4 * i,
        0,
        0,
        0,
        0,
        0,
        1.4 * i,
        0,
        0,
        0,
        0,
        0,
        1.6 * i,
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
          <ColorMatrix matrix={electricMatrix} />
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
          image={electricGlowImage}
          x={0}
          y={0}
          width={width}
          height={height}
          fit="cover"
          opacity={opacity * 0.35}
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

ElectricFilter.displayName = "ElectricFilter";
export default ElectricFilter;
