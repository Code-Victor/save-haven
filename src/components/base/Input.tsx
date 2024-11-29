import { useAnimatedShake } from "@/hooks/use-animated-shake";
import {
  //   styled,
  createStyledContext,
  View,
  withStaticProperties,
} from "@tamagui/core";
import React from "react";
import { FlatList, Keyboard, TextInput } from "react-native";
import Animated, {
  FadeInDown,
  FadeInUp,
  FadeOutDown,
} from "react-native-reanimated";
import {
  Text,
  AnimatePresence,
  styled,
  Input as TInput,
  useControllableState,
  XStack,
} from "tamagui";
import * as ExpoImagePicker from "expo-image-picker";
import { Image } from "expo-image";

type Size = "sm" | "md" | "lg";
type Variant = "outlined" | "grey";
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
      grey: {},
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
      grey: {
        color: "#4D515B",
      },
    },
  } as const,
});

const InputBox = styled(View, {
  name: "InputBox",
  context: InputContext,
  flexDirection: "row",
  ai: "center",
  borderRadius: 8,
  animateOnly: ["backgroundColor"],
  animation: "100ms",

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
        borderWidth: 1,
        borderColor: "#6D7280",
        bg: "transparent",
        focusStyle: {
          borderColor: "#333333",
        },
      },
      grey: {
        bg: "#F0F1F2",
        focusStyle: {
          bg: "#e6e8e9",
        },
      },
    },
  } as const,
});

const InputBoxImpl = InputBox.styleable((props, forwardedRef) => {
  const { children, ...rest } = props;
  return (
    <InputBox ref={forwardedRef} {...rest}>
      {children}
    </InputBox>
  );
});

const InputFrame = styled(TInput, {
  placeholderTextColor: "#BDBDBD",
  unstyled: true,
  context: InputContext,
  fontFamily: "$gilroy",
  fow: "500",
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
      onBlur={() => {
        setFocused(false);
      }}
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

const PasswordInput = (props: React.ComponentProps<typeof InputImpl>) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const toggleShowPassword = React.useCallback(
    () => setShowPassword((prev) => !prev),
    []
  );
  return (
    <Input.Box>
      <Input.Area
        placeholder="••••••••"
        secureTextEntry={!showPassword}
        {...props}
      />
      <IconButton variant="ghost" size="sm" onPress={toggleShowPassword}>
        <IconButton.Icon>
          <Icon
            name={!showPassword ? "ri:eye-line" : "ri:eye-off-line"}
            size={20}
          />
        </IconButton.Icon>
      </IconButton>
    </Input.Box>
  );
};

// Types
interface OTPInputProps {
  value?: string;
  onChangeText?: (code: string) => void;
  maximumLength?: number;
  setIsPinReady?: (val: boolean) => void;
  error?: boolean;
  /** Callback when OTP is completed */
  onComplete?: (code: string) => void;
  /** Auto focus on mount */
  autoFocus?: boolean;
  /** Box size */
  boxSize?: number;
  /** Gap between boxes */
  gap?: number;
  /** Custom box styles for different states */
  boxStyles?: Partial<Record<BoxState, object>>;
}

type BoxState = "default" | "focused" | "error" | "filled";

// Styled components with better typing
const OTPInputContainer = styled(Animated.View, {
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
});

const SplitBoxesContainer = styled(View, {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
});

const SplitBox = styled(View, {
  justifyContent: "center",
  alignItems: "center",
  borderWidth: 1,
  borderRadius: 5,
  overflow: "hidden",
  variants: {
    state: {
      default: {
        borderColor: "$purple3",
      },
      focused: {
        borderColor: "$purple6",
      },
      error: {
        borderColor: "red",
      },
      filled: {
        borderColor: "$black5",
        backgroundColor: "$gray1",
      },
    },
  } as const,
  defaultVariants: {
    state: "default",
  },
});

const HiddenTextInput = styled(TInput, {
  position: "absolute",
  width: 0,
  height: 0,
  opacity: 0,
  fontFamily: "$gilroy",
});

// Memoized box digit component
const BoxDigit = React.memo(
  ({
    digit,
    isFocused,
    error,
    onPress,
    size,
    customStyle,
  }: {
    digit: string;
    isFocused: boolean;
    error: boolean;
    onPress: () => void;
    size: number;
    customStyle?: object;
  }) => {
    const state: BoxState = error
      ? "error"
      : digit
        ? "filled"
        : isFocused
          ? "focused"
          : "default";

    return (
      <SplitBox
        state={state}
        onPress={onPress}
        style={[{ width: size, height: size }, customStyle]}
      >
        {digit ? (
          <Animated.View entering={FadeInDown} exiting={FadeOutDown}>
            <Text
              fontSize="$4"
              color="$black5"
              fontFamily="$gilroy"
              fontWeight="600"
            >
              {digit}
            </Text>
          </Animated.View>
        ) : null}
      </SplitBox>
    );
  }
);

export const OTPInput: React.FC<OTPInputProps> = ({
  value: controlledValue,
  onChangeText: controlledOnChangeText,
  maximumLength = 4,
  setIsPinReady,
  error = false,
  onComplete,
  autoFocus = false,
  boxSize = 50,
  gap = 8,
  boxStyles,
}) => {
  const { shake, rStyle } = useAnimatedShake();
  const inputRef = React.useRef<TextInput>(null);
  const { setFocused, focused } = FocusContext.useStyledContext();

  const [value, onChangeText] = useControllableState({
    prop: controlledValue,
    defaultProp: "",
    onChange: (newValue) => {
      controlledOnChangeText?.(newValue);
      if (newValue.length === maximumLength) {
        onComplete?.(newValue);
      }
    },
  });

  const handleOnPress = React.useCallback(() => {
    inputRef.current?.focus();
  }, []);

  // Effect for pin ready status
  React.useEffect(() => {
    if (setIsPinReady && value) {
      const isPinReady = value.length === maximumLength;
      setIsPinReady(isPinReady);
      return () => setIsPinReady(false);
    }
  }, [value, maximumLength, setIsPinReady]);

  // Effect for keyboard hide
  React.useEffect(() => {
    const listener = Keyboard.addListener("keyboardDidHide", () => {
      setFocused(false);
      inputRef.current?.blur();
    });
    return () => listener.remove();
  }, [setFocused]);

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
          key={index}
          digit={digit}
          isFocused={isFocused}
          error={error}
          onPress={handleOnPress}
          size={boxSize}
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
      handleOnPress,
      boxSize,
      gap,
      boxStyles,
    ]
  );

  return (
    <OTPInputContainer style={rStyle}>
      <SplitBoxesContainer>
        {Array(maximumLength).fill(null).map(renderBoxDigit)}
      </SplitBoxesContainer>
      <HiddenTextInput
        ref={inputRef}
        value={value}
        onChangeText={onChangeText}
        maxLength={maximumLength}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        keyboardType="number-pad"
        fontFamily="$gilroy"
      />
    </OTPInputContainer>
  );
};

import DateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import { Icon } from "./Icon";
import { isNonEmptyArray } from "@/utils";
import { Button, IconButton } from "./Button";

export function DatePicker(
  props: React.ComponentProps<typeof DateTimePicker> & {
    mode: "date" | "time" | "datetime";
  }
) {
  const show = React.useCallback(
    (currentMode: "time" | "date") => () => {
      DateTimePickerAndroid.open({
        value: props.value,
        onChange: props.onChange,
        mode: currentMode,
        minimumDate: props.minimumDate,
        maximumDate: props.maximumDate,
      });
    },
    []
  );
  const isDate = props.mode.includes("date");
  return (
    <XStack
      onPress={isDate ? show("date") : show("time")}
      gap="$2.5"
      ai="center"
      h={42}
      w="100%"
    >
      <XStack ai="center" f={1}>
        {isDate ? (
          <Text fontFamily="dmSansMedium">
            {new Intl.DateTimeFormat("en-US", {
              dateStyle: "medium",
            }).format(props.value)}
          </Text>
        ) : (
          <Text fontFamily="dmSansMedium">
            {new Intl.DateTimeFormat("en-US", {
              timeStyle: "short",
            }).format(props.value)}
          </Text>
        )}
      </XStack>

      <Icon name="ri:calendar-2-line" size={24} color="#636874" />
    </XStack>
  );
}
interface PickerImage {
  uri: string;
  name: string;
  type: string;
}

type ImagePickerProps = {
  value?: PickerImage[];
  onChange?: (image: PickerImage[]) => void;
};
export function ImagePicker(props: ImagePickerProps) {
  const pickImage = React.useCallback(async () => {
    // No permissions request is necessary for launching the image library
    let result = await ExpoImagePicker.launchImageLibraryAsync({
      mediaTypes: ExpoImagePicker.MediaTypeOptions.Images,
      aspect: [4, 3],
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      const newImages = result.assets.flatMap((image) => {
        const splittedUri = image.uri.split("/").reverse();
        if (!isNonEmptyArray(splittedUri)) {
          console.warn("file has no name and is ignored.");
          return [];
        }
        const [name] = splittedUri;
        if (image.mimeType) {
          return [
            {
              name,
              uri: image.uri,
              type: image.mimeType,
            },
          ];
        }
        return [];
      });
      props.onChange?.(newImages);
    }
  }, []);
  if (!props.value) {
    return (
      <Button
        onPress={pickImage}
        variant="gray"
        size="sm"
        alignSelf="flex-start"
      >
        <Button.Icon>
          <Icon name="ri:upload-2-line" size={24} color="#000" />
        </Button.Icon>
        <Button.Text color="#000">Pick an image</Button.Text>
      </Button>
    );
  }
  return (
    <FlatList
      horizontal
      data={props.value}
      keyExtractor={(item) => item.uri}
      contentContainerStyle={{ gap: 8, width: "100%", paddingVertical: 16 }}
      renderItem={({ item, index }) => (
        <Image
          source={{ uri: item.uri }}
          style={{
            width: 80,
            height: 80,
          }}
        />
      )}
    />
  );
}
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
  Password: PasswordInput,
  OTP: OTPInput,
  DatePicker,
  ImagePicker,
});
