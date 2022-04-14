import React from 'react';
import { StatusBar } from 'expo-status-bar';
import {  Provider as PaperProvider, } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, LogBox } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ProfileScreen from './components/ProfileScreen';
import ExploreScreen from './components/ExploreScreen';
import ExploreProfileScreen from './components/ExploreProfileScreen';
import LoginScreen from './components/LoginScreen';
import EditProfileScreen from './components/EditProfileScreen';
import FavoriteProfilesScreen from './components/FavoriteProfilesScreen';
import WelcomeScreen from './components/WelcomeScreen';
import SignupScreen from './components/SignupScreen';
import MessageScreen from './components/MessageScreen';
import ViewAllChatsScreen from './components/ViewAllChatsScreen'; 
import SettingsScreen from './components/SettingsScreen';
import StateContext from './components/StateContext'; 

// Importing fonts
import {
  useFonts,
  DMSans_400Regular,
  DMSans_400Regular_Italic,
  DMSans_500Medium,
  DMSans_500Medium_Italic,
  DMSans_700Bold,
  DMSans_700Bold_Italic,
} from '@expo-google-fonts/dm-sans';
import {
  RobotoMono_400Regular,
  RobotoMono_500Medium,
  RobotoMono_400Regular_Italic,
} from '@expo-google-fonts/roboto-mono'

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
import {
  // access to Firebase storage features (for files like images, video, etc.)
  getStorage, 
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
// for storaging images in Firebase storage
const storage = getStorage(firebaseApp, firebaseConfig.storageBucket) 

const ExploreStack = createNativeStackNavigator();
function ExploreStackScreen() {
  return (
    <ExploreStack.Navigator screenOptions={{
      headerTitleAlign: 'center',
      headerStyle: {
        backgroundColor: "#FFF0BB",
      },
      headerTitleStyle: {
        fontFamily: "RobotoMono_500Medium"
      },
    }}>
      <ExploreStack.Screen name="Explore" component={ExploreScreen}/>
      <ExploreStack.Screen name="Explore Profile" component={ExploreProfileScreen}/>
    </ExploreStack.Navigator>
  );
}

const MessageStack = createNativeStackNavigator();
function MessageStackScreen() {
  return (
    <MessageStack.Navigator screenOptions={{
      headerTitleAlign: 'center',
      headerStyle: {
        backgroundColor: "#FFF0BB",
      },
      headerTitleStyle: {
        fontFamily: "RobotoMono_500Medium"
      },
    }}>
      <MessageStack.Screen name="View All Chats" component={ViewAllChatsScreen}
        options={{ title: 'All Chats'}}/>
      <MessageStack.Screen name="Message" component={MessageScreen}/>
    </MessageStack.Navigator>
  );
}

const ProfileStack = createNativeStackNavigator();
function ProfileStackScreen() {
  return (
    <ProfileStack.Navigator screenOptions={{
      headerTitleAlign: 'center',
      headerStyle: {
        backgroundColor: "#FFF0BB",
      },
      headerTitleStyle: {
        fontFamily: "RobotoMono_500Medium"
      },
    }}>
      <ProfileStack.Screen name="Profile" component={ProfileScreen}/>
      <ProfileStack.Screen name="Edit Profile" component={EditProfileScreen}/>
      <ProfileStack.Screen name="Favorite Profiles" component={FavoriteProfilesScreen}/>
    </ProfileStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();
function HomeTabs() {
  return (
    <Tab.Navigator screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'Explore Stack') {
        iconName = focused ? 'compass' : 'compass-outline';
        } else if (route.name === 'Messages') {
        iconName = focused ? 'md-chatbubble-ellipses' : 'md-chatbubble-ellipses-outline';
        } else if (route.name === 'Profile Stack') {
        iconName = focused ? 'md-person-circle' : 'md-person-circle-outline';
        } else if (route.name === 'Settings') {
        iconName = focused ? 'settings' : 'settings-outline';
        }

        return <Ionicons name={iconName} size={size} color={color} />;
        },
        
      tabBarActiveTintColor: '#5971B5',
      tabBarInactiveTintColor: '#808080',
      headerTitleAlign: 'center',
      headerStyle: {
        backgroundColor: "#FFF0BB",
      },
      headerTitleStyle: {
        fontFamily: "RobotoMono_500Medium"
      },
    })}>
      <Tab.Screen name="Explore Stack" component={ExploreStackScreen}
        options={{ title: 'Explore', headerShown: false}}/>
      <Tab.Screen name="Messages" component={MessageStackScreen}
        options={{headerShown: false}}/>
      <Tab.Screen name="Profile Stack" component={ProfileStackScreen}
        options={{ title: 'Profile', headerShown: false}}/>
      <Tab.Screen name="Settings" component={SettingsScreen}/>
    </Tab.Navigator>
  );
}

// The log box is the error console that appears. This is telling the console to not send us 
// any error messages relating to setting a timer or asyncStorage.
LogBox.ignoreLogs([
  'Setting a timer',
  'AsyncStorage',                                	 
]);


const Stack = createNativeStackNavigator();
export default function App() {
  // React hooks for React context
  const [loggedInUser, setLoggedInUser] = React.useState(null); 
  const [userProfileDoc, setUserProfileDoc] = React.useState(null); 
  const [allProfiles, setAllProfiles] = React.useState([]); 
  const stateProps = { auth, db, storage, loggedInUser, setLoggedInUser, userProfileDoc, setUserProfileDoc, allProfiles, setAllProfiles};

  // Loading fonts DM Sans and Roboto Mono
  let [fontsLoaded] = useFonts({
    DMSans_400Regular,
    DMSans_400Regular_Italic,
    DMSans_500Medium,
    DMSans_500Medium_Italic,
    DMSans_700Bold,
    DMSans_700Bold_Italic,
    RobotoMono_400Regular,
    RobotoMono_500Medium,
    RobotoMono_400Regular_Italic,
  });

  // If fonts haven't loaded then display an empty View
  if (!fontsLoaded) {
    return (
        <View></View>
    );
  }  else { 
  // Else, display the app
    return (
      <StateContext.Provider value = {stateProps}>
        <PaperProvider>
          <NavigationContainer>
            <StatusBar style="auto" />
            <Stack.Navigator 
            screenOptions={{
              // Catherine: look into
              headerShown: false,
              headerTitleAlign: 'center',
              contentStyle:{
                backgroundColor: '#FFF0BB'
              },
              headerStyle: {
                backgroundColor: "#FFF0BB",
              },
              headerTitleStyle: {
                fontFamily: "RobotoMono_500Medium"
              }
            }}>
              {/* At the highest level, there is a stack of 4 screens that one can navigate to */}
              <Stack.Screen name="Welcome" component={WelcomeScreen}/>
              <Stack.Screen name="Sign Up" component={SignupScreen}
                options={{headerShown: true}}/>
              <Stack.Screen name="Login" component={LoginScreen}
                options={{headerShown: true}}/>
              {/* Home Tabs is a component that uses tab navigation */}
              <Stack.Screen name="Friendsley" component={HomeTabs}/>
            </Stack.Navigator>
          </NavigationContainer>
        </PaperProvider> 
      </StateContext.Provider>
    );
  }
}

