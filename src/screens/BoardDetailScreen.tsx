import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';
import { useBoards, useColumns, useTasks } from '../hooks';
import { Column } from '../components/Column';
import { TaskDetailModal } from '../components/Modals/TaskDetailModal';
import { colors, spacing, typography } from '../theme';
import { Task } from '../types/task.types';
import { Loader } from '../components/common/Loader';

interface BoardDetailScreenProps {
  route: any;
  navigation: any;
}

export const BoardDetailScreen: React.FC<BoardDetailScreenProps> = ({
  route,
  navigation,
}) => {
  const { boardId } = route.params;
  const { getBoardById, selectedBoard } = useBoards();
  const { columns, isLoading: columnsLoading, fetchBoardColumns } = useColumns(boardId);
  const {
    tasks,
    isLoading: tasksLoading,
    fetchBoardTasks,
    getTasksForColumn,
    reorderTasks,
  } = useTasks(boardId);

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedColumnId, setSelectedColumnId] = useState<string | null>(null);
  const [taskModalVisible, setTaskModalVisible] = useState(false);

  // Fetch board, columns, and tasks
  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          getBoardById(boardId),
          fetchBoardColumns(boardId),
          fetchBoardTasks(boardId),
        ]);
      } catch (error) {
        console.error('Error loading board data:', error);
      }
    };
    loadData();
  }, [boardId, getBoardById, fetchBoardColumns, fetchBoardTasks]);

  const handleTaskPress = (task: Task) => {
    setSelectedTask(task);
    setSelectedColumnId(null);
    setTaskModalVisible(true);
  };

  const handleAddTask = (columnId: string) => {
    setSelectedTask(null);
    setSelectedColumnId(columnId);
    setTaskModalVisible(true);
  };

  const handleDragEnd = async (columnId: string, newTasks: Task[]) => {
    try {
      const taskIds = newTasks.map((task) => task.id);
      const column = columns.find((col) => col.id === columnId);
      if (!column) return;

      // Determine status from column title (or use task status)
      // This is a simple mapping - you might want to store status in column metadata
      let status: 'TODO' | 'IN_PROGRESS' | 'DONE' = 'TODO';
      const columnTitle = column.title.toUpperCase();
      if (columnTitle.includes('PROGRESS') || columnTitle.includes('DOING')) {
        status = 'IN_PROGRESS';
      } else if (columnTitle.includes('DONE') || columnTitle.includes('COMPLETE')) {
        status = 'DONE';
      }

      await reorderTasks(taskIds, columnId, boardId, status);
    } catch (error) {
      console.error('Error reordering tasks:', error);
    }
  };

  const isLoading = columnsLoading || tasksLoading;

  if (isLoading && columns.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Loader fullScreen text="Loading board..." />
      </SafeAreaView>
    );
  }

  const board = selectedBoard || columns[0]?.board_id ? { id: boardId } : null;

  if (!board) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Board not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color={colors.primary} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.title}>
            {selectedBoard?.title || 'Board'}
          </Text>
          {selectedBoard?.description && (
            <Text style={styles.description}>{selectedBoard.description}</Text>
          )}
        </View>
      </View>

      {columns.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No columns found</Text>
          <Text style={styles.emptyStateSubtext}>
            Create columns to organize your tasks
          </Text>
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.columnsContainer}>
          {columns.map((column) => {
            const columnTasks = getTasksForColumn(column.id);
            return (
              <Column
                key={column.id}
                title={column.title}
                tasks={columnTasks}
                onTaskPress={handleTaskPress}
                onAddTask={handleAddTask}
                onDragEnd={(data) => handleDragEnd(column.id, data)}
                columnId={column.id}
                boardId={boardId}
              />
            );
          })}
        </ScrollView>
      )}

      <TaskDetailModal
        visible={taskModalVisible}
        task={selectedTask}
        columnId={selectedColumnId || undefined}
        boardId={boardId}
        onClose={() => {
          setTaskModalVisible(false);
          setSelectedTask(null);
          setSelectedColumnId(null);
        }}
        onSave={() => {
          fetchBoardTasks(boardId);
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    marginRight: spacing.md,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  description: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  columnsContainer: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: typography.fontSize.lg,
    color: colors.textSecondary,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  emptyStateText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  emptyStateSubtext: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
