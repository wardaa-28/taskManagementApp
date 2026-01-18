import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';
import { colors, spacing, typography } from '../../theme';
import { Button } from '../common/Button';
import { Task, TaskStatus } from '../../types/task.types';
import { useTasks } from '../../hooks';

interface TaskDetailModalProps {
  visible: boolean;
  task: Task | null;
  columnId?: string; // Required when creating new task
  boardId?: string; // Required when creating new task
  onClose: () => void;
  onSave?: () => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  visible,
  task,
  columnId,
  boardId,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('TODO');
  const boardIdToUse = task?.board_id || boardId || null;
  const { createTask, updateTask, deleteTask, isLoading } = useTasks(boardIdToUse);

  const isCreating = !task;

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setStatus(task.status);
    } else {
      // Reset form when creating new task
      setTitle('');
      setDescription('');
      setStatus('TODO');
    }
  }, [task, visible]);

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Task title is required');
      return;
    }

    try {
      if (isCreating) {
        // Create new task
        if (!columnId || !boardId) {
          Alert.alert('Error', 'Column ID and Board ID are required to create a task');
          return;
        }

        // Get current column task count for position
        // For now, set position to 0, the backend will handle proper positioning
        const position = 0;

        await createTask(
          title.trim(),
          description.trim() || undefined,
          columnId,
          boardId,
          position
        );
      } else {
        // Update existing task
        if (!task) return;
        await updateTask(task.id, {
          title: title.trim(),
          description: description.trim(),
          status,
        });
      }
      onSave?.();
      onClose();
    } catch (error: any) {
      Alert.alert('Error', error.message || `Failed to ${isCreating ? 'create' : 'update'} task`);
    }
  };

  const handleDelete = () => {
    if (!task) return;

    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTask(task.id);
              onClose();
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to delete task');
            }
          },
        },
      ]
    );
  };

  const statusOptions: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'DONE'];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}>
      <SafeAreaView style={styles.modalContainer} edges={['top', 'bottom']}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{isCreating ? 'Create Task' : 'Task Details'}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Feather name="x" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.section}>
              <Text style={styles.label}>Title</Text>
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="Enter task title"
                placeholderTextColor={colors.placeholder}
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                placeholder="Enter task description"
                placeholderTextColor={colors.placeholder}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Status</Text>
              <View style={styles.statusContainer}>
                {statusOptions.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.statusOption,
                      status === option && styles.statusOptionActive,
                    ]}
                    onPress={() => setStatus(option)}>
                    <Text
                      style={[
                        styles.statusOptionText,
                        status === option && styles.statusOptionTextActive,
                      ]}>
                      {option.replace('_', ' ')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            {!isCreating && (
              <Button
                title="Delete"
                onPress={handleDelete}
                variant="danger"
                size="medium"
                style={styles.deleteButton}
              />
            )}
            <Button
              title={isCreating ? 'Create' : 'Save'}
              onPress={handleSave}
              variant="primary"
              size="medium"
              style={isCreating ? styles.saveButtonFull : styles.saveButton}
              loading={isLoading}
            />
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    paddingBottom: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  section: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.md,
    fontSize: typography.fontSize.md,
    color: colors.text,
    backgroundColor: colors.background,
  },
  textArea: {
    minHeight: 100,
    paddingTop: spacing.md,
  },
  statusContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  statusOption: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  statusOptionActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  statusOptionText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.medium,
  },
  statusOptionTextActive: {
    color: colors.textInverse,
  },
  footer: {
    flexDirection: 'row',
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.md,
  },
  deleteButton: {
    flex: 1,
  },
  saveButton: {
    flex: 1,
  },
  saveButtonFull: {
    flex: 1,
  },
});
