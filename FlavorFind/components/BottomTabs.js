import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import NewsFeedScreen from '../screens/NewsFeedScreen';
import AiRecipeFormScreen from '../screens/AiRecipeFormScreen';
import AiRecipeResultScreen from '../screens/AiRecipeResultScreen';
import CreatePostScreen from '../screens/CreatePostScreen';
import SavedRecipesScreen from '../screens/SavedRecipesScreen';
import AccountScreen from '../screens/AccountScreen';
import FlavorBotLogo from './FlavorBotLogo';
import FlavorBotLogoBNW from './FlavorBotLogoBNW';
import ViewPostScreen from '../screens/ViewPostScreen';

const AiStack = createNativeStackNavigator();
function AiRecipeNavigator() {
    return (
        <AiStack.Navigator screenOptions={{ headerShown: false }}>
            <AiStack.Screen name="AiForm" component={AiRecipeFormScreen} />
            <AiStack.Screen name="AiResult" component={AiRecipeResultScreen} />
        </AiStack.Navigator>
    );
}

const FeedStack = createNativeStackNavigator();
function PostNavigator() {
    return (
        <FeedStack.Navigator screenOptions={{ headerShown: false }}>
            <FeedStack.Screen name="NewsFeed" component={NewsFeedScreen} />
            <FeedStack.Screen name="ViewPost" component={ViewPostScreen} />
        </FeedStack.Navigator>
    );
}


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
        component={PostNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="AI Recipe" 
        component={AiRecipeNavigator}
        options={{
          tabBarIcon: ({ focused }) => (
            focused ? <FlavorBotLogo /> : <FlavorBotLogoBNW />
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
