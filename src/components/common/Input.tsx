import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { colors, spacing, typography } from '../../theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: object;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  rightIcon,
  onRightIconPress,
  secureTextEntry,
  ...textInputProps
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const showPasswordToggle = secureTextEntry;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.input,
            error && styles.inputError,
            rightIcon && styles.inputWithIcon,
          ]}
          placeholderTextColor={colors.placeholder}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          {...textInputProps}
        />
        {showPasswordToggle && (
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
            <Feather
              name={isPasswordVisible ? 'eye-off' : 'eye'}
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        )}
        {rightIcon && !showPasswordToggle && (
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={onRightIconPress}
            disabled={!onRightIconPress}>
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  input: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    fontSize: typography.fontSize.md,
    color: colors.text,
    backgroundColor: colors.background,
  },
  inputWithIcon: {
    paddingRight: 48,
  },
  inputError: {
    borderColor: colors.error,
  },
  iconContainer: {
    position: 'absolute',
    right: spacing.md,
    padding: spacing.xs,
  },
  errorText: {
    fontSize: typography.fontSize.xs,
    color: colors.error,
    marginTop: spacing.xs,
  },
});
