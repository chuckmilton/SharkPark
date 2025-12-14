/**
 * Navigation Type Definitions
 * Provides type safety for React Navigation
 */

import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

/**
 * Root Bottom Tab Navigator Parameter List
 */
export type RootTabParamList = {
  'Long Term': undefined;
  Map: undefined;
  Profile: undefined;
};

/**
 * Type helper for tab screen props
 */
export type RootTabScreenProps<T extends keyof RootTabParamList> =
  BottomTabScreenProps<RootTabParamList, T>;
