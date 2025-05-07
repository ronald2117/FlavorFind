import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { auth } from '../firebaseConfig';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import MyRecipesScreen from './MyRecipesScreen';
import MyRepostsScreen from './MyRepostsScreen';
import MyLikesScreen from './MyLikesScreen';
import { useNavigation } from '@react-navigation/native';

const Tab = createMaterialTopTabNavigator();

export default function AccountScreen() {
  const navigation = useNavigation();
  const user = auth.currentUser;
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.name}>{user.displayName || 'Username'}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
          <Text style={styles.edit}>Edit Profile</Text>
        </TouchableOpacity>
      </View>
      <Tab.Navigator screenOptions={{ tabBarStyle: styles.tabBar, tabBarIndicatorStyle: styles.indicator }}>
        <Tab.Screen name="Recipes" component={MyRecipesScreen} />
        <Tab.Screen name="Reposts" component={MyRepostsScreen} />
        <Tab.Screen name="Likes" component={MyLikesScreen} />
      </Tab.Navigator>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { padding: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  name: { color: '#fff', fontSize: 24 },
  email: { color: '#aaa', fontSize: 14 },
  edit: { color: '#1E90FF', fontSize: 16 },
  tabBar: { backgroundColor: '#111' },
  indicator: { backgroundColor: '#1E90FF' }
});
