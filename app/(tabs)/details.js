import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';

const TaskDetailScreen = () => {
  const route = useRoute();
  const { key, text, category, priority } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Détails de la Tâche</Text>
      <Text style={styles.detailText}>ID de la tâche: {key}</Text>
      <Text style={styles.detailText}>Texte de la tâche: {text}</Text>
      <Text style={styles.detailText}>Catégorie: {category}</Text>
      <Text style={styles.detailText}>Priorité: {priority}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  detailText: {
    fontSize: 18,
    marginBottom: 10,
  },
});

export default TaskDetailScreen;
