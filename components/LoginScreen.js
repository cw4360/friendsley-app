import React, { useState, useContext } from "react";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Button, ScrollView, Text, TextInput, 
    TouchableOpacity, View } from 'react-native';
import Constants from 'expo-constants';
import StateContext from './StateContext';

import { 
    // for email/password authentication: 
    createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification,
    // for logging out:
    signOut
  } from "firebase/auth";
import { 
    // access to Firestore storage features:
    // for storage access
    collection, doc, addDoc, setDoc,
    query, where, getDoc, getDocs
} from "firebase/firestore";

function formatJSON(jsonVal) {
// Lyn sez: replacing \n by <br/> not necesseary if use this CSS:
//   white-space: break-spaces; (or pre-wrap)
// let replacedNewlinesByBRs = prettyPrintedVal.replace(new RegExp('\n', 'g'), '<br/>')
//console.log(JSON.stringify(jsonVal, null, 2)); 
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
        console.log("Document data:", docSnap.data());
        let userDoc = docSnap.data();
        setUserProfileDoc(userDoc); 
      } else {
        // doc.data() will be undefined in this case
        console.log("No such profile document!");
      }

  }

    // function signUpUserEmailPassword() {
    //     if (auth.currentUser) {
    //         signOut(auth); // sign out auth's current user (who is not loggedInUser, 
    //                        // or else we wouldn't be here
    //     }
    //     if (!email.includes('@wellesley.edu')) {
    //         setErrorMsg('Not a valid Wellesley email address');
    //         return;
    //     }
    //     if (password.length < 6) {
    //         setErrorMsg('Password too short');
    //         return;
    //     }   
    //     // Invoke Firebase authentication API for Email/Password sign up 
    //     createUserWithEmailAndPassword(auth, email, password)
    //     .then((userCredential) => {
    //         console.log(`signUpUserEmailPassword: sign up for email ${email} succeeded (but email still needs verification).`);

    //         // Clear email/password inputs
    //         const savedEmail = email; // Save for email verification
    //         setEmail('');
    //         setPassword('');

    //         // Note: could store userCredential here if wanted it later ...
    //         // console.log(`createUserWithEmailAndPassword: setCredential`);
    //         // setCredential(userCredential);

    //         // Send verication email
    //         console.log('signUpUserEmailPassword: about to send verification email');
    //         sendEmailVerification(auth.currentUser)
    //         .then(() => {
    //             console.log('signUpUserEmailPassword: sent verification email');
    //             setErrorMsg(`A verification email has been sent to ${savedEmail}. You will not be able to sign in to this account until you click on the verification link in that email.`); 
    //             // Email verification sent!
    //             // ...
    //         });
    //     })
    //     .catch((error) => {
    //         console.log(`signUpUserEmailPassword: sign up failed for email ${email}`);
    //         const errorMessage = error.message;
    //         // const errorCode = error.code; // Could use this, too.
    //         console.log(`createUserWithEmailAndPassword: ${errorMessage}`);
    //         setErrorMsg(`createUserWithEmailAndPassword: ${errorMessage}`);
    //     });
    // }

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
            firebaseGetUserProfile(auth.currentUser.email);
            console.log("CURRENT USER", userProfileDoc); // AT THIS POINT, USERPROFILEDOC IS STILL NULL - which is why the thing is returning null
    
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
            <View style={styles.buttonHolder}>
              {/* <TouchableOpacity style={styles.button}
                 onPress={() => signUpUserEmailPassword()}>
                <Text style={styles.buttonText}>Sign Up</Text>
              </TouchableOpacity>  */}
              <TouchableOpacity style={styles.button}
                 onPress={() => signInUserEmailPassword()}>
                <Text style={styles.buttonText}>Login</Text>
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
