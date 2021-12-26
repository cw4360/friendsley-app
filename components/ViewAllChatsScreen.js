/*
TODO: 
- When user clicks "message" on the Explore screen, that person should be added to "messageContacts"
- In messageContacts, should we store the entire person's document as the messageContact, or should we just store the person's email and then extract the document from their email?
*/

import React, {useContext, useEffect} from 'react';
import { SafeAreaView, View, Text, TextInput, Button, Image, StyleSheet, ScrollView, TouchableOpacity, FlatList, LogBox } from 'react-native';
import Constants from 'expo-constants';
import { StatusBar } from 'expo-status-bar';
//import {Picker} from '@react-native-picker/picker';
import { Avatar, Card, Title, Paragraph, Searchbar } from 'react-native-paper';
import StateContext from './StateContext'; 
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

export default function ViewAllChatsScreens(props) {
    const stateProps = useContext(StateContext);
    const auth = stateProps.auth; 
    const db = stateProps.db; 
    const userEmail = auth.currentUser.email; 
    const userProfileDoc = stateProps.userProfileDoc; 
    const userContacts = userProfileDoc.messageContacts; 
    console.log("USER CONTACTS", userContacts); 

    /*
    let userContacts = []; 

    useEffect(() => {
        // Why doesn't this work? 
        userContacts = (async () => {
            await firebaseGetCurrentContacts(userEmail); 
        })();
        alert("USERCONTACTS", formatJSON(userContacts)); 
        console.log(userContacts); 
    }, []);

    // Grab currently-logged in user's profile (specifically their messageContacts)
    async function firebaseGetCurrentContacts(email) {
        const docRef = doc(db, "profiles", email);
        const docSnap = await getDoc(docRef);
        //alert("BEFORE THE DOCSNAP.EXISTS() CHECK"); 
        if (docSnap.exists()) {
            //alert("Document data:", docSnap.data());
            let contacts = docSnap.data().messageContacts;  
            console.log("CONTACTS", contacts); 
            //alert(contacts); // console logs the correct thing...
            //alert("GOT HERE!", formatJSON(userDoc)); 
            return contacts; 
        } else {
            // doc.data() will be undefined in this case
            alert("No such document!");
            return []; 
        }
    }
    */

    {/* OLD TEST FLATLIST IN RETURN 
        <View>
            <FlatList>
                data = {userProfileDoc.messageContacts}
                renderItem = {contact => 
                    <TouchableOpacity>
                        <View>
                            <Text>{contact}</Text>
                        </View>
                    </TouchableOpacity>
                }
            </FlatList>
        </View>
        */}

    return (
        <View>
            <Text>Hi</Text>
        </View>
    )
}