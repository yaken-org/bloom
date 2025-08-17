import { ColorMatrix, Group, Image } from "@shopify/react-native-skia";
import React, { useMemo } from "react";
import type { FilterComponentProps } from "@/types/filters";

/**
 * NeonFilter - 紫・青・ピンク系ネオン、少し光量
 * 元のパラメータの色味を保持
 */
const NeonFilter: React.FC<FilterComponentProps> = React.memo(
  ({ image, width, height, isBaseLayer = true, options = {} }) => {
    const { opacity = 0.8, intensity = 1.0 } = options;

    // 光量・彩度を変数化
    const s = intensity; // 彩度スケーリング

    const neonMatrix = useMemo(() => {
      const b = 0.7; // 基本光量
      const i = s;
      return [
        b + 1.3 * i,
        0.2 * i,
        0.6 * i,
        0,
        0, // ピンク系
        0.2 * i,
        b + 0.8 * i,
        0.3 * i,
        0,
        0, // 緑少なめ
        0.4 * i,
        0.3 * i,
        b + 1.5 * i,
        0,
        0, // 青・紫強調
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
          <ColorMatrix matrix={neonMatrix} />
        </Image>
      </Group>
    );
  },
);

NeonFilter.displayName = "NeonFilter";
export default NeonFilter;
