import React, { useState, useEffect } from 'react'; 
import { View, StyleSheet, Modal, TextInput, Button, Alert } from 'react-native';
import TodoList from '../../components/TodoList';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

export default function HomeScreen() {
  const navigation = useNavigation();
  const [todos, setTodos] = useState([]);
  const [newTodoText, setNewTodoText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [editText, setEditText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [prioritySort, setPrioritySort] = useState('none');
  const [isAuthenticated, setIsAuthenticated] = useState(false); 
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState('');

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const storedTodos = await AsyncStorage.getItem('todos');
        if (storedTodos) {
          setTodos(JSON.parse(storedTodos));
        }
      } catch (error) {
        console.error("Erreur de chargement des tâches :", error);
      }
    };

    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        setIsAuthenticated(true);
      }
    };
    loadTodos();
    checkAuth();
  }, []);

  useEffect(() => {
    const saveTodos = async () => {
      try {
        await AsyncStorage.setItem('todos', JSON.stringify(todos));
      } catch (error) {
        console.error("Erreur de sauvegarde des tâches :", error);
      }
    };
    saveTodos();
  }, [todos]);

  const handleAddTodo = () => {
    if (newTodoText.trim().length > 0) {
      const priorityOptions = ['easy', 'medium', 'important'];
      const categoryOptions = ['générale', 'secondaire'];
      const randomPriority = priorityOptions[Math.floor(Math.random() * priorityOptions.length)];
      const randomCategory = categoryOptions[Math.floor(Math.random() * categoryOptions.length)];

      const newTodo = {
        key: Date.now().toString(), // Utilisation d'un timestamp pour une clé unique
        text: newTodoText,
        category: randomCategory,
        priority: randomPriority,
        completed: false,
      };

      setTodos([...todos, newTodo]);
      setNewTodoText('');
    }
  };

  const handleEditTodo = () => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.key === selectedTodo.key ? { ...todo, text: editText } : todo
      )
    );
    setModalVisible(false);
    setIsEditing(false);
  };

  const handleDeleteTodo = (key) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.key === key ? { ...todo, completed: true } : todo
      )
    );
  };

  const goToDetails = (todo) => {
    navigation.navigate('Details', {
      key: todo.key,
      text: todo.text,
      category: todo.category,
      priority: todo.priority,
    });
  };

  const handleLogin = async () => {
    try {
      const response = await fetch('https://reqres.in/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (data.token) {
        await AsyncStorage.setItem('token', data.token);
        setIsAuthenticated(true);
        Alert.alert('Authentification réussie');
      } else {
        Alert.alert('Erreur d’authentification');
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de se connecter au serveur');
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    setIsAuthenticated(false);
    setEmail('');
    setPassword('');
    Alert.alert('Déconnexion réussie');
  };

  const getFilteredAndSortedTodos = () => {
    let filteredTodos = todos.filter(
      (todo) =>
        !todo.completed &&
        (categoryFilter === 'All' || todo.category.toLowerCase() === categoryFilter.toLowerCase())
    );

    if (prioritySort !== 'none') {
      filteredTodos = filteredTodos.sort((a, b) => {
        const priorityOrder = { important: 1, medium: 2, easy: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });
    }

    return filteredTodos;
  };

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Mot de passe"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <Button title="Se Connecter" onPress={handleLogin} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Button title="Se Déconnecter" onPress={handleLogout} />
      <Picker
        style={{ height: 50, width: 150 }}
        selectedValue={categoryFilter}
        onValueChange={(itemValue) => setCategoryFilter(itemValue)}
      >
        <Picker.Item label="Toutes" value="All" />
        <Picker.Item label="Générale" value="générale" />
        <Picker.Item label="Secondaire" value="secondaire" />
      </Picker>

      <Picker
        selectedValue={prioritySort}
        onValueChange={(itemValue) => setPrioritySort(itemValue)}
        style={{ height: 50, width: 150 }}
      >
        <Picker.Item label="Aucun tri" value="none" />
        <Picker.Item label="Important d'abord" value="important" />
        <Picker.Item label="Moyenne d'abord" value="medium" />
        <Picker.Item label="Facile d'abord" value="easy" />
      </Picker>

      <TodoList
        todos={getFilteredAndSortedTodos()}
        openEditModal={(todo) => {
          setSelectedTodo(todo);
          setEditText(todo.text);
          setIsEditing(true);
          setModalVisible(true);
        }}
        deleteTodo={handleDeleteTodo}
        goToDetails={goToDetails}
        completed={false}
      />

      <TextInput
        style={styles.input}
        value={newTodoText}
        onChangeText={setNewTodoText}
        placeholder="Ajouter une nouvelle tâche"
      />
      <Button title="Ajouter Tâche" onPress={handleAddTodo} />

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalView}>
          <TextInput
            style={styles.input}
            value={editText}
            onChangeText={setEditText}
            placeholder="Modifier la tâche"
          />
          <Button title="Confirmer" onPress={handleEditTodo} />
          <Button title="Annuler" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    backgroundColor: 'white',
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
});
