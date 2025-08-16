import { ColorMatrix, Group, Image } from "@shopify/react-native-skia";
import React, { useMemo } from "react";
import type { FilterComponentProps } from "@/types/filters";

/**
 * ブルーフィルター
 * 写真にクールで青みがかった効果を適用
 */
const BlueFilter: React.FC<FilterComponentProps> = React.memo(
  ({ image, width, height, isBaseLayer = true, options = {} }) => {
    const { opacity = 0.7, intensity = 1.0 } = options;

    // ブルートーン強調のカラーマトリックス（強度に応じて調整）
    const blueEnhanceMatrix = useMemo(() => {
      const i = intensity;
      return [
        0.8 * i + (1 - i),
        0.1 * i,
        0.1 * i,
        0,
        0, // 赤を抑制
        0.0 * i,
        0.9 * i + (1 - i),
        0.1 * i,
        0,
        0, // 緑を少し抑制
        0.0 * i,
        0.2 * i,
        1.4 * i + (1 - i),
        0,
        0.1 * i, // 青を強調
        0,
        0,
        0,
        1,
        0,
      ];
    }, [intensity]);

    // 彩度とコントラストの調整
    const coolToneMatrix = useMemo(() => {
      const i = intensity;
      return [
        1.1 * i + (1 - i),
        0.0,
        0.0,
        0,
        -0.02 * i,
        0.0,
        1.0 * i + (1 - i),
        0.1 * i,
        0,
        0.0,
        0.1 * i,
        0.1 * i,
        1.3 * i + (1 - i),
        0,
        0.05 * i,
        0,
        0,
        0,
        1,
        0,
      ];
    }, [intensity]);

    return (
      <Group>
        {/* ベースレイヤーが必要な場合のみベース画像を表示 */}
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

        {/* ブルートーン強調 */}
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
          <ColorMatrix matrix={blueEnhanceMatrix} />
        </Image>

        {/* クールトーンの微調整 */}
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
          <ColorMatrix matrix={coolToneMatrix} />
        </Image>
      </Group>
    );
  },
);

BlueFilter.displayName = "BlueFilter";

export default BlueFilter;
