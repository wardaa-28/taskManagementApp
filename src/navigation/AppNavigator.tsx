import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BoardsScreen } from '../screens/BoardsScreen';
import { BoardDetailScreen } from '../screens/BoardDetailScreen';

export type AppStackParamList = {
  Boards: undefined;
  BoardDetail: { boardId: string };
};

const Stack = createNativeStackNavigator<AppStackParamList>();

export const AppNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Boards"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Boards" component={BoardsScreen} />
      <Stack.Screen name="BoardDetail" component={BoardDetailScreen} />
    </Stack.Navigator>
  );
};
