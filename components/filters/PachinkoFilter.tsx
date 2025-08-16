import { ColorMatrix, Group, Image } from "@shopify/react-native-skia";
import React, { useMemo } from "react";
import type { FilterComponentProps } from "@/types/filters";

const pachinkoGlowImage = require("@/assets/filters/pachinkoGlow.png");
const whiteGradientImage = require("@/assets/filters/whiteGradient.png");
const glitterImage = require("@/assets/filters/glitter.png");

const PachinkoFilter: React.FC<FilterComponentProps> = React.memo(
  ({ image, width, height, isBaseLayer = true, options = {} }) => {
    const { opacity = 0.85, intensity = 1.0 } = options;

    const pachinkoMatrix = useMemo(() => {
      const i = intensity;
      return [
        1.35*i, 0, 0, 0, 0,
        0, 1.35*i, 0, 0, 0,
        0, 0, 1.5*i, 0, 0,
        0, 0, 0, 1, 0,
      ];
    }, [intensity]);

    return (
      <Group>
        {isBaseLayer && <Image image={image} x={0} y={0} width={width} height={height} fit="cover" />}

        <Image image={image} x={0} y={0} width={width} height={height} fit="cover" opacity={opacity*0.6}>
          <ColorMatrix matrix={pachinkoMatrix} />
        </Image>

        <Image image={whiteGradientImage} x={0} y={0} width={width} height={height} fit="cover" opacity={opacity*0.2} blendMode="screen" />
        <Image image={pachinkoGlowImage} x={0} y={0} width={width} height={height} fit="cover" opacity={opacity*0.35} blendMode="screen" />
        <Image image={glitterImage} x={0} y={0} width={width} height={height} fit="cover" opacity={opacity*0.25} blendMode="screen" />
      </Group>
    );
  }
);

PachinkoFilter.displayName = "PachinkoFilter";
export default PachinkoFilter;
