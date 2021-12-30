import React, { useContext } from "react";
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { globalStyles } from '../styles/globalStyles';
import StateContext from './StateContext';

import { // access to authentication features:
    getAuth, 
    // for email/password authentication: 
    createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification,
    // for logging out:
    signOut
} from "firebase/auth";

function emailOf(user) {
    if (user) {
        return user.email;
    } else {
        return null;
    }
}

export default function SettingsScreen(props) {
    const stateProps = useContext(StateContext);
    const auth = stateProps.auth;

    const loggedInUser = stateProps.loggedInUser; 
    const setLoggedInUser = stateProps.setLoggedInUser; 
    const setUserProfileDoc = stateProps.setUserProfileDoc; 

    function logOut() {
        console.log('logOut'); 
        console.log(`logOut: emailOf(auth.currentUser)=${emailOf(auth.currentUser)}`);
        console.log(`logOut: emailOf(loggedInUser)=${emailOf(loggedInUser)}`);
        console.log(`logOut: setLoggedInUser(null)`);
        setLoggedInUser(null);
        console.log('logOut: signOut(auth)');
        setUserProfileDoc(null);
        console.log('logOut: setUserProfileDoc(null)');
        signOut(auth); // Will eventually set auth.currentUser to null  
        props.navigation.navigate("Login");   
    }
    
    return (
        <SafeAreaView style={{flex: 1, backgroundColor: '#FFF0BB'}}>
            <View style={globalStyles.userInfoSection}>
                <TouchableOpacity style={globalStyles.editProfileButton}
                    onPress={() => logOut()}>
                    <Text style={globalStyles.buttonText}>Log Out</Text>
                </TouchableOpacity> 
                {/* <Text>{signedInProps.signedInUser}</Text> */}
            </View>
        </SafeAreaView>
    );
}