import React, { useMemo } from "react";
import { Image, Group, ColorMatrix } from "@shopify/react-native-skia";
import type { FilterComponentProps } from "@/types/filters";

/**
 * PachinkoFilter - 赤・金・オレンジ系、玉が光るようなギラつき
 */
const PachinkoFilter: React.FC<FilterComponentProps> = React.memo(
  ({ image, width, height, isBaseLayer = true, options = {} }) => {
    const { opacity = 1.0, intensity = 1.0 } = options;

    // 彩度・光量・コントラストを調整
    const pachinkoMatrix = useMemo(() => {
      const s = 2.8 * intensity; // 彩度
      const b = 1.7; // 光量
      const c = 1.6; // コントラスト
      return [
        b * c + s, 0.1 * s, 0, 0, 0, // R
        0.05 * s, b * c + s, 0.05 * s, 0, 0, // G
        0, 0.05 * s, b * c + s, 0, 0, // B
        0, 0, 0, 1, 0,
      ];
    }, [intensity]);

    // ハイライト・光のギラつき（虹色ハイライト）
    const highlightMatrix = useMemo(() => {
      const i = intensity;
      return [
        1.8 * i, 0.5 * i, 0.2 * i, 0, 0,
        0.2 * i, 1.8 * i, 0.5 * i, 0, 0,
        0.2 * i, 0.3 * i, 1.8 * i, 0, 0,
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
          opacity={opacity * 0.7} // 少し下げて人物潰れを防止
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
