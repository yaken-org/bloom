import { ColorMatrix, Group, Image } from "@shopify/react-native-skia";
import React, { useMemo } from "react";
import type { FilterComponentProps } from "@/types/filters";

/**
 * NeonFilter - 紫・青・ピンク系ネオン輝き（超濃色＆超ギラギラ）
 */
const NeonFilter: React.FC<FilterComponentProps> = React.memo(
  ({ image, width, height, isBaseLayer = true, options = {} }) => {
    const { opacity = 1.0, intensity = 1.0 } = options;

    // ネオンカラー強調（色濃度2〜3倍）
    const neonMatrix = useMemo(() => {
      const i = intensity;
      return [
        2.0*i, 0.0, 0.4*i, 0, 0.1*i,   // 赤
        0.1*i, 2.0*i, 0.5*i, 0, 0.0,   // 緑
        0.0, 0.3*i, 2.5*i, 0, 0.1*i,   // 青
        0, 0, 0, 1, 0,
      ];
    }, [intensity]);

    // グロー・輝き強化マトリックス（光源感を2倍）
    const glowMatrix = useMemo(() => {
      const i = intensity;
      return [
        3.0*i, 0.2*i, 0.3*i, 0, 0,
        0.2*i, 3.0*i, 0.3*i, 0, 0,
        0.3*i, 0.2*i, 3.0*i, 0, 0,
        0, 0, 0, 1, 0,
      ];
    }, [intensity]);

    return (
      <Group>
        {isBaseLayer && (
          <Image image={image} x={0} y={0} width={width} height={height} fit="cover" />
        )}

        <Image image={image} x={0} y={0} width={width} height={height} fit="cover" opacity={opacity}>
          <ColorMatrix matrix={neonMatrix} />
        </Image>

        <Image
          image={image}
          x={0} y={0} width={width} height={height} fit="cover"
          opacity={opacity*0.9} blendMode="screen"
        >
          <ColorMatrix matrix={glowMatrix} />
        </Image>
      </Group>
    );
  }
);

NeonFilter.displayName = "NeonFilter";
export default NeonFilter;
