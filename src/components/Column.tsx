import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from 'react-native-draggable-flatlist';
import { colors, spacing, typography } from '../theme';
import { Task } from '../types/task.types';
import { TaskCard } from './TaskCard';

interface ColumnProps {
  title: string;
  tasks: Task[];
  onTaskPress: (task: Task) => void;
  onDragEnd: (data: Task[]) => void;
  columnId: string;
  boardId: string;
  style?: ViewStyle;
}

export const Column: React.FC<ColumnProps> = ({
  title,
  tasks,
  onTaskPress,
  onDragEnd,
  style,
}) => {
  const getColumnColor = (): string => {
    // Simple color mapping based on column title
    const titleUpper = title.toUpperCase();
    if (titleUpper.includes('PROGRESS') || titleUpper.includes('DOING')) {
      return colors.columnInProgress;
    } else if (titleUpper.includes('DONE') || titleUpper.includes('COMPLETE')) {
      return colors.columnDone;
    }
    return colors.columnTodo;
  };

  const renderItem = ({ item, drag, isActive }: RenderItemParams<Task>) => {
    return (
      <ScaleDecorator>
        <View
          style={[
            styles.taskWrapper,
            isActive && styles.taskWrapperActive,
          ]}
          onLongPress={drag}>
          <TaskCard task={item} onPress={() => onTaskPress(item)} />
        </View>
      </ScaleDecorator>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: getColumnColor() }, style]}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{tasks.length}</Text>
        </View>
      </View>
      {tasks.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No tasks</Text>
        </View>
      ) : (
        <DraggableFlatList
          data={tasks}
          onDragEnd={({ data }) => onDragEnd(data)}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          scrollEnabled={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 280,
    borderRadius: 12,
    padding: spacing.md,
    marginRight: spacing.md,
    maxHeight: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
  },
  countBadge: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
    minWidth: 24,
    alignItems: 'center',
  },
  countText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textSecondary,
  },
  listContent: {
    paddingBottom: spacing.md,
  },
  taskWrapper: {
    marginBottom: spacing.sm,
  },
  taskWrapperActive: {
    opacity: 0.8,
  },
  emptyState: {
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
  },
  emptyStateText: {
    fontSize: typography.fontSize.sm,
    color: colors.textTertiary,
  },
});
