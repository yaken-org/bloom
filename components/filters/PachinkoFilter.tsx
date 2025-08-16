import { ColorMatrix, Group, Image } from "@shopify/react-native-skia";
import React, { useMemo } from "react";
import type { FilterComponentProps } from "@/types/filters";

const PachinkoFilter: React.FC<FilterComponentProps> = React.memo(
  ({ image, width, height, isBaseLayer = true, options = {} }) => {
    const { opacity = 0.85, intensity = 1.0 } = options;

    const pachinkoMatrix = useMemo(() => {
      const i = intensity;
      return [
        1.5*i, 0, 0, 0, 0,
        0, 1.6*i, 0, 0, 0,
        0, 0, 1.2*i, 0, 0,
        0, 0, 0, 1, 0,
      ];
    }, [intensity]);

    return (
      <Group>
        {isBaseLayer && <Image image={image} x={0} y={0} width={width} height={height} fit="cover" />}
        <Image image={image} x={0} y={0} width={width} height={height} fit="cover" opacity={opacity}>
          <ColorMatrix matrix={pachinkoMatrix} />
        </Image>
      </Group>
    );
  }
);

PachinkoFilter.displayName = "PachinkoFilter";
export default PachinkoFilter;
