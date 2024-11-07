import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TodoItem from '../../components/TodoItem';
import { useNavigation } from '@react-navigation/native';

const CompletedTasksScreen = () => {
  const [completedTodos, setCompletedTodos] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const loadCompletedTodos = async () => {
      const storedTodos = await AsyncStorage.getItem('todos');
      if (storedTodos) {
        const todos = JSON.parse(storedTodos);
        const completed = todos.filter((todo) => todo.completed);
        setCompletedTodos(completed);
      }
    };
    loadCompletedTodos();
  }, []);

  // Fonction pour supprimer une tâche
  const deleteTodo = async (key) => {
    const updatedTodos = completedTodos.filter((todo) => todo.key !== key);
    setCompletedTodos(updatedTodos);

    // Mettre à jour également dans AsyncStorage
    const allTodos = await AsyncStorage.getItem('todos');
    if (allTodos) {
      const todos = JSON.parse(allTodos).filter((todo) => todo.key !== key);
      await AsyncStorage.setItem('todos', JSON.stringify(todos));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Tâches Réalisées</Text>
      <FlatList
        data={completedTodos}
        renderItem={({ item }) => (
          <TodoItem
            todo={item}
            goToDetails={() =>
              navigation.navigate('Details', {
                key: item.key,
                text: item.text,
                category: item.category,
                priority: item.priority,
              })
            }
            deleteTodo={() => deleteTodo(item.key)} // Passer deleteTodo en prop
          />
        )}
        keyExtractor={(item) => item.key}
        ListEmptyComponent={<Text>Aucune tâche réalisée pour le moment.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default CompletedTasksScreen;
