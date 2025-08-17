import { ColorMatrix, Group, Image } from "@shopify/react-native-skia";
import React, { useMemo } from "react";
import type { FilterComponentProps } from "@/types/filters";

/**
 * DarkFilter - 黒っぽく落ち着いた暗めフィルター
 */
const DarkFilter: React.FC<FilterComponentProps> = React.memo(
  ({ image, width, height, isBaseLayer = true, options = {} }) => {
    const { opacity = 0.85, intensity = 1.0 } = options;

    // 彩度・光量・コントラストを黒っぽく調整
    const darkMatrix = useMemo(() => {
      const s = 0.6 * intensity; // 彩度控えめ
      const b = 0.25; // 光量をさらに暗く
      const contrast = 0.9; // コントラスト微調整
      return [
        (b + s) * contrast,
        0.01 * s,
        0.01 * s,
        0,
        0,
        0.01 * s,
        (b + s) * contrast,
        0.01 * s,
        0,
        0,
        0.01 * s,
        0.01 * s,
        (b + s) * contrast,
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
          opacity={opacity}
        >
          <ColorMatrix matrix={darkMatrix} />
        </Image>
      </Group>
    );
  },
);

DarkFilter.displayName = "DarkFilter";

export default DarkFilter;
