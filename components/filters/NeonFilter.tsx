import { ColorMatrix, Group, Image } from "@shopify/react-native-skia";
import React, { useMemo } from "react";
import type { FilterComponentProps } from "@/types/filters";

/**
 * NeonFilter - 極端に派手な紫・青・ピンクネオン
 */
const NeonFilter: React.FC<FilterComponentProps> = React.memo(
  ({ image, width, height, isBaseLayer = true, options = {} }) => {
    const { opacity = 1.0, intensity = 1.0 } = options;

    // 超高彩度 + 色強化
    const neonMatrix = useMemo(() => {
      const i = intensity;
      return [
        1.5, 0, 1.5, 0, 0,   // 赤＋紫系強化
        0, 1.5, 2.0, 0, 0,   // 緑＋青系
        0, 0, 3.0, 0, 0,     // 青・ピンク強化
        0, 0, 0, 1, 0,
      ];
    }, [intensity]);

    // 彩度50倍マトリックス
    const saturationMatrix = useMemo(() => {
      const s = 50; // 彩度
      return [
        0.213*s + 1-1, 0.715*s, 0.072*s, 0, 0,
        0.213*s, 0.715*s + 1-1, 0.072*s, 0, 0,
        0.213*s, 0.715*s, 0.072*s + 1-1, 0, 0,
        0, 0, 0, 1, 0,
      ];
    }, []);

    return (
      <Group>
        {isBaseLayer && (
          <Image image={image} x={0} y={0} width={width} height={height} fit="cover" />
        )}

        {/* 色強化 */}
        <Image image={image} x={0} y={0} width={width} height={height} fit="cover" opacity={opacity}>
          <ColorMatrix matrix={neonMatrix} />
        </Image>

        {/* 彩度強化 */}
        <Image
          image={image}
          x={0} y={0} width={width} height={height} fit="cover"
          opacity={opacity} blendMode="screen"
        >
          <ColorMatrix matrix={saturationMatrix} />
        </Image>
      </Group>
    );
  }
);

NeonFilter.displayName = "NeonFilter";
export default NeonFilter;
