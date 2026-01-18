import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { colors, spacing, typography } from '../theme';
import { Task } from '../types/task.types';

interface TaskCardProps {
  task: Task;
  onPress: () => void;
  style?: ViewStyle;
}

const getStatusColor = (status: Task['status']): string => {
  switch (status) {
    case 'TODO':
      return colors.info;
    case 'IN_PROGRESS':
      return colors.warning;
    case 'DONE':
      return colors.success;
    default:
      return colors.secondary;
  }
};

export const TaskCard: React.FC<TaskCardProps> = ({ task, onPress, style }) => {
  const statusColor = getStatusColor(task.status);

  return (
    <TouchableOpacity
      style={[styles.card, style]}
      onPress={onPress}
      activeOpacity={0.7}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={[styles.statusIndicator, { backgroundColor: statusColor }]} />
          <Text style={styles.title} numberOfLines={2}>
            {task.title}
          </Text>
        </View>
        {task.description && (
          <Text style={styles.description} numberOfLines={3}>
            {task.description}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.sm,
    shadowColor: colors.cardShadow,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.sm,
  },
  title: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
    flex: 1,
  },
  description: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    lineHeight: typography.fontSize.sm * typography.lineHeight.normal,
  },
});
