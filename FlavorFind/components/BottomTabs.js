import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, Image } from 'react-native';

import NewsFeedScreen from '../screens/NewsFeedScreen';
import AiRecipeFormScreen from '../screens/AiRecipeFormScreen';
import CreatePostScreen from '../screens/CreatePostScreen';
import SavedRecipesScreen from '../screens/SavedRecipesScreen';
import AccountScreen from '../screens/AccountScreen';
import FlavorBotLogo from './FlavorBotLogo';

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#111',
          borderTopColor: 'gray',
          height: 70,
          paddingTop: 10,
          paddingBottom: 10,
        },
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#888',
      }}
    >
      <Tab.Screen 
        name="Feed" 
        component={NewsFeedScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="AI Recipe" 
        component={AiRecipeFormScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FlavorBotLogo/>
          ),
        }}
      />
      <Tab.Screen 
        name="Create" 
        component={CreatePostScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle-outline" size={28} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Saved" 
        component={SavedRecipesScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bookmark-outline" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Account" 
        component={AccountScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle-outline" size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
