import React, {useState} from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import {  Provider as PaperProvider, } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ProfileScreen from './components/ProfileScreen';
import ExploreScreen from './components/ExploreScreen';
import LoginScreen from './components/LoginScreen';
import EditProfileScreen from './components/EditProfileScreen';
import WelcomeScreen from './components/WelcomeScreen';
import SignupScreen from './components/SignupScreen';
import MessageScreen from './components/MessageScreen';
import ViewAllChatsScreen from './components/ViewAllChatsScreen'; 
import SettingsScreen from './components/SettingsScreen';
import StateContext from './components/StateContext'; 

// Importing Firebase Authentication, Cloud Firestore, and Storage
import { initializeApp } from "firebase/app"
import { 
  // access to authentication features:
  getAuth, 
} from "firebase/auth";
import { 
  // access to Firestore storage features:
  getFirestore, 
} from "firebase/firestore";
import { // access to Firebase storage features (for files like images, video, etc.)
  getStorage, 
 ref, uploadBytes, uploadBytesResumable, getDownloadURL
} from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDr-0jgwaW6Bt000SLQSRdGa7BnIpOADuY",
  authDomain: "friendsley-beta.firebaseapp.com",
  projectId: "friendsley-beta",
  storageBucket: "friendsley-beta.appspot.com",
  messagingSenderId: "245899568973",
  appId: "1:245899568973:web:1262fca5b52879ea5f3904"
};
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp, 
  firebaseConfig.storageBucket) // for storaging images in Firebase storage

const MessageStack = createNativeStackNavigator();

function MessageStackScreen() {
  return (
    <MessageStack.Navigator>
      <MessageStack.Screen name="View All Chats" component={ViewAllChatsScreen}/>
      <MessageStack.Screen name="Message" component={MessageScreen}/>
    </MessageStack.Navigator>
  );
}

const ProfileStack = createNativeStackNavigator();

function ProfileStackScreen() {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen name="Profile" component={ProfileScreen}/>
      <ProfileStack.Screen name="Edit Profile" component={EditProfileScreen}/>
    </ProfileStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

function HomeTabs() {
  return (
    <Tab.Navigator screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'Explore') {
        iconName = focused
            ? 'compass'
            : 'compass-outline'; // options: earth
        } else if (route.name === 'Messages') {
        iconName = focused ? 'md-chatbubble-ellipses' : 'md-chatbubble-ellipses-outline';
        } else if (route.name === 'Profile') {
        iconName = focused ? 'md-person-circle' : 'md-person-circle-outline';
        } else if (route.name === 'Settings') {
        iconName = focused ? 'settings' : 'settings-outline';
        }

        return <Ionicons name={iconName} size={size} color={color} />;
        },
      tabBarActiveTintColor: '#4361EE',
      tabBarInactiveTintColor: '#808080'
    })}>
      <Tab.Screen name="Explore" component={ExploreScreen}/>
      <Tab.Screen name="Messages" component={MessageStackScreen}
        options={{headerShown: false}}/>
      <Tab.Screen name="Profile Stack" component={ProfileStackScreen}
        options={{ title: 'Profile', headerShown: false}}/>
      <Tab.Screen name="Settings" component={SettingsScreen}/>
    </Tab.Navigator>
  );
}

const Stack = createNativeStackNavigator();

export default function App() {
  // const [signedInUser, setSignedInUser] = useState(null); 
  // const signInUser = username => (setSignedInUser(username));
  // const signOutUser = () => (setSignedInUser(null)); // Only the settings screen needs access to this, because the logout button will be on that screen
  // // Properties to pass to the rest of the screens
  // const stateProps = { signedInUser, signInUser, signOutUser, auth, db }; 
  const [loggedInUser, setLoggedInUser] = React.useState(null); // 
  const [userProfileDoc, setUserProfileDoc] = React.useState(null); 
  const [allProfiles, setAllProfiles] = React.useState([]); 
  const stateProps = { auth, db, storage, loggedInUser, setLoggedInUser, userProfileDoc, setUserProfileDoc, allProfiles, setAllProfiles};

  return (
    <StateContext.Provider value = {stateProps}>
      <PaperProvider>
        <NavigationContainer>
          <Stack.Navigator 
          screenOptions={{
            headerShown: false
          }}>
            <Stack.Screen name="Welcome" component={WelcomeScreen}/>
            <Stack.Screen name="Sign Up" component={SignupScreen}
              options={{headerShown: true}}/>
            <Stack.Screen name="Login" component={LoginScreen}
              options={{headerShown: true}}/>
            <Stack.Screen name="Friendsley" component={HomeTabs}/>
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider> 
    </StateContext.Provider>
  );
}

