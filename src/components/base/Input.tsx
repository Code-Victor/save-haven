import { useAnimatedShake } from "@/hooks/use-animated-shake";
import {
  //   styled,
  createStyledContext,
  View,
  withStaticProperties,
} from "@tamagui/core";
import React from "react";
import { Keyboard, TextInput } from "react-native";
import Animated from "react-native-reanimated";
import {
  Text,
  AnimatePresence,
  styled,
  Input as TInput,
  useControllableState,
} from "tamagui";

type Size = "sm" | "md" | "lg";
type Variant = "outlined";
export const InputContext = createStyledContext({
  size: "md" as Size,
  variant: "outlined" as Variant,
});

export const InputGroupFrame = styled(View, {
  name: "Input",
  flexDirection: "column",
  context: InputContext,
  variants: {
    size: {
      sm: {
        // gap: 4,
      },
      md: {
        // gap: 4,
      },
      lg: {
        // gap: 6,
      },
    },
    variant: {
      outlined: {},
    },
  } as const,
});

const FocusContext = createStyledContext({
  setFocused: (val: boolean) => {},
  focused: false,
});
const InputGroupFrameImpl = InputGroupFrame.styleable((props, forwardedRef) => {
  const { children, ...rest } = props;
  const [focused, setFocused] = React.useState(false);

  return (
    <FocusContext.Provider focused={focused} setFocused={setFocused}>
      <InputGroupFrame ref={forwardedRef} {...rest}>
        {children}
      </InputGroupFrame>
    </FocusContext.Provider>
  );
});

export const InputLabel = styled(Text, {
  name: "InputLabel",
  context: InputContext,
  fontFamily: "$gilroy",
  variants: {
    size: {
      sm: {
        fontSize: "$1",
        fontWeight: "$3",
      },
      md: {
        fontSize: "$2",
        fontWeight: "$4",
      },
      lg: {
        fontSize: "$3",
        fontWeight: "$4",
      },
    },
    variant: {
      outlined: {
        color: "#000000",
      },
    },
  } as const,
});

const InputBox = styled(View, {
  name: "InputBox",
  context: InputContext,
  flexDirection: "row",
  ai: "center",
  variants: {
    size: {
      sm: {
        gap: 4,
      },
      md: {
        gap: 4,
        px: "$2",
      },
      lg: {
        gap: 6,
        height: 52,
      },
    },
    variant: {
      outlined: {
        borderRadius: 4,
        borderWidth: 1,
        borderColor: "#6D7280",
        bg: "transparent",
      },
    },
    applyFocusStyle: {
      true: {
        borderColor: "#333333",
        bg: "transparent",
      },
    },
  } as const,
});

const InputBoxImpl = InputBox.styleable((props, forwardedRef) => {
  const { children, ...rest } = props;
  const { focused } = FocusContext.useStyledContext();

  return (
    <InputBox applyFocusStyle={focused} ref={forwardedRef} {...rest}>
      {children}
    </InputBox>
  );
});

const InputFrame = styled(TInput, {
  placeholderTextColor: "#BDBDBD",
  unstyled: true,
  context: InputContext,
  fontFamily: "$gilroy",
  fow: "400",
  color: "#000",
  flex: 1,
  p: 0,
  variants: {
    size: {
      sm: {
        height: 34,
      },
      md: {
        height: 42,
      },
      lg: {
        height: 52,
      },
    },
  },
});

const InputImpl = InputFrame.styleable((props, ref) => {
  const { setFocused } = FocusContext.useStyledContext();
  const { size } = InputContext.useStyledContext();
  const { ...rest } = props;
  return (
    <InputFrame
      ref={ref}
      onFocus={() => {
        setFocused(true);
      }}
      onBlur={() => setFocused(false)}
      size={size}
      {...rest}
    />
  );
});
const InputSubText = styled(Text, {
  name: "InputSubText",
  context: InputContext,
  fontSize: "$1",
  fow: "600",
  color: "$neutral.gray2",
  fontFamily: "$gilroy",
  mt: "$1",
  variants: {
    error: {
      true: {
        color: "#ff0000",
      },
    },
  },
});

export const OTPInputContainer = styled(Animated.View, {
  justifyContent: "center",
  alignItems: "center",
});

const OTPInput = ({
  value: controlledValue,
  onChangeText: controlledOnChangeText,
  maximumLength = 4,
  setIsPinReady,
  error = false,
}: {
  value?: string;
  onChangeText?: (code: string) => void;
  maximumLength?: number;
  setIsPinReady?: (val: boolean) => void;
  error?: boolean;
}) => {
  const { shake, rStyle } = useAnimatedShake();

  const [value, onChangeText] = useControllableState({
    prop: controlledValue,
    defaultProp: "",
    onChange: controlledOnChangeText,
  });
  const { setFocused, focused } = FocusContext.useStyledContext();
  const inputRef = React.useRef<TextInput>(null);
  const boxArray = new Array(maximumLength).fill(null);

  const handleOnPress = () => {
    inputRef.current?.focus();
  };

  React.useEffect(() => {
    if (setIsPinReady && value) {
      // update pin ready status
      setIsPinReady(value.length === maximumLength);
      // clean up function
      return () => {
        setIsPinReady(false);
      };
    }
  }, [value]);
  React.useEffect(() => {
    const listner = Keyboard.addListener("keyboardDidHide", () => {
      setFocused(false);
      inputRef.current?.blur();
    });
    return () => {
      listner.remove();
    };
  }, []);
  React.useEffect(() => {
    if (error) {
      shake();
    }
  }, [error]);

  const boxDigit = (_: unknown, index: number) => {
    const emptyInput = "";
    const digit = value[index] || emptyInput;
    const isCurrentValue = index === value.length;
    const isLastValue = index === maximumLength - 1;
    const isCodeComplete = value.length === maximumLength;

    const isValueFocused = isCurrentValue || (isLastValue && isCodeComplete);
    const isFocused = focused && isValueFocused;
    return (
      <SplitBox
        state={error ? "error" : isFocused ? "focused" : "default"}
        key={index}
        onPress={handleOnPress}
      >
        <AnimatePresence>
          {digit ? (
            <Text
              fontSize={"$4"}
              color="$neutral.gray1"
              fontWeight={"600"}
              animation="quick"
              enterStyle={{
                opacity: 0,
                transform: [
                  {
                    translateY: 10,
                  },
                ],
              }}
              exitStyle={{
                opacity: 0,
                transform: [
                  {
                    translateY: 10,
                  },
                ],
              }}
              opacity={1}
              transform={[
                {
                  translateY: 0,
                },
              ]}
            >
              {digit}
            </Text>
          ) : null}
        </AnimatePresence>
      </SplitBox>
    );
  };

  return (
    <OTPInputContainer style={rStyle}>
      <SplitBoxesContainer>{boxArray.map(boxDigit)}</SplitBoxesContainer>
      <TInput
        ref={inputRef}
        fontFamily={"$gilroy"}
        value={value}
        onChangeText={onChangeText}
        maxLength={maximumLength}
        onFocus={() => {
          setFocused(true);
        }}
        onBlur={() => setFocused(false)}
        keyboardType="number-pad"
        pos="absolute"
        top={0}
        left={0}
        opacity={0}
        width={0}
        height={0}
      />
    </OTPInputContainer>
  );
};

const SplitBoxesContainer = styled(View, {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
  gap: "$2",
});
const SplitBox = styled(View, {
  width: 50,
  height: 50,
  borderRadius: 5,
  borderWidth: 1,
  justifyContent: "center",
  alignItems: "center",
  variants: {
    state: {
      default: {
        borderColor: "$neutral.gray4",
      },
      focused: {
        borderColor: "$neutral.gray2",
      },
      error: {
        borderColor: "red",
      },
    },
  } as const,
  defaultVariants: {
    state: "default",
  },
});

export default OTPInput;

/* 
Usage:
```tsx
import { Input } from "@/components/base";

<Input>
  <Input.Label>Email</Input.Label>
  <Input.Area placeholder="Enter your email" />
  <Input.SubText error>Invalid email</Input.SubText>
</Input>;

*/
export const Input = withStaticProperties(InputGroupFrameImpl, {
  Props: InputContext.Provider,

  Label: InputLabel,
  Box: InputBoxImpl,
  Area: InputImpl,
  SubText: InputSubText,
  OTP: OTPInput,
});
