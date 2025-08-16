import { ColorMatrix, Group, Image } from "@shopify/react-native-skia";
import React, { useMemo } from "react";
import type { FilterComponentProps } from "@/types/filters";

/**
 * NeonFilter
 * 写真に紫・青系のネオン光彩を付与
 */
const NeonFilter: React.FC<FilterComponentProps> = React.memo(
  ({ image, width, height, isBaseLayer = true, options = {} }) => {
    const { opacity = 0.8, intensity = 1.0 } = options;

    // ネオンカラー強調のカラーマトリックス
    const neonMatrix = useMemo(() => {
      const i = intensity;
      return [
        1.0 * i, 0, 0, 0, 0,  // R
        0, 0.2 * i + 0.8, 0, 0, 0, // Gを抑えめ
        0, 0, 1.5 * i, 0, 0,  // Bを強調
        0, 0, 0, 1, 0,
      ];
    }, [intensity]);

    // 輝き・光彩のためのカラーマトリックス（疑似的に輝度増強）
    const glowMatrix = useMemo(() => {
      const i = intensity;
      return [
        1.5 * i, 0, 0, 0, 0,
        0, 1.0 * i, 0, 0, 0,
        0, 0, 1.5 * i, 0, 0,
        0, 0, 0, 1, 0,
      ];
    }, [intensity]);

    return (
      <Group>
        {/* ベース画像 */}
        {isBaseLayer && (
          <Image image={image} x={0} y={0} width={width} height={height} fit="cover" />
        )}

        {/* ネオンカラー強調 */}
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
          <ColorMatrix matrix={neonMatrix} />
        </Image>

        {/* 光彩・輝度追加 */}
        <Image
          image={image}
          x={0}
          y={0}
          width={width}
          height={height}
          fit="cover"
          opacity={opacity * 0.5}
          {...(!isBaseLayer && { blendMode: "screen" })}
        >
          <ColorMatrix matrix={glowMatrix} />
        </Image>
      </Group>
    );
  }
);

NeonFilter.displayName = "NeonFilter";
export default NeonFilter;
