import { ColorMatrix, Group, Image } from "@shopify/react-native-skia";
import React, { useMemo } from "react";
import type { FilterComponentProps } from "@/types/filters";

/**
 * NeonFilter - 紫・青・ピンク系ネオン輝き
 */
const NeonFilter: React.FC<FilterComponentProps> = React.memo(
  ({ image, width, height, isBaseLayer = true, options = {} }) => {
    const { opacity = 1.0, intensity = 1.0 } = options;

    // ネオンカラー強調
    const neonMatrix = useMemo(() => {
      const i = intensity;
      return [
        0.8*i, 0.0, 0.2*i, 0, 0.1*i,  // 赤
        0.1*i, 0.9*i, 0.5*i, 0, 0.0,   // 緑
        0.0, 0.2*i, 1.8*i, 0, 0.1*i,  // 青
        0, 0, 0, 1, 0,
      ];
    }, [intensity]);

    // グロー・輝き用マトリックス
    const glowMatrix = useMemo(() => {
      const i = intensity;
      return [
        1.5*i, 0.1*i, 0.2*i, 0, 0,
        0.1*i, 1.5*i, 0.2*i, 0, 0,
        0.2*i, 0.1*i, 1.5*i, 0, 0,
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
          opacity={opacity*0.8} blendMode="screen"
        >
          <ColorMatrix matrix={glowMatrix} />
        </Image>
      </Group>
    );
  }
);

NeonFilter.displayName = "NeonFilter";
export default NeonFilter;
