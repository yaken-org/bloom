import React, { useMemo } from "react";
import { Image, Group, ColorMatrix } from "@shopify/react-native-skia";
import type { FilterComponentProps } from "@/types/filters";

/**
 * DarkFilter - 写真全体を暗めに落とした落ち着いた色味
 */
const DarkFilter: React.FC<FilterComponentProps> = React.memo(
  ({ image, width, height, isBaseLayer = true, options = {} }) => {
    const { opacity = 0.8, intensity = 1.0 } = options;

    // 彩度・光量・コントラストの設定
    const darkMatrix = useMemo(() => {
      const s = 0.8 * intensity; // 彩度控えめ
      const b = 0.4; // 光量暗め
      return [
        b + s, 0.02 * s, 0.02 * s, 0, 0,
        0.02 * s, b + s, 0.02 * s, 0, 0,
        0.02 * s, 0.02 * s, b + s, 0, 0,
        0, 0, 0, 1, 0,
      ];
    }, [intensity]);

    return (
      <Group>
        {isBaseLayer && (
          <Image image={image} x={0} y={0} width={width} height={height} fit="cover" />
        )}

        <Image image={image} x={0} y={0} width={width} height={height} fit="cover" opacity={opacity}>
          <ColorMatrix matrix={darkMatrix} />
        </Image>
      </Group>
    );
  }
);

DarkFilter.displayName = "DarkFilter";

export default DarkFilter;
