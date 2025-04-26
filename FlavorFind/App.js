import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebaseConfig';

import SignInScreen from './screens/SignInScreen';
import SignUpScreen from './screens/SignUpScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import NewsFeedScreen from './screens/NewsFeedScreen';
import AiRecipeScreen from './screens/AiRecipeScreen';
import CreatePostScreen from './screens/CreatePostScreen';
import SavedRecipesScreen from './screens/SavedRecipesScreen';
import AccountScreen from './screens/AccountScreen';
import AiRecipeFormScreen from './screens/AiRecipeFormScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function AppTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Feed" component={NewsFeedScreen} /* options={{ tabBarIcon: ... }} */ />
      <Tab.Screen name="AI Recipe" component={AiRecipeNavigator} /* options={{ tabBarIcon: ... }} */ />
      <Tab.Screen name="Create" component={CreatePostScreen} /* options={{ tabBarIcon: ... }} */ />
      <Tab.Screen name="Saved" component={SavedRecipesScreen} /* options={{ tabBarIcon: ... }} */ />
      <Tab.Screen name="Account" component={AccountScreen} /* options={{ tabBarIcon: ... }} */ />
    </Tab.Navigator>
  );
}

const AiStack = createNativeStackNavigator();
function AiRecipeNavigator() {
    return (
        <AiStack.Navigator screenOptions={{ headerShown: false }}>
            <AiStack.Screen name="AiForm" component={AiRecipeFormScreen} />
            <AiStack.Screen name="AiResult" component={AiRecipeScreen} />
        </AiStack.Navigator>
    );
}

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      {/* <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} /> */}
    </Stack.Navigator>
  );
}

export default function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (initializing) {
        setInitializing(false);
      }
    });

    return unsubscribe;
  }, []);

  if (initializing) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <AppTabs /> : <AuthStack />}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});