import { ColorMatrix, Group, Image } from "@shopify/react-native-skia";
import React, { useMemo } from "react";
import type { FilterComponentProps } from "@/types/filters";

const JewelFilter: React.FC<FilterComponentProps> = React.memo(
  ({ image, width, height, isBaseLayer = true, options = {} }) => {
    const { opacity = 0.8, intensity = 1.0 } = options;

    const s = intensity;

    const jewelMatrix = useMemo(() => {
        const b = 0.7;
        const i = s;
        return [
            b + 1.2 * i,
            0.4 * i,
            0.5 * i,
            0,
            0,
            0.3 * i,
            b + 1.3 * i,
            0.4 * i,
            0,
            0,
            0.4 * i,
            0.3 * i,
            b + 1.4 * i,
            0,
            0,
            0,
            0,
            0,
            1,
            0,
        ];
    }, [s]);

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
          opacity={opacity}
        >
          <ColorMatrix matrix={jewelMatrix} />
        </Image>
      </Group>
    );
  },
);

JewelFilter.displayName = "JewelFilter";
export default JewelFilter;
