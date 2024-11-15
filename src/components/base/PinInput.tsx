// PINInput.tsx
import React, { useId } from "react";
import { styled, Stack, Text, YStack, Button, XStack } from "tamagui";
import Animated, { FadeInDown, FadeOutDown } from "react-native-reanimated";
import { useAnimatedShake } from "@/hooks/use-animated-shake";
import { useControllableState } from "tamagui";

interface PINInputProps {
  value?: string;
  onChangeText?: (code: string) => void;
  maximumLength?: number;
  setIsPinReady?: (val: boolean) => void;
  error?: boolean;
  /** Callback when PIN is completed */
  onComplete?: (code: string) => void;
  /** Box size */
  boxSize?: number;
  /** Gap between boxes */
  gap?: number;
  /** Custom box styles for different states */
  boxStyles?: Partial<Record<BoxState, object>>;
  /** Mask input values */
  maskInput?: boolean;
  /** Custom mask character */
  maskChar?: string;
}

type BoxState = "default" | "focused" | "error" | "filled";

const PINInputContainer = styled(YStack, {
  width: "100%",
  alignItems: "center",
  gap: "$4",
  px: "$1",
});

const PINBox = styled(Stack, {
  justifyContent: "center",
  alignItems: "center",
  borderWidth: 1,
  borderRadius: "$2",
  overflow: "hidden",
  variants: {
    state: {
      default: {
        borderColor: "$colorFocus",
      },
      focused: {
        borderColor: "$color",
        backgroundColor: "$backgroundHover",
      },
      error: {
        borderColor: "$red10",
      },
      filled: {
        borderColor: "$colorPress",
        backgroundColor: "$backgroundPress",
      },
    },
  } as const,
  defaultVariants: {
    state: "default",
  },
});

// Memoized box digit component
const BoxDigit = React.memo(
  ({
    digit,
    isFocused,
    error,
    size,
    customStyle,
    maskInput,
    maskChar = "•",
  }: {
    digit: string;
    isFocused: boolean;
    error: boolean;
    size: number;
    customStyle?: object;
    maskInput?: boolean;
    maskChar?: string;
  }) => {
    const state: BoxState = error
      ? "error"
      : digit
        ? "filled"
        : isFocused
          ? "focused"
          : "default";

    const displayValue = maskInput && digit ? maskChar : digit;

    return (
      <PINBox state={state} width={size} height={size} style={customStyle}>
        {digit ? (
          <Animated.View entering={FadeInDown} exiting={FadeOutDown}>
            <Text fontSize="$6" fontWeight="$8" color="$color">
              {displayValue}
            </Text>
          </Animated.View>
        ) : null}
      </PINBox>
    );
  }
);

export const PINInput: React.FC<PINInputProps> = ({
  value: controlledValue,
  onChangeText: controlledOnChangeText,
  maximumLength = 4,
  setIsPinReady,
  error = false,
  onComplete,
  boxSize = 50,
  gap = 8,
  boxStyles,
  maskInput = false,
  maskChar = "•",
}) => {
  const id = useId();
  const { shake, rStyle } = useAnimatedShake();
  const [focused, setFocused] = React.useState(false);

  const [value, onChangeText] = useControllableState({
    prop: controlledValue,
    defaultProp: "",
    onChange: (newValue) => {
      controlledOnChangeText?.(newValue);
      console.log(newValue, maximumLength, newValue.length);
    },
  });

  // Effect for pin ready status
  React.useEffect(() => {
    if (value) {
      console.log("value", value);
      console.log("maximumLength", maximumLength);
      const isPinReady = value.length === maximumLength;
      setIsPinReady?.(isPinReady);
      console.log("isPinReady", isPinReady);
      if (isPinReady) {
        onComplete?.(value);
      }
      return () => setIsPinReady?.(false);
    }
  }, [value, maximumLength, setIsPinReady]);

  // Effect for error animation
  React.useEffect(() => {
    if (error) shake();
  }, [error, shake]);

  const renderBoxDigit = React.useCallback(
    (_, index: number) => {
      const digit = value[index] || "";
      const isCurrentValue = index === value.length;
      const isLastValue = index === maximumLength - 1;
      const isCodeComplete = value.length === maximumLength;
      const isValueFocused = isCurrentValue || (isLastValue && isCodeComplete);
      const isFocused = focused && isValueFocused;

      return (
        <BoxDigit
          key={`${id}-${index}`}
          digit={digit}
          isFocused={isFocused}
          error={error}
          size={boxSize}
          maskInput={maskInput}
          maskChar={maskChar}
          customStyle={[
            { marginRight: index < maximumLength - 1 ? gap : 0 },
            boxStyles?.[
              error
                ? "error"
                : isFocused
                  ? "focused"
                  : digit
                    ? "filled"
                    : "default"
            ],
          ]}
        />
      );
    },
    [
      value,
      focused,
      error,
      maximumLength,
      boxSize,
      gap,
      boxStyles,
      maskInput,
      maskChar,
    ]
  );

  return (
    <PINInputContainer>
      <Animated.View
        id={id}
        style={[
          {
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          },
          rStyle,
        ]}
      >
        {Array(maximumLength).fill(null).map(renderBoxDigit)}
      </Animated.View>
    </PINInputContainer>
  );
};

// NumberKeyboard.tsx

interface NumberKeyboardProps {
  onNumberPress: (num: string) => void;
  onDelete: () => void;
  onClear: () => void;
}

const NumberPad = styled(YStack, {
  width: "100%",
  gap: "$2",
});

const NumberRow = styled(XStack, {
  gap: "$2",
  justifyContent: "center",
});

const NumberKey = styled(Button, {
  py: "$2",
  flex: 1,
  borderRadius: 9999,
  variants: {
    variant: {
      number: {
        backgroundColor: "$backgroundHover",
      },
      action: {
        backgroundColor: "$backgroundPress",
      },
    },
  },
  defaultVariants: {
    variant: "number",
  },
});

export const NumberKeyboard: React.FC<NumberKeyboardProps> = ({
  onNumberPress,
  onDelete,
  onClear,
}) => {
  const numbers = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    ["clear", "0", "delete"],
  ];

  return (
    <NumberPad>
      {numbers.map((row, rowIndex) => (
        <NumberRow key={`row-${rowIndex}`}>
          {row.map((key) => (
            <NumberKey
              key={key}
              variant={
                key === "delete" || key === "clear" ? "action" : "number"
              }
              onPress={() => {
                if (key === "delete") {
                  onDelete();
                } else if (key === "clear") {
                  onClear();
                } else {
                  onNumberPress(key);
                }
              }}
            >
              {key === "delete" ? (
                <Text color="$black2" fontSize="$5">
                  ⌫
                </Text>
              ) : key === "clear" ? (
                <Text color="$black2" fontSize="$5">
                  C
                </Text>
              ) : (
                <Text color="$black2" fontSize="$6" fontWeight="$7">
                  {key}
                </Text>
              )}
            </NumberKey>
          ))}
        </NumberRow>
      ))}
    </NumberPad>
  );
};
