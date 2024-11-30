import {
  createStyledContext,
  GetProps,
  styled,
  View,
  withStaticProperties,
} from "@tamagui/core";
import Color from "color";
import { Spinner, Text, useTheme } from "tamagui";

import { IconType } from "@/types";
import React, { cloneElement, useContext } from "react";
import Animated, {
  FadeInDown,
  FadeOutUp,
  LayoutAnimationConfig,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
// import {OnLayout} from "react-native"

type Size = "sm" | "md" | "lg";
type Variant =
  | "primary"
  | "primary-light"
  | "secondary"
  | "secondary-light"
  | "outlined"
  | "ghost"
  | "gray"
  | "unstyled";
const defaultContextValues = {
  size: "md" as Size,
  variant: "primary" as Variant,
};
export const ButtonContext = createStyledContext(defaultContextValues);

const buttonHeight = {
  sm: 40,
  md: 48,
  lg: 54,
} satisfies Record<Size, number>;
export const ButtonFrame = styled(View, {
  name: "Button",
  context: ButtonContext,
  position: "relative",
  animation: "medium",
  justifyContent: "center",
  overflow: "hidden",
  transform: [
    {
      scale: 1,
    },
  ],
  alignItems: "center",
  flexDirection: "row",
  pressStyle: {
    transform: [
      {
        scale: 0.96,
      },
    ],
  },
  variants: {
    size: {
      sm: {
        px: 10,
        height: buttonHeight.sm,
        gap: 7,
        hitSlop: 10,
      },
      md: {
        px: 12.5,
        height: buttonHeight.md,
        gap: 8.75,
      },
      lg: {
        px: 18.75,
        height: buttonHeight.lg,
        gap: 12.5,
      },
    },
    variant: {
      unstyled: {},
      primary: {
        backgroundColor: "$purple6",
        borderWidth: 1,
        borderColor: "$purple6",
        pressStyle: {
          opacity: 0.9,
        },
      },
      secondary: {
        backgroundColor: "$green6",
        borderWidth: 1,
        borderColor: "$green6",
        pressStyle: {
          opacity: 0.9,
        },
      },
      "primary-light": {
        backgroundColor: "$purple2",
        borderWidth: 1,
        borderColor: "$purple2",
        pressStyle: {
          backgroundColor: "$green3",
        },
      },
      "secondary-light": {
        backgroundColor: "$green2",
        borderWidth: 1,
        borderColor: "$green2",
        pressStyle: {
          backgroundColor: "$green3",
        },
      },

      outlined: {
        borderWidth: 1,
        borderColor: "$purple9",
        backgroundColor: "$green6",
        pressStyle: {
          opacity: 0.9,
        },
      },
      ghost: {
        backgroundColor: "transparent",
        pressStyle: {
          backgroundColor: "$purple1",
        },
      },
      gray: {
        backgroundColor: "#6D7280",
        pressStyle: {
          backgroundColor: Color("#6D7280").darken(0.1).toString(),
        },
      },
    },
    full: {
      true: {
        width: "100%",
      },
    },
    rounded: {
      pill: {
        borderRadius: 9999,
      },
      sm: {
        borderRadius: "$3",
      },
      md: {
        borderRadius: "$4",
      },
      lg: {
        borderRadius: "$6",
      },
    },
  } as const,

  defaultVariants: {
    rounded: "md",
  },
});
export const ButtonContainer = styled(Animated.View, {
  name: "ButtonContainer",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  // width: "100%",
  height: "100%",
  variants: {
    size: {
      sm: {
        gap: 6.75,
      },
      md: {
        gap: 8.75,
      },
      lg: {
        gap: 12.5,
      },
    },
  } as const,
});

type ButtonFrameExtraProps = {
  loading?: boolean;
};
export type ButtonFrameProps = GetProps<typeof ButtonFrame> &
  ButtonFrameExtraProps;
// const AnimatedButtonContainer =
//   Animated.createAnimatedComponent(ButtonContainer);
export const ButtonFrameImpl = ButtonFrame.styleable<ButtonFrameProps>(
  ({ loading, children, ...buttonFrameProps }, forwardedRef) => {
    const id = React.useId();
    const size = buttonFrameProps.size ?? defaultContextValues.size;
    const variant = buttonFrameProps.variant ?? defaultContextValues.variant;
    const width = useSharedValue(0);

    const theme = useTheme();
    const iconColor = React.useMemo(
      () => ({
        primary: theme.white2.val,
        outlined: theme.purple9.val,
        ghost: theme.purple9.val,
        gray: theme.white1.val,
        unstyled: "",
      }),
      [theme]
    );
    const LoadingViewStyle = useAnimatedStyle(() => {
      return {
        height: "100%",
        width: width.value,
        alignItems: "center",
        justifyContent: "center",
      };
    });
    const onButtonContainerLayout = React.useCallback((event: any) => {
      width.value = event.nativeEvent.layout.width;
    }, []);
    return (
      <ButtonFrame ref={forwardedRef} {...buttonFrameProps}>
        <LayoutAnimationConfig skipEntering skipExiting>
          {loading ? (
            <Animated.View
              key={`spinner-container-${id}`}
              style={LoadingViewStyle}
              entering={FadeInDown.springify().damping(80).stiffness(200)}
              exiting={FadeOutUp.springify().damping(80).stiffness(200)}
            >
              <Spinner color={iconColor[variant]} size={"small"} />
            </Animated.View>
          ) : (
            <ButtonContainer
              key={`btn-container-${id}`}
              onLayout={onButtonContainerLayout}
              entering={FadeInDown.springify().damping(80).stiffness(200)}
              exiting={FadeOutUp.springify().damping(80).stiffness(200)}
              // gap="$4"
              size={size}
            >
              {children}
            </ButtonContainer>
          )}
        </LayoutAnimationConfig>
      </ButtonFrame>
    );
  }
);

export const IconButtonFrame = styled(ButtonFrame, {
  name: "IconButton",
  context: ButtonContext,
  position: "relative",
  overflow: "visible",

  p: 0,
  hitSlop: 10,
  variants: {
    size: {
      sm: {
        height: 32,
        width: 32,
      },
      md: {
        height: 48,
        width: 48,
      },
      lg: {
        height: 56,
        width: 56,
      },
    },
  },
});
export const IconButtonBadgeFrame = styled(View, {
  name: "IconButtonBadge",
  position: "absolute",
  top: 0,
  right: -4,
  borderRadius: 9999,
  backgroundColor: "#DF2126",
  justifyContent: "center",
  alignItems: "center",
  height: 16,
  minWidth: 16,
  paddingHorizontal: 4,
  variants: {
    size: {
      sm: {
        width: 12,
        height: 12,
      },
      md: {
        width: 16,
        height: 16,
      },
      lg: {
        width: 20,
        height: 20,
      },
    },
  },
});
export const IconButtonBadgeText = styled(Text, {
  name: "IconButtonBadgeText",
  fontSize: 11,
  fontWeight: "500",
  color: "$neutral.white",
});
export const IconButtonBadgeFrameImpl = IconButtonBadgeFrame.styleable<{
  children: number;
}>(({ children, ...props }, forwardedRef) => {
  const display = children > 99 ? "99+" : children;
  return (
    <IconButtonBadgeFrame ref={forwardedRef} {...props}>
      <IconButtonBadgeText>{display}</IconButtonBadgeText>
    </IconButtonBadgeFrame>
  );
});

export type ButtonProps = GetProps<typeof ButtonFrame>;
export const ButtonText = styled(Text, {
  name: "ButtonText",
  context: ButtonContext,
  ff: "$dmSans",
  userSelect: "none",
  fontWeight: "500",
  variants: {
    size: {
      sm: {
        fontSize: "$2",
        lineHeight: "$2",
      },
      md: {},
      lg: {},
    },
    variant: {
      primary: {
        color: "$white2",
      },
      secondary: {
        color: "$purple9",
      },
      "secondary-light": {
        color: "$purple9",
      },
      outlined: {
        color: "$purple9",
      },
      ghost: {
        color: "$purple6",
      },
      gray: {
        color: "$white1",
      },
    },
  } as const,
});
const iconSize = {
  sm: 18,
  md: 24,
  lg: 28,
};
const ButtonIcon = (props: { children: IconType }) => {
  const { size, variant } = useContext(ButtonContext.context);
  const theme = useTheme();
  const iconColor = React.useMemo(
    () => ({
      primary: theme.white2.val,
      secondary: theme.purple9.val,
      "secondary-light": theme.purple9.val,
      outlined: theme.purple9.val,
      ghost: theme.purple9.val,
      gray: theme.white1.val,
      unstyled: "",
    }),
    [theme]
  );

  // Validate that there's only one child
  if (React.Children.count(props.children) !== 1) {
    throw new Error("ButtonIcon must have exactly one child");
  }
  return cloneElement(props.children, {
    size: props.children.props.size || iconSize[size],

    color: props.children.props.color || iconColor[variant],
  });
};
const iconButtonSize = {
  sm: 16,
  md: 24,
  lg: 28,
};
const IconButtonIcon = (props: { children: IconType }) => {
  const { size, variant } = useContext(ButtonContext.context);
  const theme = useTheme();
  const iconColor = React.useMemo(
    () => ({
      primary: theme.white2.val,
      secondary: theme.purple9.val,
      "secondary-light": theme.purple9.val,
      outlined: theme.purple9.val,
      ghost: theme.purple9.val,
      gray: theme.white1.val,
      unstyled: "",
    }),
    [theme]
  );
  // Validate that there's only one child
  if (React.Children.count(props.children) !== 1) {
    throw new Error("IconButtonIcon must have exactly one child");
  }
  return cloneElement(props.children, {
    size: props.children.props.size || iconButtonSize[size],
    color: props.children.props.color || iconColor[variant],
  });
};
export const Button = withStaticProperties(ButtonFrameImpl, {
  Props: ButtonContext.Provider,

  Text: ButtonText,

  Icon: ButtonIcon,
});

export const IconButton = withStaticProperties(IconButtonFrame, {
  Props: ButtonContext.Provider,
  Badge: IconButtonBadgeFrameImpl,
  Icon: IconButtonIcon,
});
