import React from 'react';
import { NavigationContainer, NavigationIndependentTree } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from "./Home";
import ProgressScreen from "./ProgressScreen";
import AddNoteScreen from "./AddNote";
import DetailsScreen from "./Detail";
import LogInScreen from "./LogIn";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ color, size }) => {
        let icon = route.name === 'Home' ? 'home' : 'bar-chart';
        return <Ionicons name={icon} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#007bff',
      tabBarInactiveTintColor: 'gray',
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Завдання' }} />
    <Tab.Screen name="Progress" component={ProgressScreen} options={{ title: 'Прогрес' }} />
  </Tab.Navigator>
);

export const Navigation = () => {
  return (
    <NavigationIndependentTree>
        <NavigationContainer>
        <Stack.Navigator>
         <Stack.Screen name="LogIn" component={LogInScreen} options={{ title: 'Логін' }} />
            <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
            <Stack.Screen name="AddNote" component={AddNoteScreen} options={{ title: 'Нова нотатка' }} />
            <Stack.Screen name="Details" component={DetailsScreen} options={{ title: 'Деталі' }} />
        </Stack.Navigator>
        </NavigationContainer>
    </NavigationIndependentTree>
  );
};
