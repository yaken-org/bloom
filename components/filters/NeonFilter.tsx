import { ColorMatrix, Group, Image } from "@shopify/react-native-skia";
import React, { useMemo } from "react";
import type { FilterComponentProps } from "@/types/filters";

const NeonFilter: React.FC<FilterComponentProps> = React.memo(
  ({ image, width, height, isBaseLayer = true, options = {} }) => {
    const { opacity = 0.85, intensity = 1.0 } = options;

    const neonMatrix = useMemo(() => {
      const i = intensity;
      return [
        1.4*i, 0, 0, 0, 0,
        0, 1.1*i, 0, 0, 0,
        0, 0, 1.6*i, 0, 0,
        0, 0, 0, 1, 0,
      ];
    }, [intensity]);

    return (
      <Group>
        {isBaseLayer && <Image image={image} x={0} y={0} width={width} height={height} fit="cover" />}
        <Image image={image} x={0} y={0} width={width} height={height} fit="cover" opacity={opacity}>
          <ColorMatrix matrix={neonMatrix} />
        </Image>
      </Group>
    );
  }
);

NeonFilter.displayName = "NeonFilter";
export default NeonFilter;
