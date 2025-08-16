import { ColorMatrix, Group, Image } from "@shopify/react-native-skia";
import React, { useMemo } from "react";
import type { FilterComponentProps } from "@/types/filters";

const JewelFilter: React.FC<FilterComponentProps> = React.memo(
  ({ image, width, height, isBaseLayer = true, options = {} }) => {
    const { opacity = 0.9, intensity = 1.0 } = options;

    const jewelMatrix = useMemo(() => {
      const i = intensity;
      return [
        1.6*i, 0, 0, 0, 0,
        0, 1.4*i, 0, 0, 0,
        0, 0, 1.8*i, 0, 0,
        0, 0, 0, 1, 0,
      ];
    }, [intensity]);

    return (
      <Group>
        {isBaseLayer && <Image image={image} x={0} y={0} width={width} height={height} fit="cover" />}
        <Image image={image} x={0} y={0} width={width} height={height} fit="cover" opacity={opacity}>
          <ColorMatrix matrix={jewelMatrix} />
        </Image>
      </Group>
    );
  }
);

JewelFilter.displayName = "JewelFilter";
export default JewelFilter;
