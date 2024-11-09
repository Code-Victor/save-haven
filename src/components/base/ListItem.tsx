import {
  GetProps,
  View,
  createStyledContext,
  styled,
  withStaticProperties,
} from "@tamagui/core";
import { Text } from "tamagui";

import { IconType } from "@/types";
import React, { cloneElement, useContext } from "react";

type Size = "sm" | "md" | "lg";

export const ListItemContext = createStyledContext({
  size: "md" as Size,
});

export const ListItemFrame = styled(View, {
  name: "ListItem",
  context: ListItemContext,
  animation: "quick",
  backgroundColor: "transparent",
  flexDirection: "row",
  alignItems: "center",
  br: "$4",
  transform: [
    {
      scale: 1,
    },
  ],
  pressStyle: {
    transform: [
      {
        scale: 0.99,
      },
    ],
  },
  variants: {
    variant: {
      bordered: {
        borderBottomWidth: 1,
        borderBottomColor: "$neutral.gray5",
        bg: "#ffffff",
        pressStyle: {
          bg: "#f5f5f5",
        },
      },
    },
    size: {
      sm: {
        py: "$3",
        gap: "$2",
      },
      md: {
        py: "$4",
        gap: "$2.5",
      },
      lg: {
        py: "$4.5",
        gap: "$3",
      },
    },
  } as const,
  defaultVariants: {
    variant: "bordered",
  },
});
type ListItemExtraProps = {
  icon?: IconType;
  iconAfter?: IconType;
};
export type ListItemProps = GetProps<typeof ListItemFrame> & ListItemExtraProps;
export const ListemItemFrameImpl = ListItemFrame.styleable<ListItemProps>(
  ({ icon, iconAfter, children, ...props }, forwardedRef) => {
    return (
      <ListItemFrame {...props} ref={forwardedRef}>
        {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}

        <View f={1}>{children}</View>
        {iconAfter ? <ListItemIcon>{iconAfter}</ListItemIcon> : null}
      </ListItemFrame>
    );
  }
);
const iconSize = {
  sm: 16,
  md: 24,
  lg: 32,
};

const ListItemIcon: React.FC<{ children: IconType }> = ({ children }) => {
  const { size } = useContext(ListItemContext);

  // Validate that there's only one child
  if (React.Children.count(children) !== 1) {
    throw new Error("ListItemIcon must have exactly one child");
  }

  // Clone the child element with potentially new props
  return cloneElement(children, {
    size: children.props.size || iconSize[size],
    color: children.props.color || "black",
  });
};

const ListItemTitle = styled(Text, {
  name: "ListItemTitle",
  color: "black",
  context: ListItemContext,
  variants: {
    size: {
      sm: {
        fontSize: "$2",
        fontWeight: "400",
      },
      md: {
        fontSize: "$3",
        fontWeight: "500",
      },
      lg: {
        fontSize: "$4",
        fontWeight: "600",
      },
    },
  },
});
const ListItemSubTitle = styled(Text, {
  name: "ListItemSubTitle",
  color: "black",
  context: ListItemContext,
  variants: {
    size: {
      sm: {
        fontSize: "$1",
      },
      md: {
        fontSize: "$2",
      },
      lg: {
        fontSize: "$3",
      },
    },
  },
});

export const ListItem = withStaticProperties(ListemItemFrameImpl, {
  Title: ListItemTitle,
  SubTitle: ListItemSubTitle,
});
