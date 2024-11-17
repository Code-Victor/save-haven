import * as React from "react";
import { View, ViewProps, ViewStyle } from "react-native";
import Animated, {
  Easing,
  type SharedValue,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { withPause } from "react-native-redash";

interface SkeletonContextType {
  opacity: SharedValue<number>;
  baseColor?: string;
  subscribe: () => () => void;
}
const SkeletonContext = React.createContext<SkeletonContextType | null>(null);

interface SkeletonProviderProps {
  children: React.ReactNode;
  baseColor?: string;
}

const SkeletonEasing = Easing.bezier(0.4, 0, 0.6, 1);
export function SkeletonProvider({
  children,
  baseColor = "#bcbec5",
}: SkeletonProviderProps) {
  const opacity = useSharedValue(1);
  const pause = useSharedValue(true);
  const [connectedComponents, setConnectedComponents] = React.useState(0);

  const subscribe = React.useCallback(() => {
    setConnectedComponents((prev) => prev + 1);
    return () => {
      setConnectedComponents((prev) => prev - 1);
    };
  }, []);
  const hasSubscribers = connectedComponents > 0;

  React.useEffect(() => {
    if (hasSubscribers) {
      pause.value = false;
      opacity.value = withPause(
        withRepeat(
          withSequence(
            withTiming(0.5, {
              duration: 1000,
              easing: SkeletonEasing,
            }),
            withTiming(1, {
              duration: 1000,
              easing: SkeletonEasing,
            })
          ),
          -1,
          true
        ),
        pause
      );
    } else {
      pause.value = true;
      opacity.value = 1;
    }
  }, [hasSubscribers]);

  return (
    <SkeletonContext.Provider value={{ opacity, baseColor, subscribe }}>
      {children}
    </SkeletonContext.Provider>
  );
}

function useSkeleton() {
  const context = React.useContext(SkeletonContext);
  if (!context) {
    throw new Error("useSkeleton must be used within a SkeletonProvider");
  }
  return context;
}
interface SkeletonProps extends Omit<ViewProps, "children"> {
  baseColor?: string;
}

export function Skeleton({
  style,
  baseColor: userBaseColor,
  ...props
}: SkeletonProps) {
  const { opacity, subscribe, baseColor } = useSkeleton();
  React.useEffect(subscribe, [subscribe]); // handles both mount and unmount
  return (
    <Animated.View
      style={[
        {
          opacity,
          backgroundColor: userBaseColor ?? baseColor,
          borderRadius: 8,
        },
        style,
      ]}
      {...props}
    />
  );
}
// Gotten from: https://github.com/marcuzgabriel/react-native-reanimated-skeleton
export interface ICustomViewStyle extends ViewStyle {
  children?: ICustomViewStyle[];
  key?: number | string;
}
interface WithSkeletonOptions {
  containerStyle?: ViewStyle;
  baseColor?: string;
}

export function withSkeleton<P>(
  WrappedComponent: React.ComponentType<P>,
  layout: ICustomViewStyle[],
  options: WithSkeletonOptions = {}
) {
  return function SkeletonWrapper(
    props: (P & { loading?: boolean }) | { loading: true }
  ) {
    const renderSkeleton = React.useCallback((layout: ICustomViewStyle[]) => {
      return layout.map((item) => {
        const { children, key, ...style } = item;
        if (children) {
          return (
            <View key={key} style={style}>
              {renderSkeleton(children)}
            </View>
          );
        }
        return (
          <Skeleton key={key} style={style} baseColor={options?.baseColor} />
        );
      });
    }, []);
    if (props.loading) {
      return (
        <View style={options?.containerStyle}>{renderSkeleton(layout)}</View>
      );
    }

    return <WrappedComponent {...props} />;
  };
}
