import { ColorMatrix, Group, Image } from "@shopify/react-native-skia";
import React, { useMemo } from "react";
import type { FilterComponentProps } from "@/types/filters";

/**
 * NeonFilter - 紫・青・ピンク系ネオン輝き（超濃彩度＆超ギラギラ）
 */
const NeonFilter: React.FC<FilterComponentProps> = React.memo(
  ({ image, width, height, isBaseLayer = true, options = {} }) => {
    const { opacity = 1.0, intensity = 1.0 } = options;

    // 超濃彩度マトリックス（彩度5倍、明るさ1.5倍）
    const neonMatrix = useMemo(() => {
      const s = 5.0 * intensity; // 彩度
      const b = 1.5; // 明るさ
      return [
        0.5*b + s, 0.0,       0.6*s, 0, 0,   // 赤補正
        0.0,       0.5*b + s, 0.4*s, 0, 0,   // 緑補正
        0.0,       0.2*s,     0.8*b + s, 0, 0, // 青補正
        0, 0, 0, 1, 0,
      ];
    }, [intensity]);

    // 光源感・グロー強化マトリックス（光が飛ぶように）
    const glowMatrix = useMemo(() => {
      const i = intensity;
      return [
        3.0*i, 0.3*i, 0.4*i, 0, 0,
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
          opacity={opacity*0.95} blendMode="screen"
        >
          <ColorMatrix matrix={glowMatrix} />
        </Image>
      </Group>
    );
  }
);

NeonFilter.displayName = "NeonFilter";
export default NeonFilter;
