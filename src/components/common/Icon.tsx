/**
 * Icon Component
 * Wrapper for react-native-vector-icons
 */

import React from 'react';
import { Icon as RNVIcon } from 'react-native-vector-icons/Icon';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../../theme';

export type IconFamily = 'Feather' | 'MaterialIcons' | 'MaterialCommunityIcons' | 'Ionicons';

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  family?: IconFamily;
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  color = colors.text,
  family = 'Feather',
}) => {
  const props = {
    name,
    size,
    color,
  };

  switch (family) {
    case 'MaterialIcons':
      return <MaterialIcons {...props} />;
    case 'MaterialCommunityIcons':
      return <MaterialCommunityIcons {...props} />;
    case 'Ionicons':
      return <Ionicons {...props} />;
    case 'Feather':
    default:
      return <Feather {...props} />;
  }
};
