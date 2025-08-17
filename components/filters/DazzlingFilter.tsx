import { ColorMatrix, Group, Image } from "@shopify/react-native-skia";
import React, { useMemo } from "react";
import type { FilterComponentProps } from "@/types/filters";

/**
 * DazzlingFilter - ゴールドや白系の眩しい光を中心に派手ギラギラ
 * コントラストなし、光量抑えめ
 */
const DazzlingFilter: React.FC<FilterComponentProps> = React.memo(
  ({ image, width, height, isBaseLayer = true, options = {} }) => {
    const { opacity = 1.0, intensity = 1.0 } = options;

    // 彩度と光量を調整（ゴールド・白系を意識）
    const dazzlingMatrix = useMemo(() => {
      const s = 1.9 * intensity; // 彩度
      const b = 0.75; // 光量抑えめ
      return [
        b + s,
        0.05 * s,
        0,
        0,
        0, // R
        0.02 * s,
        b + s,
        0.02 * s,
        0,
        0, // G
        0,
        0.02 * s,
        b + s,
        0,
        0, // B
        0,
        0,
        0,
        1,
        0,
      ];
    }, [intensity]);

    // ハイライト（白っぽい光のギラつき）
    const highlightMatrix = useMemo(() => {
      const i = intensity;
      return [
        1.02 * i,
        0.1 * i,
        0.05 * i,
        0,
        0,
        0.05 * i,
        1.02 * i,
        0.1 * i,
        0,
        0,
        0.05 * i,
        0.1 * i,
        1.02 * i,
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

        {/* Dazzling彩度・光量強調 */}
        <Image
          image={image}
          x={0}
          y={0}
          width={width}
          height={height}
          fit="cover"
          opacity={opacity}
        >
          <ColorMatrix matrix={dazzlingMatrix} />
        </Image>

        {/* ハイライト（ギラつき） */}
        <Image
          image={image}
          x={0}
          y={0}
          width={width}
          height={height}
          fit="cover"
          opacity={opacity * 0.6}
          blendMode="screen"
        >
          <ColorMatrix matrix={highlightMatrix} />
        </Image>
      </Group>
    );
  },
);

DazzlingFilter.displayName = "DazzlingFilter";
export default DazzlingFilter;
