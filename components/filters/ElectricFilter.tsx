import { ColorMatrix, Group, Image } from "@shopify/react-native-skia";
import React, { useMemo } from "react";
import type { FilterComponentProps } from "@/types/filters";

const ElectricFilter: React.FC<FilterComponentProps> = React.memo(
  ({ image, width, height, isBaseLayer = true, options = {} }) => {
    const { opacity = 0.8, intensity = 1.0 } = options;

    const s = intensity;
    const b = 0.7;

    const electricMatrix = useMemo(() => {
      const i = s;
      return [
        b + 0.8 * i, 0.6 * i, 0.2 * i, 0, 0, // R
        0.3 * i, b + 1.4 * i, 0.3 * i, 0, 0, // G
        0.1 * i, 0.5 * i, b + 1.5 * i, 0, 0, // B
        0, 0, 0, 1, 0,
      ];
    }, [s, b]);

    return (
      <Group>
        {isBaseLayer && <Image image={image} x={0} y={0} width={width} height={height} fit="cover" />}
        <Image image={image} x={0} y={0} width={width} height={height} fit="cover" opacity={opacity}>
          <ColorMatrix matrix={electricMatrix} />
        </Image>
      </Group>
    );
  }
);

ElectricFilter.displayName = "ElectricFilter";
export default ElectricFilter;
