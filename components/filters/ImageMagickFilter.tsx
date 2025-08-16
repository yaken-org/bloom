import { ColorMatrix, Group, Image } from "@shopify/react-native-skia";
import React, { useMemo } from "react";
import type { FilterComponentProps } from "@/types/filters";

const ImageMagickFilter: React.FC<FilterComponentProps> = ({
  image,
  width,
  height,
  isBaseLayer = true,
}) => {
  // エッジ検出のためのカラーマトリックス
  const edgeDetectionMatrix = useMemo(
    () => [
      // より控えめなエッジ検出効果
      1.2, -0.1, -0.1, 0, 0, -0.1, 1.2, -0.1, 0, 0, -0.1, -0.1, 1.2, 0, 0, 0, 0,
      0, 1, 0,
    ],
    [],
  );

  // 彩度強化とコントラスト調整のマトリックス
  const enhanceMatrix = useMemo(() => {
    const contrast = 1.3; // コントラスト強化
    const saturation = 1.8; // 彩度強化
    const lumR = 0.3086;
    const lumG = 0.6094;
    const lumB = 0.082;

    const sr = (1 - saturation) * lumR;
    const sg = (1 - saturation) * lumG;
    const sb = (1 - saturation) * lumB;

    return [
      (sr + saturation) * contrast,
      sg * contrast,
      sb * contrast,
      0,
      0.05,
      sr * contrast,
      (sg + saturation) * contrast,
      sb * contrast,
      0,
      0.05,
      sr * contrast,
      sg * contrast,
      (sb + saturation) * contrast,
      0,
      0.05,
      0,
      0,
      0,
      1,
      0,
    ];
  }, []);

  // 色調調整マトリックス（温かみを追加）
  const warmToneMatrix = useMemo(
    () => [
      1.1,
      0.05,
      0.0,
      0,
      0.05, // 赤みを少し追加
      0.05,
      1.0,
      0.0,
      0,
      0.02,
      0.0,
      0.0,
      0.95,
      0,
      0.0, // 青を少し抑制
      0,
      0,
      0,
      1,
      0,
    ],
    [],
  );

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

      {/* Step 1: エッジ検出とシャープネス */}
      <Image
        image={image}
        x={0}
        y={0}
        width={width}
        height={height}
        fit="cover"
        opacity={0.7}
        {...(!isBaseLayer && { blendMode: "overlay" })}
      >
        <ColorMatrix matrix={edgeDetectionMatrix} />
      </Image>

      {/* Step 2: 彩度とコントラスト強化 */}
      <Image
        image={image}
        x={0}
        y={0}
        width={width}
        height={height}
        fit="cover"
        opacity={0.8}
        {...(!isBaseLayer && { blendMode: "multiply" })}
      >
        <ColorMatrix matrix={enhanceMatrix} />
      </Image>

      {/* Step 3: 暖色調整 */}
      <Image
        image={image}
        x={0}
        y={0}
        width={width}
        height={height}
        fit="cover"
        opacity={0.6}
        {...(!isBaseLayer && { blendMode: "screen" })}
      >
        <ColorMatrix matrix={warmToneMatrix} />
      </Image>
    </Group>
  );
};

export default ImageMagickFilter;
