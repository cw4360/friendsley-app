// NEW IDEA: MAKE THE CHANNELS THE PEOPLE THAT YOU MESSAGE, SOMEHOW LINK THE DESIRED CHANNEL TO THE 'MESSAGE' BUTTONS 
// OR: CREATE NEW DATA STRUCTURE IN FIREBASE (ASK CATHERINE) 
/* 
- This screen will be autopopulated with conversation you selected on the "View All Chats" screen
- Grab all messages relating to the currently-logged-in user 
*/

/*
import React, {useContext, useState} from 'react';
import { SafeAreaView, View, Text, TextInput, Button, Image, StyleSheet, 
    ScrollView, TouchableOpacity, FlatList, LogBox } from 'react-native';
import Constants from 'expo-constants';
import { StatusBar } from 'expo-status-bar';
//import {Picker} from '@react-native-picker/picker';
import { initializeApp } from "firebase/app";
import StateContext from './StateContext'; 

import { 
    // access to Firestore storage features:
    // for storage access
    collection, doc, addDoc, setDoc,
    query, where, getDoc, getDocs
} from "firebase/firestore";
import { getGlobal } from "@firebase/util";


export default function MessageScreen(props) {
    const stateProps = useContext(StateContext); 
    const auth = stateProps.auth;
    const db = stateProps.db;
    
    // Get the currently logged-in user
    const userEmail = auth.currentUser.email; 

    const messageRef = doc(db, "profile", "messages", "az1@wellesley.edu"); 
    const messageSnap = getDoc(messageSnap); 
    if (messageSnap.exists()) {
        console.log("Message data: ", messageSnap.data()); 
    }
    // Grab the messages from the stateProps that pertain to the current user
    // Implement "checks" of the database to grab new messages that relate to the current user 
    // Render the messages in a scrollable flatlist, color-code by sender and recipient 
    return (
        <View>
            <Text>Messaging!</Text>
        </View>
    );
}
*/

/*
TODO: 
- Make sure that picker for people maps to actual people in the database
- Turn channels/people picker into a side menu? https://blog.waldo.io/react-native-side-menu-guide/ (for 
the alpha version, this is just a picker)

DESIGN CHOICES FOR TESTING PURPOSES
- Keep the ability to log in/log out on the chat screen *for now* so that we can test. Later, we 
should get rid of it. We need to make it so that the log in screen "tells" the chat screen who the 
currently logged-in user is. 

- populateFirestoreDB - used to push a JSON file to Firestore 

*/

/*
TODO: 
- Make sure that picker for people maps to actual people in the database
- Turn channels/people picker into a side menu? https://blog.waldo.io/react-native-side-menu-guide/ (for 
the alpha version, this is just a picker)

DESIGN CHOICES FOR TESTING PURPOSES
- Keep the ability to log in/log out on the chat screen *for now* so that we can test. Later, we 
should get rid of it. We need to make it so that the log in screen "tells" the chat screen who the 
currently logged-in user is. 

- populateFirestoreDB - used to push a JSON file to Firestore 

*/

// MAJOR CREDITS TO PROFESSOR LYN TURBAK FOR THIS FILE!
import React, { useState, useEffect, useContext} from "react";
import { FlatList, LogBox, StyleSheet, ScrollView, 
         Text, TextInput, TouchableOpacity, View } from 'react-native';
import Constants from 'expo-constants';
import { StatusBar } from 'expo-status-bar';
import {Picker} from '@react-native-picker/picker';
import StateContext from './StateContext'; 
import { initializeApp } from "firebase/app";

// FUNCTIONS IMPORTED THAT ARE NECESSARY FOR AUTHENTICATION 
import { // access to authentication features:
         getAuth, 
         // for email/password authentication: 
         createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification,
         // for logging out:
         signOut
  } from "firebase/auth";
// FUNCTIONS THAT ARE NECESSARY FOR FIRESTORE STORAGE FEATURES 
import { // access to Firestore storage features:
         getFirestore, 
         // for storage access
         collection, doc, addDoc, setDoc,
         query, where, getDocs, getDoc
  } from "firebase/firestore";

// Your web app's Firebase configuration
/*
const firebaseConfig = {
    apiKey: "AIzaSyARNDuOf5tzOKziawLxsMFfuCm2lni7iyQ",
    authDomain: "friendsley-c2b46.firebaseapp.com",
    projectId: "friendsley-c2b46",
    storageBucket: "friendsley-c2b46.appspot.com",
    messagingSenderId: "409981044643",
    appId: "1:409981044643:web:0e2c3e27c1f1f2465c3c16",
    measurementId: "G-HS6EZPK4MR"
};
*/ 

/*
// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
// auth refers to Firebase authentication system 
const auth = getAuth(firebaseApp);
// db refers to Firebase database
const db = getFirestore(firebaseApp); // *** new for Firestore
*/ 

function formatJSON(jsonVal) {
  // Lyn sez: replacing \n by <br/> not necesseary if use this CSS:
  //   white-space: break-spaces; (or pre-wrap)
  // let replacedNewlinesByBRs = prettyPrintedVal.replace(new RegExp('\n', 'g'), '<br/>')
  return JSON.stringify(jsonVal, null, 2);
}

function emailOf(user) {
  if (user) {
    return user.email;
  } else {
    return null;
  }
}

const defaultChannels = ['Catherine Wang', 'Brianna Babylon', 'Carla Campbell', 'Diane Do', 'Eileen Evans', 'Faith Finley'];

const testMessages = 
[
 {'author': 'finz@gmail.com',
  'date': new Date(2021, 10, 29, 10, 43, 12, 1234), 
  'channel': 'Food', 
  'content': 'Want to join me for a Taza Chocolate tour next weekend?'
 },
 {'author': 'aardvark@gmail.com',                         
  'date': new Date(2021, 10, 29, 13, 12, 46, 1234), 
  'channel': 'Food', 
  'content': "I'm up for the chocolate tour!"
 }, 
 {'author': 'emerm@yahoo.com',                    
  'date': new Date(2021, 10, 29, 17, 33, 52, 1234), 
  'channel': 'Gatherings', 
  'content': 'Anyone want to play whist on Friday night?', 
 }, 
 {'author': 'ccameronk@gmail.com',                        
  'date': new Date(2021, 10, 30, 8, 7, 24, 1234), 
  'channel': 'Food', 
  'content': '+1 for Taza'
 }, 
 {'author': 'flyer@gmail.com',                        
  'date': new Date(2021, 11, 1, 20, 9, 37, 1234), 
  'channel': 'Outdoors', 
  'content': "I know it's cold, but it's still a great time for a Blue Hills hike. Anyone want to join me on Sunday morning?"
 }, 
 {'author': 'emerm@yahoo.com',                    
  'date': new Date(2021, 11, 1, 20, 10, 14, 1234), 
  'channel': 'Outdoors', 
  'content': 'Late fall is a great time to go foraging for forest nuts. Who wants to act like a squirrel with me?'
 }, 
 {'author': 'aa108@wellesley.edu',                         
  'date': new Date(2021, 11, 2, 9, 47, 18, 1234), 
  'channel': 'Food', 
  'content': "Thanksgiving may be over, but there are still so many pumpkin recipes to explore! I'll be making a pumpkin-based feast this weekend. Join me!"
 },
 {'author': 'ggecko@wellesley.edu',                         
  'date': new Date(2021, 11, 2, 10, 52, 31, 1234), 
  'channel': 'Food', 
  'content': "I *love* pumpkin. Count me in!!!"
 },

];

export default function MessageScreen() {
  /***************************************************************************
   INITIALIZATION
   ***************************************************************************/

  // According to   
  //   https://duckduckgo.com/?t=ffab&q=%22Setting+a+timer+for+a+long+period+of+time%22&ia=web
  // console.ignoredYellowBox hides apparently bogus Android error
  // "Setting a timer for a long period of time, i.e. multiple
  // minutes, is a performance and correctness issue on Android as
  // it keeps the timer module awake, and timers can only be
  // called when the app is in the foreground. See
  // https://github.com/facebook/react-native/issues/12981 for
  // more info." 
  // 
  // For more discussion, see:
  //   https://github.com/facebook/react-native/issues/12981
  // YellowBox.ignoreWarnings(['Setting a timer']);
  LogBox.ignoreLogs(['Setting a timer', 
                     'AsyncStorage', // While we're at it, squelch AyncStorage, too!
                     ]); 

  // State for authentication 
  // const [email, setEmail] = React.useState('fturbak@gmail.com'); // Provide default email for testing
  // const [password, setPassword] = React.useState('myPassword'); // Provide default passwored for testing
  const stateProps = useContext(StateContext); 
  const auth = stateProps.auth; 
  const db = stateProps.db; 
  //const [email, setEmail] = React.useState(''); // Provide default email for testing
  //const [password, setPassword] = React.useState(''); // Provide default passwored for testing
  //const [errorMsg, setErrorMsg] = React.useState('');
  //const [loggedInUser, setLoggedInUser] = React.useState(null);

  // State for chat channels and messages
  // const [channels, setChannels] = React.useState(defaultChannels);
  // const [selectedChannel, setSelectedChannel] = React.useState('Food');
  // const [selectedMessages, setSelectedMessages] = React.useState([]);
  const recipient = stateProps.recipient; 
  const setRecipient = stateProps.setRecipient; 
  const [textInputValue, setTextInputValue] = useState('');
  //const [isComposingMessage, setIsComposingMessage] = useState(false);
  // Faking message database (just a list of messages) for local testing
  const [localMessageDB, setLocalMessageDB] = useState(testMessages.map( addTimestamp ));
  const [usingFirestore, setUsingFirestore] = useState(true); // If false, only using local data. 

  
  //console.log("RECIPIENT", recipient); 

  function addTimestamp(message) {
    // Add millisecond timestamp field to message 
    return {...message, timestamp:message.date.getTime()}
  }  

  // component mount and unmount
  useEffect(() => {
      // Anything in here is fired on component mount.

      // According to   
      //   https://duckduckgo.com/?t=ffab&q=%22Setting+a+timer+for+a+long+period+of+time%22&ia=web
      // console.ignoredYellowBox hides apparently bogus Android error
      // "Setting a timer for a long period of time, i.e. multiple
      // minutes, is a performance and correctness issue on Android as
      // it keeps the timer module awake, and timers can only be
      // called when the app is in the foreground. See
      // https://github.com/facebook/react-native/issues/12981 for
      // more info."
      //console.ignoredYellowBox = ['Setting a timer'];

      //console.log('Component did mount');
      //console.log(`on mount: emailOf(auth.currentUser)=${emailOf(auth.currentUser)}`);
      //console.log(`on mount: emailOf(loggedInUser)=${emailOf(loggedInUser)}`);
      /*
      if (email !== '' && password !== '') {
        // If defaults are provided for email and password, 
        // use them to log in to avoid the hassle of logging in
        console.log(`on mount: attempting to sign in default user ${email}`);
        signInUserEmailPassword();
      } 
      */
      //console.log(`on mount: checkEmailVerification()`);
      //checkEmailVerification();

      //console.log(`on mount: getMessagesForChannel('${selectedChannel}')`);
      //getMessagesForChannel(selectedChannel); // find messages on mount 
      
      // This has worked already, so commenting it out
      // console.log(`on mount: populateFirestoreDB(testMessages)`);
      // populateFirestoreDB(testMessages); 
      return () => {
        // Anything in here is fired on component unmount.
        console.log('Component did unmount');
        //console.log(`on unmount: emailOf(auth.currentUser)=${emailOf(auth.currentUser)}`);
        //console.log(`on unmount: emailOf(loggedInUser)=${emailOf(loggedInUser)}`);
      }
    }, []);

  /***************************************************************************
   CHAT CHANNEL/MESSAGE CODE
   ***************************************************************************/

  // Update messages when selectedChannel or localMessageDB changes
  /*
  useEffect(
    () => { 
      getMessagesForChannel(selectedChannel); 
      setTextInputValue(''); // empirically need on iOS to prevent keeping 
                             // text completion from most recent post
    },
    [selectedChannel, localMessageDB]
  ); 
  */

  function toggleStorageMode() {
    setUsingFirestore(!usingFirestore);
  }

  /* 
   import { collection, query, where, getDocs } 
   const q = query(collection(db, "cities"), where("capital", "==", true));
   const querySnapshot = await getDocs(q);
  */ 

  /*
  async function getMessagesForChannel(chan) {
    console.log(`getMessagesForChannel(${chan}); usingFirestore=${usingFirestore}`);
    if (usingFirestore) {
      firebaseGetMessagesForChannel(chan); 
      // Filters the messages s.t. only the messages of the selected channel are chosen 
    } else {
      setSelectedMessages(localMessageDB.filter( msg => msg.channel === chan));
    }
  }
  */

  /*
  function docToMessage(msgDoc) {
    // msgDoc has the form {id: timestampetring, 
    //                   data: {timestamp: ..., 
    //                          author: ..., 
    //                          channel: ..., 
    //                          content: ...}
    // Need to add missing date field to data portion, reconstructed from timestamp
    const data = msgDoc.data();
    console.log(msgDoc.id, " => ", data);
    return {...data, date: new Date(data.timestamp)}
  }
  */

  /*
  async function firebaseGetMessagesForChannel(chan) {
    // Imported functions 
    // Ex: collection(db, 'messages') goes into db and finds a collection called 'messages', query means that you want to query that collection 
    // query is a promise to get the stuff, await actually gets you the stuff 
    const q = query(collection(db, 'messages'), where('channel', '==', chan));
    // Any function with "await" in it must be tagged as being async 
    const querySnapshot = await getDocs(q);
    // const messages = Array.from(querySnapshot).map( docToMessage );
    let messages = []; 
    querySnapshot.forEach(doc => {
        messages.push(docToMessage(doc));
    });
    setSelectedMessages( messages );
  }
  */

  /*
  function composeMessage() {
    setIsComposingMessage(true);
  }

  function cancelMessage() {
    setIsComposingMessage(false);
  }
  */


  function postMessage() {
    //alert("Warning: Messages do not update on page automatically; you have to navigate away from the person being messaged and then reselect them in order to see the message. Also, people that we message are not real people yet (they're simply test channels)."); 
    console.log(`postMessage; usingFirestore=${usingFirestore}`);
    const now = new Date();
    // Create a new message dictionary 
    const newMessage = {
      'author': auth.currentUser.email, 
      'recipient': recipient, 
      'date': now, 
      'timestamp': now.getTime(), // millsecond timestamp

      //'channel': selectedChannel, 
      'content': textInputValue, 
    }
    if (usingFirestore) {
      firebasePostMessage(newMessage);
    } else {
      setLocalMessageDB([...localMessageDB, newMessage]);
      setIsComposingMessage(false);
    }
    setTextInputValue('');
  }

  // Finds the timestamp of the first chat between the current user and the recipient 
  async function findTimestampOfFirstChat() {
    const userProfileRef = doc(db, "profiles", auth.currentUser.email); 
    const userProfileSnap = await getDoc(userProfileRef); 
    const userProfileContacts = userProfileSnap.data().messageContacts; 
    let relevantContact = userProfileContacts.filter(contact => contact.email == recipient)[0]; 
    //console.log(relevantContact); 
    return relevantContact.timestamp; 
  }

  async function firebasePostMessage(msg) {
    // Add a new document in collection "messages"
    // Grab the time that the first chat/message occurred between person 1 and person 2
    const firstChatTimeStamp = await(findTimestampOfFirstChat()); 
    // Get the corresponding object from the messages database (chat history between person 1 and person 2)
    console.log(firstChatTimeStamp); 
    const messageRef = doc(db, "messages", firstChatTimeStamp); 
    const messageSnap = await getDoc(messageRef);
    console.log(formatJSON(messageSnap.data())); 
    const messageObjects = messageSnap.data().messageObjects;

    let newMessage = {
      'timestamp': msg.timestamp, 
      'author': msg.author, 
      //'channel': msg.channel, 
      'content': msg.content, 
      'recipient': msg.recipient, 
    }

    const newMessageRef = {
      messageObjects: [...messageObjects, newMessage], 
    }; 
    // If the sender has not chatted with the message recipient before, set their first timestamp in messageContacts
    await setDoc(messageRef, newMessageRef, { merge: true });
  }

  // messages = test messages (from fake database) 
  /*
  async function populateFirestoreDB(messages) {

    // Returns a promise to add message to firestore
    async function addMessageToDB(message) {
      const timestamp = message.date.getTime(); // millsecond timestamp
      const timestampString = timestamp.toString();

      // Add a new document in collection "messages"
      return setDoc(doc(db, "messages", timestampString), 
        {
          'timestamp': timestamp, 
          'author': message.author, 
          'channel': message.channel, 
          'content': message.content, 
        }
      );
    }

    // Peform one await for all the promises.
    // Promise.all - collects all promises from setDoc into one big list  (so that promises can all be pushed at the exact same time)
    await Promise.all(
      messages.map( addMessageToDB ) 
    );

  }
  */

  /***************************************************************************
   AUTHENTICATION CODE
   ***************************************************************************/

  // Clear error message when email is updated to be nonempty
//   useEffect(
//     () => { if (email != '') setErrorMsg(''); },
//     [email]
//   ); 

//   function signUpUserEmailPassword() {
//     console.log('called signUpUserEmailPassword');
//     if (auth.currentUser) {
//       signOut(auth); // sign out auth's current user (who is not loggedInUser, 
//                      // or else we wouldn't be here
//     }
//     if (!email.includes('@')) {
//       setErrorMsg('Not a valid email address');
//       return;
//     }
//     if (password.length < 6) {
//       setErrorMsg('Password too short');
//       return;
//     }
//     // Invoke Firebase authentication API for Email/Password sign up 
//     createUserWithEmailAndPassword(auth, email, password)
//       .then((userCredential) => {
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
//           });
//       })
//       .catch((error) => {
//         console.log(`signUpUserEmailPassword: sign up failed for email ${email}`);
//         const errorMessage = error.message;
//         // const errorCode = error.code; // Could use this, too.
//         console.log(`createUserWithEmailAndPassword: ${errorMessage}`);
//         setErrorMsg(`createUserWithEmailAndPassword: ${errorMessage}`);
//       });
//   }

//   function signInUserEmailPassword() {
//     console.log('called signInUserEmailPassword');
//     console.log(`signInUserEmailPassword: emailOf(currentUser)0=${emailOf(auth.currentUser)}`); 
//     console.log(`signInUserEmailPassword: emailOf(loggedInUser)0=${emailOf(loggedInUser)}`); 
//     // Invoke Firebase authentication API for Email/Password sign in 
//     // Use Email/Password for authentication 
//     signInWithEmailAndPassword(auth, email, password)
//                                /* 
//                                defaultEmail ? defaultEmail : email, 
//                                defaultPassword ? defaultPassword : password
//                                */
//       .then((userCredential) => {
//         console.log(`signInUserEmailPassword succeeded for email ${email}; have userCredential for emailOf(auth.currentUser)=${emailOf(auth.currentUser)} (but may not be verified)`); 
//         console.log(`signInUserEmailPassword: emailOf(currentUser)1=${emailOf(auth.currentUser)}`); 
//         console.log(`signInUserEmailPassword: emailOf(loggedInUser)1=${emailOf(loggedInUser)}`); 

//         // Only log in auth.currentUser if their email is verified
//         checkEmailVerification();

//         // Clear email/password inputs 
//         setEmail('');
//         setPassword('');

//         // Note: could store userCredential here if wanted it later ...
//         // console.log(`createUserWithEmailAndPassword: setCredential`);
//         // setCredential(userCredential);
    
//         })
//       .catch((error) => {
//         console.log(`signUpUserEmailPassword: sign in failed for email ${email}`);
//         const errorMessage = error.message;
//         // const errorCode = error.code; // Could use this, too.
//         console.log(`signInUserEmailPassword: ${errorMessage}`);
//         setErrorMsg(`signInUserEmailPassword: ${errorMessage}`);
//       });
//   }

//   function checkEmailVerification() {
//     if (auth.currentUser) {
//       console.log(`checkEmailVerification: auth.currentUser.emailVerified=${auth.currentUser.emailVerified}`);
//       if (auth.currentUser.emailVerified) {
//         console.log(`checkEmailVerification: setLoggedInUser for ${auth.currentUser.email}`);
//         setLoggedInUser(auth.currentUser);
//         console.log("checkEmailVerification: setErrorMsg('')")
//         setErrorMsg('')
//       } else {
//         console.log('checkEmailVerification: remind user to verify email');
//         setErrorMsg(`You cannot sign in as ${auth.currentUser.email} until you verify that this is your email address. You can verify this email address by clicking on the link in a verification email sent by this app to ${auth.currentUser.email}.`)
//       }
//     }
//   }

//   function logOut() {
//     console.log('logOut'); 
//     console.log(`logOut: emailOf(auth.currentUser)=${emailOf(auth.currentUser)}`);
//     console.log(`logOut: emailOf(loggedInUser)=${emailOf(loggedInUser)}`);
//     console.log(`logOut: setLoggedInUser(null)`);
//     setLoggedInUser(null);
//     console.log('logOut: signOut(auth)');
//     signOut(auth); // Will eventually set auth.currentUser to null     
//   }

  /***************************************************************************
   DEBUGGING
   ***************************************************************************/

  function debug() {
    const debugObj = {
      //channels: channels, 
      //selectedChannel, selectedChannel, 
      //selectedMessages: selectedMessages, 
    }
    alert(formatJSON(debugObj));
  }

  function debugButton(bool) {
    if (bool) {
      return (
        <TouchableOpacity style={styles.button}
           onPress={debug}>
          <Text style={styles.buttonText}>Debug</Text>
        </TouchableOpacity> 
      ); 
    } else {
      return false;
    }
  }                                                                                      

  /***************************************************************************
   RENDERING AUTHENTICATION
   ***************************************************************************/

//   function loginPane() {
//     return (
//       <View style={loggedInUser === null ? styles.loginLogoutPane : styles.hidden}>
//         <View style={styles.labeledInput}>
//           <Text style={styles.inputLabel}>Email:</Text>
//           <TextInput placeholder="Enter an email address" 
//             style={styles.textInput} 
//             value={email} 
//             onChangeText={ textVal => setEmail(textVal)} />
//         </View>
//         <View style={styles.labeledInput}>
//           <Text style={styles.inputLabel}>Password:</Text>
//           <TextInput placeholder="Enter a password" 
//             style={styles.textInput} 
//             value={password} 
//             onChangeText={ textVal => setPassword(textVal)} />
//         </View>
//         <View style={styles.buttonHolder}>
//           <TouchableOpacity style={styles.button}
//              onPress={() => signUpUserEmailPassword()}>
//             <Text style={styles.buttonText}>Sign Up</Text>
//           </TouchableOpacity> 
//           <TouchableOpacity style={styles.button}
//              onPress={() => signInUserEmailPassword()}>
//             <Text style={styles.buttonText}>Sign In</Text>
//           </TouchableOpacity> 
//         </View>
//         <View style={errorMsg === '' ? styles.hidden : styles.errorBox}>
//           <Text style={styles.errorMessage}>{errorMsg}</Text>
//         </View>
//       </View>
//     );
//   }

//   function loggedInUserPane() {
//     return (
//       <ScrollView style={styles.jsonContainer}>
//         <Text style={styles.json}>Logged In User: {formatJSON(loggedInUser)}</Text>
//       </ScrollView>
//     );
//   }

  /***************************************************************************
   RENDERING CHAT CHANNELS AND MESSAGES
   ***************************************************************************/

 function formatDateTime(date) {
   return `${date.toLocaleDateString('en-US')} ${date.toLocaleTimeString('en-US')}`; 
 }

  const MessageItem = props => { 
    return (
      <View style={styles.messageItem}>
        <Text style={styles.messageDateTime}>{formatDateTime(props.message.date)}</Text>
        <Text style={styles.messageAuthor}>{props.message.author}</Text>
        <Text style={styles.messageContent}>{props.message.content}</Text>
      </View> 
    ); 
  }

  function composeMessagePane() {
    return (
      <View>
        {/* VIEW USED TO HAVE THIS STYLE: style={isComposingMessage ? styles.composePane : styles.hidden}*/}
        <TextInput
          multiline
          numberOfLines={3}
          placeholder="message text goes here"
          style={styles.textInputArea}
          value={textInputValue} 
          onChangeText={(value) => setTextInputValue(value)}
        />
        <View style={styles.buttonHolder}>
          {/*
          <TouchableOpacity style={styles.composeButton}
            onPress={cancelMessage}>
            <Text style={styles.composeButtonText}>Cancel</Text>
          </TouchableOpacity> 
          */}
          <TouchableOpacity style={styles.composeButton}
             onPress={postMessage}>
            <Text style={styles.composeButtonText}>Post</Text>
          </TouchableOpacity> 
        </View>
      </View>
    );
  }

  function chatPane() {
    return (
      <ScrollView style={{width: "100%"}}>
        <View>
          {debugButton(false)}
          {/*<Text>{emailOf(loggedInUser)} is logged in</Text>*/}
          {/*<Text>{`usingFirestore=${usingFirestore}`}</Text>*/}
          {/* <TouchableOpacity 
            style={styles.button}
            onPress={toggleStorageMode}>
            <Text style={[styles.buttonText, {fontSize: 18}]}>
              {usingFirestore ? 
              'Using Firestore; Click to use local DB' :
              'Using local DB; Click to use Firestore'
              }
            </Text>
          </TouchableOpacity>  */}
          {/*WHERE YOU CAN SELECT DIFFERENT PEOPLE TO CHAT WITH*/}

          {/* <Text style={styles.header}>Selected Person</Text> */}
          {/*}
          <Picker
            style={styles.pickerStyles}
            mode='dropdown' // or 'dialog'; chooses mode on Android
            selectedValue={selectedChannel}
            onValueChange={(itemValue, itemIndex) => setSelectedChannel(itemValue)}>
            {channels.map(chan => <Picker.Item key={chan} label={chan} value={chan}/>)}
          </Picker>
          */}
          {/*WHERE THE CHAT HISTORY IS LISTED*/}
          {/*
          <Text style={styles.header}>Messages</Text> 
          {(selectedMessages.length === 0) ? 
          <Text>No messages to display</Text> :
          <FlatList style={styles.messageList}
              data={selectedMessages} 
              renderItem={ datum => <MessageItem message={datum.item}></MessageItem>} 
              keyExtractor={item => item.timestamp} 
              />
          }
          */}
          {/*BOX TO COMPOSE MESSAGE*/}
          <View style={styles.buttonHolder}>
            {/*
            <TouchableOpacity 
              style={isComposingMessage ?  styles.buttonDisabled : styles.button}
              disabled={isComposingMessage}
              onPress={composeMessage}>
              <Text style={styles.buttonText}>Compose Message</Text>
            </TouchableOpacity> 
            */}
            {/* <TouchableOpacity style={styles.button}
              onPress={logOut}>
              <Text style={styles.buttonText}>Log Out</Text>
            </TouchableOpacity> */}
          </View>
          <View>{composeMessagePane()}</View>
        </View>
      </ScrollView>
    );
  }

  /***************************************************************************
   TOP LEVEL RENDERING 
   ***************************************************************************/

  return (
    <View style={styles.screen}>
      <StatusBar style="auto" />
      {/*loginPane()*/}
      {chatPane()}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
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
      width: "80%",
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
      paddingHorizontal: 20,
      borderRadius: 10,
      elevation: 3,
      backgroundColor: 'steelblue',
      margin: 5,
  },
  buttonDisabled: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 10,
      elevation: 3,
      backgroundColor: 'powderblue',
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
  chatPane: {
    flex: 1,
    width:'100%',
    alignItems: "center",
    backgroundColor: 'white',
  },
  header: {
    marginTop: 10,
    fontSize: 25,
    fontWeight: 'bold'
  },
  pickerStyles:{
    width:'70%',
    backgroundColor:'plum',
    color:'black'
  },
  messageList: {
    height: 100,
    width:'90%',
    marginTop: 5,
  },
  messageItem: {
    marginTop: 5,
    marginBottom: 5,
    backgroundColor:'bisque',
    color:'black',
    borderWidth: 1,
    borderColor: 'blue',
  },
  messageDateTime: {
    paddingLeft: 5,
    color:'gray',
  },
  messageAuthor: {
    paddingLeft: 5,
    color:'blue',
  },
  messageContent: {
    padding: 5,
    color:'black',
  },
  composePane: {
    width:'90%',
    borderWidth: 1,
    borderColor: 'blue',
  },
  textInputArea: {
    fontSize: 14, 
    padding: 5,
  },
  composeButton: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 8,
      paddingHorizontal: 10,
      borderRadius: 10,
      elevation: 3,
      backgroundColor: 'salmon',
      margin: 5,
      marginLeft: 10,
  },
  composeButtonText: {
      fontSize: 16,
      lineHeight: 21,
      fontWeight: 'bold',
      letterSpacing: 0.25,
      color: 'white',
  },


});

