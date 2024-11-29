import * as React from "react";
import { Animated, Easing } from "react-native";
import Svg, { Circle, Defs, G, LinearGradient, Stop } from "react-native-svg";
import { View } from "tamagui";
// TODO: Migrate this to Reanimated
export function Donut({
  percentage = 75,
  radius = 25,
  strokeWidth = 4,
  duration = 500,
  color = "#06C072",
  delay = 1000,
  max = 100,
  children,
}: {
  percentage?: number;
  radius?: number;
  strokeWidth?: number;
  duration?: number;
  color?: string;
  delay?: number;
  textColor?: string;
  max?: number;
  children?: React.ReactNode;
}) {
  const animated = React.useRef(new Animated.Value(0)).current;
  const circleRef = React.useRef<React.ElementRef<typeof Circle>>(null);
  const circumference = 2 * Math.PI * radius;
  const halfCircle = radius + strokeWidth;

  const animation = (toValue: number) => {
    return Animated.timing(animated, {
      delay: delay,
      toValue,
      duration,
      useNativeDriver: true,
      easing: Easing.out(Easing.ease),
    }).start();
  };

  React.useEffect(() => {
    animation(percentage);
    animated.addListener((v) => {
      const maxPerc = (100 * v.value) / max;
      const strokeDashoffset = circumference - (circumference * maxPerc) / 100;
      if (circleRef?.current) {
        circleRef.current.setNativeProps({
          // @ts-ignore
          strokeDashoffset,
        });
      }
    });

    return () => {
      animated.removeAllListeners();
    };
  });

  return (
    <View width={radius * 2} height={radius * 2} position="relative">
      <Svg
        height={radius * 2}
        width={radius * 2}
        viewBox={`0 0 ${halfCircle * 2} ${halfCircle * 2}`}
      >
        <G rotation="-90" origin={`${halfCircle}, ${halfCircle}`}>
          <Circle
            cx="50%"
            cy="50%"
            r={radius}
            fill="transparent"
            stroke={"#BDB0C3"}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          <Circle
            ref={circleRef}
            cx="50%"
            cy="50%"
            r={radius}
            fill="transparent"
            stroke="url(#a)"
            strokeWidth={strokeWidth}
            strokeDashoffset={circumference}
            strokeDasharray={circumference}
            strokeLinecap="round"
          />
        </G>
        <Defs>
          <LinearGradient
            id="a"
            x1={17.623}
            x2={-26.831}
            y1={38}
            y2={22.585}
            gradientUnits="userSpaceOnUse"
          >
            <Stop stopColor="#7642A0" />
            <Stop offset={1} stopColor="#7642A0" />
          </LinearGradient>
        </Defs>
      </Svg>
      <View
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        ai="center"
        jc="center"
      >
        {children}
      </View>
    </View>
  );
}
