import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { auth } from '../firebaseConfig';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import MyRecipesScreen from './MyRecipesScreen';
import MyRepostsScreen from './MyRepostsScreen';
import MyLikesScreen from './MyLikesScreen';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DefaultProfilePic from '../components/DefaultProfilePic';

const Tab = createMaterialTopTabNavigator();

export default function AccountScreen() {
    const navigation = useNavigation();
    const user = auth.currentUser;
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.name}>{user.displayName || 'Username'}</Text>
                    <Text style={styles.email}>{user.email}</Text>
                </View>
                <View style={{ alignItems: 'center' }}>
                    <DefaultProfilePic width={90} height={90} />
                    <TouchableOpacity onPress={() => navigation.navigate('EditProfile')} style={styles.editButton}>
                        <Text style={styles.edit}>Edit Profile</Text>
                    </TouchableOpacity>

                </View>
            </View>
            <Tab.Navigator 
            screenOptions={{
                tabBarActiveTintColor: '#FFFFFF',   // Active tab label color
                tabBarInactiveTintColor: '#A0A0A0', // Inactive tab label color
                tabBarStyle: styles.tabBar,
                tabBarLabelStyle: styles.tabBarLabel,
                tabBarIndicatorStyle: styles.tabBarIndicator,
              }} T>
                <Tab.Screen name="Recipes" component={MyRecipesScreen} />
                <Tab.Screen name="Reposts" component={MyRepostsScreen} />
                <Tab.Screen name="Likes" component={MyLikesScreen} />
            </Tab.Navigator>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    header: { padding: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    name: { color: '#fff', fontSize: 24 },
    email: { color: '#aaa', fontSize: 14 },
    edit: {
        color: '#FFFFFF',         
        fontSize: 16,            
        fontWeight: 'bold',
    },
    tabBar: { backgroundColor: '#111', color: '#fff' },
    tabBarLabelStyle: { fontSize: 14, color: '#fff' },
    indicator: { backgroundColor: '#1E90FF' },
    profilePic: { width: 60, height: 60, borderRadius: 25, marginRight: 8 },
    editButton: {
        backgroundColor: '#000',
        paddingVertical: 8,
        paddingHorizontal: 25,    
        borderRadius: 10,         
        borderWidth: 1,
        borderColor: '#757575',   
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',    
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 1.0,
        elevation: 2,
    },
});
