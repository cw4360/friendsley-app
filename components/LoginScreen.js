import React, { useState, useContext } from "react";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Button, ScrollView, Text, TextInput, 
    TouchableOpacity, View } from 'react-native';
import Constants from 'expo-constants';
import { globalStyles } from "../styles/globalStyles";
import StateContext from './StateContext';

import { 
    // for email/password authentication: 
    createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification,
    // for logging out:
    signOut
  } from "firebase/auth";
import { 
    // for storage access
    doc, getDoc
    // , collection, addDoc, setDoc,
    // query, where, getDocs
} from "firebase/firestore";

function formatJSON(jsonVal) {
  return JSON.stringify(jsonVal, null, 2);
}

function emailOf(user) {
    if (user) {
        return user.email;
    } else {
        return null;
    }
}

export default function LoginScreen(props) {
    const stateProps = useContext(StateContext);
    const auth = stateProps.auth;
    const db = stateProps.db;

    const loggedInUser = stateProps.loggedInUser; 
    const setLoggedInUser = stateProps.setLoggedInUser; 
    const userProfileDoc = stateProps.userProfileDoc; 
    const setUserProfileDoc = stateProps.setUserProfileDoc; 

    const [email, setEmail] = React.useState("cw4@wellesley.edu");
    const [password, setPassword] = React.useState("123456");
    const [errorMsg, setErrorMsg] = React.useState(''); 


    // Download all the data of the current user once they are successfully logged in (right before call to navigate to Explore screen) - local database will be one of the StateProps (ex stateProps.setLoggedInUser('VALUE'))
    // However, download messages from Firestore every 5-10 minutes (are there messages sooner than this timestamp about me)
    

    // Receive and set logged-in user's profile from Firebase into stateProps
    async function firebaseGetUserProfile(email) {
      const docRef = doc(db, "profiles", email);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // console.log("Document data:", docSnap.data());
        let userDoc = docSnap.data();
        return userDoc;
        // setUserProfileDoc(userDoc); 
        // console.log("Set userProfileDoc to:", formatJSON(userProfileDoc));
      } else {
        // doc.data() will be undefined in this case
        console.log("No such profile document!");
      }

  }

    function signInUserEmailPassword() {
        console.log('called signInUserEmailPassword');
        console.log(`signInUserEmailPassword: emailOf(currentUser)0=${emailOf(auth.currentUser)}`); 
        console.log(`signInUserEmailPassword: emailOf(loggedInUser)0=${emailOf(loggedInUser)}`); 
        // Invoke Firebase authentication API for Email/Password sign in 
        // Use Email/Password for authentication 
        signInWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            console.log(`signInUserEmailPassword succeeded for email ${email}; have userCredential for emailOf(auth.currentUser)=${emailOf(auth.currentUser)} (but may not be verified)`); 
            console.log(`signInUserEmailPassword: emailOf(currentUser)1=${emailOf(auth.currentUser)}`); 
            console.log(`signInUserEmailPassword: emailOf(loggedInUser)1=${emailOf(loggedInUser)}`); 
    
            // Only log in auth.currentUser if their email is verified
            checkEmailVerification();

            // Set logged-in user's profile in stateProps
            // FirebaseGetUserProfile is a promise - doesn't return the actual data (need an await?)
            firebaseGetUserProfile(auth.currentUser.email).then( (value) => {
              setUserProfileDoc(value);
              console.log("After then:", value); // Prints correct statement
              // However, why is userProfileDoc still considered null even after the promise is resolved??
              console.log("After then:", formatJSON(userProfileDoc)); 
            });
            
            // Clear email/password inputs 
            setEmail('');
            setPassword('');
    
            // Note: could store userCredential here if wanted it later ...
            // console.log(`createUserWithEmailAndPassword: setCredential`);
            // setCredential(userCredential);

            // If the current-logged in user has been verified, log them in and navigate to to the Explore page 
            props.navigation.navigate("Friendsley"); 
        
            })
          .catch((error) => {
            console.log(`signUpUserEmailPassword: sign in failed for email ${email}`);
            const errorMessage = error.message;
            // const errorCode = error.code; // Could use this, too.
            console.log(`signInUserEmailPassword: ${errorMessage}`);
            setErrorMsg(`signInUserEmailPassword: ${errorMessage}`);
          });
    }

    function checkEmailVerification() {
        if (auth.currentUser) {
          console.log(`checkEmailVerification: auth.currentUser.emailVerified=${auth.currentUser.emailVerified}`);
          if (auth.currentUser.emailVerified) {
            console.log(`checkEmailVerification: setLoggedInUser for ${auth.currentUser.email}`);
            setLoggedInUser(auth.currentUser.email);
            console.log('auth.currentUser:', formatJSON(auth.currentUser));
            console.log('loggedInUser:', formatJSON(loggedInUser));
            console.log("checkEmailVerification: setErrorMsg('')")
            setErrorMsg('')
          } else {
            console.log('checkEmailVerification: remind user to verify email');
            setErrorMsg(`You cannot sign in as ${auth.currentUser.email} until you verify that this is your email address. You can verify this email address by clicking on the link in a verification email sent by this app to ${auth.currentUser.email}.`)
          }
        }
    }

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
    }

    return (
        <ScrollView>
        <View style={styles.screen}>
          <StatusBar style="auto" />
          <View style={loggedInUser === null ? styles.loginLogoutPane : styles.hidden}>
            <View style={styles.labeledInput}>
              <Text style={styles.inputLabel}>Email:</Text>
              <TextInput placeholder="Enter your email address" 
                style={styles.textInput} 
                value={email} 
                onChangeText={ textVal => setEmail(textVal)} />
            </View>
            <View style={styles.labeledInput}>
              <Text style={styles.inputLabel}>Password:</Text>
              <TextInput placeholder="Enter your password" 
                style={styles.textInput} 
                value={password} 
                onChangeText={ textVal => setPassword(textVal)} />
            </View>
            <View>
              {/* <TouchableOpacity style={styles.button}
                 onPress={() => signUpUserEmailPassword()}>
                <Text style={styles.buttonText}>Sign Up</Text>
              </TouchableOpacity>  */}
              <TouchableOpacity style={globalStyles.editProfileButton}
                 onPress={() => signInUserEmailPassword()}>
                <Text>Login</Text>
              </TouchableOpacity> 
            </View>
            <View style={errorMsg === '' ? styles.hidden : styles.errorBox}>
              <Text style={styles.errorMessage}>{errorMsg}</Text>
            </View>
          </View>
          <View style={loggedInUser === null ? styles.hidden : styles.loginLogoutPane}>
              <TouchableOpacity style={styles.button}
                 onPress={() => logOut()}>
                <Text style={styles.buttonText}>Log Out</Text>
              </TouchableOpacity> 
          </View>
          {/*
          <View>
            <Button title = "Go to View All Chats Screen" onPress = {() => props.navigation.navigate("View All Chats")}/>
          </View>
          */}
          <ScrollView style={styles.jsonContainer}>
            <Text style={styles.json}>Logged In User: {formatJSON(loggedInUser)}</Text>
          </ScrollView>
          {/* <ScrollView style={styles.jsonContainer}>
            <Text style={styles.json}>State Props: {formatJSON(stateProps)}</Text>
          </ScrollView> */}
         
        </View>
        </ScrollView>
      );
    }
    
    const styles = StyleSheet.create({
    screen: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    paddingTop: '30%'
    }, 
    loginLogoutPane: {
        flex: 3, 
        alignItems: 'center',
        justifyContent: 'center',
    }, 
    labeledInput: {
        width: "100%",
        alignItems: 'center',
        justifyContent: 'center',
    }, 
    inputLabel: {
        fontSize: 20,
    }, 
    textInput: {
        width: 300,
        fontSize: 20,
        borderRadius: 5,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderColor: "rgba(0, 0, 0, 0.2)",
        borderWidth: 1,
        marginBottom: 8,
    },
    buttonHolder: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',

    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 10,
        elevation: 3,
        backgroundColor: 'blue',
        margin: 5,
    },
    buttonText: {
        fontSize: 20,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
    },
    errorBox: {
        width: '80%',
        borderWidth: 1,
        borderStyle: 'dashed', // Lyn sez: doesn't seem to work 
        borderColor: 'red',
    },
    errorMessage: {
        color: 'red',
        padding: 10, 
    },
    hidden: {
        display: 'none',
    },
    visible: {
        display: 'flex',
    },
    jsonContainer: {
        flex: 1,
        width: '98%',
        borderWidth: 1,
        borderStyle: 'dashed', // Lyn sez: doesn't seem to work 
        borderColor: 'blue',
    },
    json: {
        padding: 10, 
        color: 'blue', 
    },
});
