import createIconSet from "@expo/vector-icons/createIconSet";
import remixiconGlyphMap from "@/assets/icons/remixicon.glyphmap.json";
import { icons } from "@/assets/icons";
import React from "react";
import type { SvgProps } from "react-native-svg";

const expoAssetId = require("@/assets/fonts/remixicon.ttf");
const IconSet = createIconSet(remixiconGlyphMap, "remixicon", expoAssetId);

// Type definitions
type RemixIconName = `ri:${keyof typeof remixiconGlyphMap}`;
type CustomIconName = keyof typeof icons;
export type UnifiedIconName = RemixIconName | CustomIconName;

type BaseIconProps = {
  size?: number;
  color?: string;
};

type RemixIconProps = React.ComponentProps<typeof IconSet>;
type RemixIconRef = React.ElementRef<typeof IconSet>;

interface CustomIconProps extends SvgProps {
  size?: number;
}

export interface UnifiedIconProps extends BaseIconProps {
  name: UnifiedIconName;
  width?: number;
  height?: number;
}

// Helper to check if name is a Remix icon
const isRemixIcon = (name: UnifiedIconName): name is RemixIconName =>
  name.startsWith("ri:");

// Helper to get Remix icon name without prefix
const getRemixIconName = (
  name: RemixIconName
): keyof typeof remixiconGlyphMap =>
  name.slice(3) as keyof typeof remixiconGlyphMap;

// Remix Icon Component with ref forwarding
const RemixIcon = React.forwardRef<RemixIconRef, RemixIconProps>(
  ({ size = 16, style, ...props }, ref) => {
    return (
      <IconSet
        {...props}
        size={size}
        style={[
          {
            height: size,
            width: size,
          },
          style,
        ]}
        ref={ref}
      />
    );
  }
);

// Custom SVG Icon Component
const CustomIcon = ({
  name,
  size,
  width,
  height,
  ...rest
}: CustomIconProps & { name: CustomIconName }) => {
  const Icon = icons[name];
  return <Icon {...rest} width={width || size} height={height || size} />;
};

// Unified Icon Component
export const Icon = React.forwardRef<RemixIconRef, UnifiedIconProps>(
  ({ name, size = 16, width, height, ...props }, ref) => {
    if (isRemixIcon(name)) {
      return (
        <RemixIcon
          name={getRemixIconName(name)}
          size={size}
          {...props}
          ref={ref as React.Ref<RemixIconRef>}
        />
      );
    }

    return (
      <CustomIcon
        name={name}
        size={size}
        width={width}
        height={height}
        {...props}
      />
    );
  }
);

// Type helper for icon names
export const iconNames = {
  remix: Object.keys(remixiconGlyphMap).map(
    (name) => `ri:${name}` as RemixIconName
  ),
  custom: Object.keys(icons) as CustomIconName[],
} as const;
