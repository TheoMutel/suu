import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './(tabs)/index';
import CompletedTasksScreen from './(tabs)/completed';
import TaskDetailScreen from './(tabs)/details';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Accueil' }} />
      <Stack.Screen name="Details" component={TaskDetailScreen} options={{ title: 'Détails de la Tâche' }} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer independent={true}>
      <Tab.Navigator>
        <Tab.Screen 
          name="Accueil" 
          component={HomeStack} 
          options={{ headerShown: false }} // Désactive l'en-tête pour l'onglet Accueil
        />
        <Tab.Screen name="Tâches Réalisées" component={CompletedTasksScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
