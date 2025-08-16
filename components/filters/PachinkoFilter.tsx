import React, { useMemo } from "react";
import { Image, Group, ColorMatrix } from "@shopify/react-native-skia";
import type { FilterComponentProps } from "@/types/filters";

/**
 * PachinkoFilter - 赤・金・オレンジ系、玉が光るようなギラつき
 * コントラストはオフ、人が潰れない光量に調整
 */
const PachinkoFilter: React.FC<FilterComponentProps> = React.memo(
  ({ image, width, height, isBaseLayer = true, options = {} }) => {
    const { opacity = 1.0, intensity = 1.0 } = options;

    // 彩度・光量を強く、コントラストは消す
    const pachinkoMatrix = useMemo(() => {
      const s = 2.0 * intensity; // 彩度2.8倍
      const b = 1.5; // 光量を抑え目に
      return [
        b + s, 0.1 * s, 0, 0, 0, // R
        0.05 * s, b + s, 0.05 * s, 0, 0, // G
        0, 0.05 * s, b + s, 0, 0, // B
        0, 0, 0, 1, 0,
      ];
    }, [intensity]);

    // ハイライト・光のギラつき用マトリックス（虹色ハイライト）
    const highlightMatrix = useMemo(() => {
      const i = intensity;
      return [
        1.3 * i, 0.3 * i, 0.1 * i, 0, 0,
        0.1 * i, 1.3 * i, 0.3 * i, 0, 0,
        0.1 * i, 0.2 * i, 1.3 * i, 0, 0,
        0, 0, 0, 1, 0,
      ];
    }, [intensity]);

    return (
      <Group>
        {isBaseLayer && (
          <Image image={image} x={0} y={0} width={width} height={height} fit="cover" />
        )}

        {/* Pachinko彩度・光量強調 */}
        <Image image={image} x={0} y={0} width={width} height={height} fit="cover" opacity={opacity}>
          <ColorMatrix matrix={pachinkoMatrix} />
        </Image>

        {/* ハイライト・光のギラつき */}
        <Image
          image={image} x={0} y={0} width={width} height={height} fit="cover"
          opacity={opacity * 0.9}
          blendMode="screen"
        >
          <ColorMatrix matrix={highlightMatrix} />
        </Image>
      </Group>
    );
  }
);

PachinkoFilter.displayName = "PachinkoFilter";
export default PachinkoFilter;
