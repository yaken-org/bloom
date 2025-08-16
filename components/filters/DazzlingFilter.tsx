import { ColorMatrix, Group, Image } from "@shopify/react-native-skia";
import React, { useMemo } from "react";
import type { FilterComponentProps } from "@/types/filters";

/**
 * ダズリングフィルター
 * 明るさ・コントラスト・彩度を強調し、光沢感を演出
 */
const DazzlingFilter: React.FC<FilterComponentProps> = React.memo(
  ({ image, width, height, isBaseLayer = true, options = {} }) => {
    const { opacity = 0.8, intensity = 1.0 } = options;

    // 明るさ調整
    const brightnessMatrix = useMemo(() => {
      const i = intensity;
      return [
        1.8 * i, 0,       0,       0, 0,
        0,       1.8 * i, 0,       0, 0,
        0,       0,       1.8 * i, 0, 0,
        0,       0,       0,       1, 0,
      ];
    }, [intensity]);

    // コントラスト調整
    const contrastMatrix = useMemo(() => {
      const i = intensity * 2.0;
      const t = (1 - i) * 128;
      return [
        i, 0, 0, 0, t,
        0, i, 0, 0, t,
        0, 0, i, 0, t,
        0, 0, 0, 1, 0,
      ];
    }, [intensity]);

    // 彩度調整
    const saturateMatrix = useMemo(() => {
      const s = 2.2 * intensity;
      const lumR = 0.3086;
      const lumG = 0.6094;
      const lumB = 0.0820;

      return [
        lumR*(1-s)+s, lumG*(1-s),   lumB*(1-s),   0, 0,
        lumR*(1-s),   lumG*(1-s)+s, lumB*(1-s),   0, 0,
        lumR*(1-s),   lumG*(1-s),   lumB*(1-s)+s, 0, 0,
        0,            0,            0,            1, 0,
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

        {/* 明るさレイヤー */}
        <Image
          image={image}
          x={0}
          y={0}
          width={width}
          height={height}
          fit="cover"
          opacity={opacity * 0.7}
          {...(!isBaseLayer && { blendMode: "screen" })}
        >
          <ColorMatrix matrix={brightnessMatrix} />
        </Image>

        {/* コントラストレイヤー */}
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

        {/* 彩度レイヤー */}
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
          <ColorMatrix matrix={saturateMatrix} />
        </Image>
      </Group>
    );
  },
);

DazzlingFilter.displayName = "DazzlingFilter";

export default DazzlingFilter;
