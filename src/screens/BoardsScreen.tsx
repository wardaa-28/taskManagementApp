import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBoards } from '../hooks';
import { BoardCard } from '../components/BoardCard';
import { CreateBoardModal } from '../components/Modals/CreateBoardModal';
import { colors, spacing, typography } from '../theme';
import { Loader } from '../components/common/Loader';

interface BoardsScreenProps {
  navigation: any;
}

export const BoardsScreen: React.FC<BoardsScreenProps> = ({ navigation }) => {
  const {
    boards,
    isLoading,
    setSelectedBoard,
    fetchBoards,
  } = useBoards();
  const [createModalVisible, setCreateModalVisible] = useState(false);

  // Refresh boards when modal closes (in case a new board was created)
  const handleModalClose = () => {
    setCreateModalVisible(false);
    fetchBoards();
  };

  const handleBoardPress = (board: any) => {
    setSelectedBoard(board);
    navigation.navigate('BoardDetail', { boardId: board.id });
  };

  const renderBoard = ({ item }: { item: any }) => (
    <BoardCard board={item} onPress={() => handleBoardPress(item)} />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateIcon}>📋</Text>
      <Text style={styles.emptyStateTitle}>No Boards Yet</Text>
      <Text style={styles.emptyStateText}>
        Create your first board to get started with task management
      </Text>
      <TouchableOpacity
        style={styles.emptyStateButton}
        onPress={() => setCreateModalVisible(true)}>
        <Text style={styles.emptyStateButtonText}>Create Board</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>My Boards</Text>
      </View>

      {isLoading && boards.length === 0 ? (
        <Loader fullScreen text="Loading boards..." />
      ) : (
        <FlatList
          data={boards}
          renderItem={renderBoard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={
            boards.length === 0 ? styles.emptyContainer : styles.listContent
          }
          ListEmptyComponent={renderEmptyState}
          showsVerticalScrollIndicator={false}
          refreshing={isLoading}
          onRefresh={fetchBoards}
        />
      )}

      <CreateBoardModal
        visible={createModalVisible}
        onClose={handleModalClose}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setCreateModalVisible(true)}
        activeOpacity={0.8}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  header: {
    padding: spacing.lg,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: typography.fontSize.xxxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  listContent: {
    padding: spacing.md,
  },
  emptyContainer: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  emptyStateTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  emptyStateText: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  emptyStateButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    color: colors.textInverse,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
  },
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.cardShadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabText: {
    fontSize: typography.fontSize.xxxl,
    color: colors.textInverse,
    fontWeight: typography.fontWeight.bold,
  },
});
