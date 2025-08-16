import { ColorMatrix, Group, Image } from "@shopify/react-native-skia";
import React, { useMemo } from "react";
import type { FilterComponentProps } from "@/types/filters";

/**
 * Pachinkoフィルター
 * ゴールドとピンクの華やかさを強調した明るく派手な効果
 */
const PachinkoFilter: React.FC<FilterComponentProps> = React.memo(
  ({ image, width, height, isBaseLayer = true, options = {} }) => {
    const { opacity = 0.8, intensity = 1.0 } = options;

    // ゴールド・ピンク系強調マトリックス
    const pachinkoMatrix = useMemo(() => {
      const i = intensity;
      return [
        2.2 * i,
        0,
        0,
        0,
        0, // 赤を強め
        0,
        2.0 * i,
        0,
        0,
        0, // 緑を少し強め
        0,
        0,
        2.8 * i,
        0,
        0, // 青を強調して華やかに
        0,
        0,
        0,
        1,
        0,
      ];
    }, [intensity]);

    // 追加で彩度と明るさの微調整
    const shineMatrix = useMemo(() => {
      const i = intensity;
      return [
        1.1 * i,
        0,
        0,
        0,
        0.05 * i,
        0,
        1.0 * i,
        0,
        0,
        0.02 * i,
        0,
        0,
        1.3 * i,
        0,
        0.03 * i,
        0,
        0,
        0,
        1,
        0,
      ];
    }, [intensity]);

    return (
      <Group>
        {/* ベースレイヤー */}
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

        {/* Pachinkoカラー強調 */}
        <Image
          image={image}
          x={0}
          y={0}
          width={width}
          height={height}
          fit="cover"
          opacity={opacity * 0.7}
          {...(!isBaseLayer && { blendMode: "multiply" })}
        >
          <ColorMatrix matrix={pachinkoMatrix} />
        </Image>

        {/* 輝きの微調整 */}
        <Image
          image={image}
          x={0}
          y={0}
          width={width}
          height={height}
          fit="cover"
          opacity={opacity * 0.5}
          {...(!isBaseLayer && { blendMode: "overlay" })}
        >
          <ColorMatrix matrix={shineMatrix} />
        </Image>
      </Group>
    );
  },
);

PachinkoFilter.displayName = "PachinkoFilter";

export default PachinkoFilter;
