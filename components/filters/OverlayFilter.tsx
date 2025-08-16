import { Group, Image, useImage } from "@shopify/react-native-skia";
import React from "react";
import type {
  FilterComponentProps,
  OverlayFilterOptions,
} from "@/types/filters";

interface OverlayFilterProps extends FilterComponentProps {
  options?: OverlayFilterOptions;
}

const OverlayFilter: React.FC<OverlayFilterProps> = React.memo(
  ({ image, width, height, isBaseLayer = true, options = {} }) => {
    const {
      overlayImageUrl,
      blendMode = "multiply",
      opacity = 0.5,
    } = options as OverlayFilterOptions;

    const overlayImage = useImage(overlayImageUrl);
    console.log("OverlayFilter - options:", options);
    console.log("OverlayFilter - overlayImageUrl:", overlayImageUrl);
    console.log("OverlayFilter - overlayImage loaded:", !!overlayImage);
    
    return (
      <Group>
        {/* ベース画像 - ベースレイヤーの場合のみ表示 */}
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

        {/* オーバーレイ画像 */}
        {overlayImage && (
          <Image
            image={overlayImage}
            x={0}
            y={0}
            width={width}
            height={height}
            fit="cover"
            opacity={opacity}
            blendMode={blendMode}
          />
        )}
      </Group>
    );
  },
);

OverlayFilter.displayName = "OverlayFilter";

export default OverlayFilter;
