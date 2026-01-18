import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { colors, spacing, typography } from '../theme';
import { Board } from '../types/board.types';
import { useTasks } from '../hooks';

interface BoardCardProps {
  board: Board;
  onPress: () => void;
  style?: ViewStyle;
}

export const BoardCard: React.FC<BoardCardProps> = ({
  board,
  onPress,
  style,
}) => {
  // Note: This will fetch tasks, but for performance you might want to pass taskCount as prop
  // For now, we'll use a simple approach - tasks will be fetched when board is opened
  const taskCount = 0; // Will be updated when board detail screen loads tasks

  return (
    <TouchableOpacity
      style={[styles.card, style]}
      onPress={onPress}
      activeOpacity={0.7}>
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {board.title}
        </Text>
        {board.description && (
          <Text style={styles.description} numberOfLines={2}>
            {board.description}
          </Text>
        )}
        <View style={styles.footer}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{taskCount} tasks</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    shadowColor: colors.cardShadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  description: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: colors.backgroundSecondary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.medium,
  },
});
