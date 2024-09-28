import React, { useEffect } from 'react';
import { View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, { useSharedValue, useAnimatedProps, withTiming } from 'react-native-reanimated';
import { AntDesign } from '@expo/vector-icons';

// Create an animated component from the SVG Circle element
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const color = "#EE0F55";

const RingProgress = ({ radius = 100, strokeWidth = 30, progress = 0.5 }) => {
  const innerRadius = radius - strokeWidth / 2;
  const circumference = 2 * Math.PI * innerRadius;

  // Shared value to control the fill animation
  const fill = useSharedValue(0);

  useEffect(() => {
    fill.value = withTiming(progress, { duration: 1500 });
  }, [progress]);

  // Animated props for the circle to handle the fill
  const animatedProps = useAnimatedProps(() => ({
    strokeDasharray: [circumference * fill.value, circumference],
  }));

  return (
    <View style={{ width: radius * 2, height: radius * 2 }}>
      <Svg style={{ flex: 1 }}>
        {/* Background Circle */}
        <Circle
          r={innerRadius}
          cx={radius}
          cy={radius}
          fill="transparent"
          stroke={color}
          strokeWidth={strokeWidth}
          opacity={0.2}
        />
        {/* Foreground Circle with Animation */}
        <AnimatedCircle
          animatedProps={animatedProps}
          r={innerRadius}
          cx={radius}
          cy={radius}
          fill="transparent"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          rotation="-90"
          originX={radius}
          originY={radius}
        />
      </Svg>
      {/* Icon in the Center of the Circle */}
      <AntDesign
        name="arrowright"
        size={strokeWidth * 0.8}
        color="black"
        style={{
          position: 'absolute',
          alignSelf: 'center',
          top: strokeWidth * 0.1,
        }}
      />
    </View>
  );
};

export default RingProgress;
