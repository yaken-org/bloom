import { ColorMatrix, Group, Image } from "@shopify/react-native-skia";
import React, { useMemo } from "react";
import type { FilterComponentProps } from "@/types/filters";

/**
 * JewelFilter - 宝石のような多色反射ギラギラ
 */
const JewelFilter: React.FC<FilterComponentProps> = React.memo(
  ({ image, width, height, isBaseLayer = true, options = {} }) => {
    const { opacity = 1.0, intensity = 1.0 } = options;

    // 多色反射マトリックス（虹色っぽく）
    const jewelMatrix = useMemo(() => {
      const s = 5.0 * intensity; // 彩度5倍
      const b = 1.2; // 明るさ少し上げ
      return [
        1.0*b + s, 0.3*s, 0.2*s, 0, 0, // 赤強め
        0.2*s, 1.0*b + s, 0.3*s, 0, 0, // 緑
        0.1*s, 0.3*s, 1.0*b + s, 0, 0, // 青
        0, 0, 0, 1, 0,
      ];
    }, [intensity]);

    // ハイライト・メタリック感強化
    const metallicMatrix = useMemo(() => {
      const i = intensity;
      return [
        2.0*i, 0.5*i, 0.3*i, 0, 0,
        0.3*i, 2.0*i, 0.5*i, 0, 0,
        0.2*i, 0.4*i, 2.0*i, 0, 0,
        0, 0, 0, 1, 0,
      ];
    }, [intensity]);

    return (
      <Group>
        {isBaseLayer && (
          <Image image={image} x={0} y={0} width={width} height={height} fit="cover" />
        )}

        {/* 多色反射ギラギラ */}
        <Image image={image} x={0} y={0} width={width} height={height} fit="cover" opacity={opacity}>
          <ColorMatrix matrix={jewelMatrix} />
        </Image>

        {/* メタリックハイライト */}
        <Image
          image={image} x={0} y={0} width={width} height={height} fit="cover"
          opacity={opacity*0.95} blendMode="screen"
        >
          <ColorMatrix matrix={metallicMatrix} />
        </Image>
      </Group>
    );
  }
);

JewelFilter.displayName = "JewelFilter";
export default JewelFilter;
