import React, { useState, useContext } from "react";
import { SafeAreaView, View, Text, Image, Button, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import StateContext from './StateContext';
import { 
    // access to Firestore storage features:
    // for storage access
    collection, doc, addDoc, setDoc,
    query, where, getDoc, getDocs
} from "firebase/firestore";

function formatJSON(jsonVal) {
    return JSON.stringify(jsonVal, null, 2);
}

export default function ProfileScreen(props) {
    const stateProps = useContext(StateContext);
    const auth = stateProps.auth;
    const db = stateProps.db;

    // State for user profiles' data
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    /**
   * Get current logged-in user's profile info from Firebase's Firestore
   */ 
    async function firebaseGetUserProfile(userEmail) {
        const docRef = doc(db, "profiles", userEmail);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        let userDoc = docSnap.data();
        setFirstName(userDoc.basics.firstName);
        setLastName(userDoc.basics.lastName);
        } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
        }


        // const q = query(collection(db, 'profiles'), where('email', '==', userEmail));
        // const querySnapshot = await getDocs(q);
        // const data = querySnapshot.data();
        // alert(formatJSON(data));
    }

    return (
        <ScrollView>
            <SafeAreaView>
                <View>
                    <Button title="Get User Profile" onPress={() => firebaseGetUserProfile(auth.currentUser.email)}/>

                    <Text>{firstName}</Text>
                    <Text>{lastName}</Text>
                    <Text>Class Year</Text>
                    <Button title="Go to Explore Screen" onPress={() => props.navigation.navigate('Explore')}/>
                </View>
            </SafeAreaView>
        </ScrollView>
    );
}