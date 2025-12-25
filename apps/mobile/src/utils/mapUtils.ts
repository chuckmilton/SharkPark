import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const MAP_IMAGE_SIZE = 1098;

// Display size (square, based on screen width)
const MAP_DISPLAY_SIZE = SCREEN_WIDTH * 2.5;

export const scalePosition = (x: number, y: number) => {
  return {
    x: (x / MAP_IMAGE_SIZE) * MAP_DISPLAY_SIZE,
    y: (y / MAP_IMAGE_SIZE) * MAP_DISPLAY_SIZE,
  };
};