import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const TodoItem = ({ todo, openEditModal, deleteTodo }) => {
  const navigation = useNavigation();

  const goToDetails = () => {
    navigation.navigate('Details', {
      key: todo.key,
      text: todo.text,
      category: todo.category,
      priority: todo.priority,
    });
  };

  return (
    <View style={styles.itemContainer}>
      <TouchableOpacity onPress={() => openEditModal(todo)}>
        <View style={styles.item}>
          <Text style={styles.text}>{todo.text}</Text>
        </View>
      </TouchableOpacity>
      <Button title="Détails" onPress={goToDetails} />
      <Button title="Supprimer" onPress={() => deleteTodo(todo.key)} color="red" />
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: 150,
  },
  text: {
    fontSize: 18,
  },
});

export default TodoItem;
