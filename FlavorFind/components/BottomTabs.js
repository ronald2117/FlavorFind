import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

import NewsFeedScreen from "../screens/NewsFeedScreen";
import AiRecipeFormScreen from "../screens/AiRecipeFormScreen";
import AiRecipeResultScreen from "../screens/AiRecipeResultScreen";
import CreatePostScreen from "../screens/CreatePostScreen";
import SavedRecipesScreen from "../screens/SavedRecipesScreen";
import AccountScreen from "../screens/AccountScreen";
import FlavorBotLogo from "./FlavorBotLogo";
import FlavorBotLogoBNW from "./FlavorBotLogoBNW";
import ViewPostScreen from "../screens/ViewPostScreen";
import EditProfileScreen from "../screens/EditProfileScreen";
import ChangeEmailScreen from "../screens/ChangeEmailScreen";
import ChangePasswordScreen from "../screens/ChangePasswordScreen";
import SettingsScreen from "../screens/SettingsScreen";
import { useTheme } from "../ThemeContext";
import FlavorBotMenu from  "../screens/FlavorBotMenu";
import FlavorBotChatScreen from "../screens/FlavorBotChatScreen";

const AiStack = createNativeStackNavigator();
function AiRecipeNavigator() {
  return (
    <AiStack.Navigator screenOptions={{ headerShown: false }}>
      <AiStack.Screen name="AiMenu" component={FlavorBotMenu} />
      <AiStack.Screen name="AiForm" component={AiRecipeFormScreen} />
      <AiStack.Screen name="AiChat" component={FlavorBotChatScreen} />
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

const SavedRecipesStack = createNativeStackNavigator();
function SavedRecipesNavigator() {
  return (
    <SavedRecipesStack.Navigator screenOptions={{ headerShown: false }}>
      <SavedRecipesStack.Screen
        name="SavedRecipes"
        component={SavedRecipesScreen}
      />
      <SavedRecipesStack.Screen name="ViewPost" component={ViewPostScreen} />
    </SavedRecipesStack.Navigator>
  );
}

const AccountStack = createNativeStackNavigator();
function AccountNavigator() {
  return (
    <AccountStack.Navigator screenOptions={{ headerShown: false }}>
      <AccountStack.Screen name="Account" component={AccountScreen} />
      <AccountStack.Screen name="ViewPost" component={ViewPostScreen} />
      <AccountStack.Screen name="EditProfile" component={EditProfileScreen} />
      <AccountStack.Screen name="ChangeEmail" component={ChangeEmailScreen} />
      <AccountStack.Screen name="ChangePassword" component={ChangePasswordScreen} />
      <AccountStack.Screen name="Settings" component={SettingsScreen} />
    </AccountStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.background,
          borderTopWidth: 1,
          borderTopColor: theme.text,
          borderTopStyle: 'solid',
          height: 70,
          paddingTop: 10,
          paddingBottom: 10,
          elevation: 0, 
          shadowOpacity: 0, 
          shadowColor: 'transparent',
          shadowOffset: { height: 0 }, 
        },
        tabBarShowLabel: false,
        tabBarActiveTintColor: theme.text,
        tabBarInactiveTintColor: theme.inactiveTab,
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
          tabBarIcon: ({ focused }) =>
            focused ? <FlavorBotLogo /> : <FlavorBotLogoBNW theme={theme.inactiveTab} />,
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
        component={SavedRecipesNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bookmark-outline" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Account"
        component={AccountNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle-outline" size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
