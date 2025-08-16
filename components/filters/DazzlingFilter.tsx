import { ColorMatrix, Group, Image } from "@shopify/react-native-skia";
import React, { useMemo } from "react";
import type { FilterComponentProps } from "@/types/filters";

// 画像素材を require() で読み込む
const whiteGradientImage = require("@/assets/filters/whiteGradient.png");
const flareImage = require("@/assets/filters/flare.png");
const glitterImage = require("@/assets/filters/glitter.png");

/**
 * Dazzling フィルター
 * ギラギラした強い光や反射、ハイライト・グリッター効果を表現
 */
const DazzlingFilter: React.FC<FilterComponentProps> = React.memo(
  ({ image, width, height, isBaseLayer = true, options = {} }) => {
    const { opacity = 0.8, intensity = 1.0 } = options;

    // コントラスト強め、シャドウ潰し
    const contrastMatrix = useMemo(() => {
      const i = intensity;
      return [
        1.5 * i + (1 - i),
        0,
        0,
        0,
        -0.1 * i,
        0,
        1.5 * i + (1 - i),
        0,
        0,
        -0.1 * i,
        0,
        0,
        1.5 * i + (1 - i),
        0,
        -0.1 * i,
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

        {/* コントラスト強化 */}
        <Image
          image={image}
          x={0}
          y={0}
          width={width}
          height={height}
          fit="cover"
          opacity={opacity * 0.6}
          {...(!isBaseLayer && { blendMode: "overlay" })}
        >
          <ColorMatrix matrix={contrastMatrix} />
        </Image>

        {/* 白飛びグラデーションオーバーレイ */}
        <Image
          image={whiteGradientImage}
          x={0}
          y={0}
          width={width}
          height={height}
          fit="cover"
          opacity={opacity * 0.3}
          {...(!isBaseLayer && { blendMode: "screen" })}
        />

        {/* レンズフレア */}
        <Image
          image={flareImage}
          x={0}
          y={0}
          width={width}
          height={height}
          fit="cover"
          opacity={opacity * 0.4}
          {...(!isBaseLayer && { blendMode: "screen" })}
        />

        {/* キラキラ・グリッター */}
        <Image
          image={glitterImage}
          x={0}
          y={0}
          width={width}
          height={height}
          fit="cover"
          opacity={opacity * 0.3}
          {...(!isBaseLayer && { blendMode: "screen" })}
        />
      </Group>
    );
  },
);

DazzlingFilter.displayName = "DazzlingFilter";

export default DazzlingFilter;
