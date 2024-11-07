import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import TodoItem from './TodoItem';

const TodoList = ({ todos, openEditModal, deleteTodo, goToDetails, completed }) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={todos}
        renderItem={({ item }) => (
          <TodoItem
            todo={item}
            openEditModal={!completed ? () => openEditModal(item) : null}
            deleteTodo={() => deleteTodo(item.key)}
            goToDetails={() => goToDetails(item)}
          />
        )}
        keyExtractor={(item) => item.key}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 10,
  },
});

export default TodoList;
