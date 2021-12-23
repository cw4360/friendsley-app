import React, { useState, useEffect, useContext } from "react";
import { SafeAreaView, View, ImageBackground, TextInput, Keyboard, 
    Button, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Avatar, Title, Caption, Text, TouchableRipple } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { globalStyles } from "../styles/globalStyles";
import StateContext from './StateContext';

import { 
    // access to Firestore storage features:
    // for storage access
    collection, doc, addDoc, setDoc,
    query, where, getDoc, getDocs
} from "firebase/firestore";
import { getGlobal } from "@firebase/util";

function formatJSON(jsonVal) {
    return JSON.stringify(jsonVal, null, 2);
}

export default function EditProfileScreen(props) {
    const stateProps = useContext(StateContext);
    const auth = stateProps.auth;
    const db = stateProps.db;

    // State for user profiles' data
    let userEmail = auth.currentUser.email;
    // // const [curUser, setCurUser] = useState(null);
    // // const [isFinishedLoading, setIsFinishedLoading] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [pronouns, setPronouns] = useState('');
    const [bio, setBio] = useState('');
    const [classYear, setClassYear] = useState('');
    const [hometown, setHometown] = useState('');
    const [favPlaceOnCampus, setFavPlaceOnCampus] = useState('');

    // Get curUser when EditProfileScreen mounts.
    useEffect(() => {
        firebaseGetUserProfile(userEmail);
    }, []);

    /**
     * Get current logged-in user's profile info from Firebase's Firestore
     */ 
    async function firebaseGetUserProfile(email) {
        const docRef = doc(db, "profiles", email);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
        // console.log("Document data:", docSnap.data());
        let userDoc = docSnap.data();
        // setCurUser(userDoc);
        // setIsFinishedLoading(true);
        setFirstName(userDoc.basics.firstName);
        setLastName(userDoc.basics.lastName);
        setPronouns(userDoc.basics.pronouns);
        setBio(userDoc.basics.bio);
        setClassYear(userDoc.personal.classYear);
        setHometown(userDoc.personal.hometown);
        setFavPlaceOnCampus(userDoc.personal.favPlaceOnCampus);
        } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
        // alert('No such user!');
        }
    }

    function submitProfile() {
        const profileRef = doc(db, 'profiles', userEmail);
        // alert('Submitted');
        setDoc(profileRef, { 
            basics: { 
                bio: bio,
                firstName: firstName, 
                lastName: lastName,
                pronouns: pronouns, 
            },
            personal: {
                classYear: classYear,
                favPlaceOnCampus: favPlaceOnCampus,
                hometown: hometown,
            } 
        }, { merge: true });
        props.navigation.navigate('Profile');
    }

    return (
        <ScrollView>
        <SafeAreaView style={globalStyles.container}>
            <Button title="Get user" onPress={() => alert(formatJSON(auth.currentUser))}/>
            {/* <Button title="load user" onPress={() => firebaseGetUserProfile(userEmail)}/> */}
            <View style={globalStyles.userInfoSection}>
                <View style={{alignItems: 'center', marginBottom: 20}}>
                    <Avatar.Image 
                        style={{alignSelf: 'center'}}
                        size={100}
                        source={{
                            uri: "https://media-exp1.licdn.com/dms/image/C4E03AQHN5UZRpDR-iw/profile-displayphoto-shrink_800_800/0/1608143542511?e=1645056000&v=beta&t=o5TMq2eyqNkFSspHKXikcH6H86rySDCJcozAhNaXDsA"
                        }} 
                    />
                </View>
                <View style={{flexDirection: 'column'}}>
                    <View style={globalStyles.profileField}>
                        <Text style={globalStyles.textType}>First Name</Text>
                        <TextInput placeholder="First Name"
                            style={globalStyles.textInput}
                            value={firstName}
                            onChangeText={(value) => setFirstName(value)}/>
                    </View>
                    <View style={globalStyles.profileField}>
                        <Text style={globalStyles.textType}>Last Name</Text>
                        <TextInput placeholder="Last Name"
                            style={globalStyles.textInput}
                            value={lastName}
                            onChangeText={(value) => setLastName(value)}/>
                    </View>
                    <View style={globalStyles.profileField}>
                        <Text style={globalStyles.textType}>Pronouns</Text>
                        <TextInput placeholder="Pronouns"
                            style={globalStyles.textInput}
                            value={pronouns}
                            onChangeText={(value) => setPronouns(value)}/>
                    </View>
                    <View style={globalStyles.profileField}>
                        <Text style={globalStyles.textType}>Bio</Text>
                        <TextInput placeholder="Bio"
                            style={globalStyles.textInput}
                            value={bio}
                            onChangeText={(value) => setBio(value)}/>
                    </View>
                    <View style={globalStyles.profileField}>
                        <Text style={globalStyles.textType}>Class Year</Text>
                        <TextInput placeholder="Class Year"
                            style={globalStyles.textInput}
                            value={classYear}
                            onChangeText={(value) => setClassYear(value)}/>
                    </View>
                    <View style={globalStyles.profileField}>
                        <Text style={globalStyles.textType}>Hometown</Text>
                        <TextInput placeholder="Hometown"
                            style={globalStyles.textInput}
                            value={hometown}
                            onChangeText={(value) => setHometown(value)}/>
                    </View>
                    <View style={globalStyles.profileField}>
                        <Text style={globalStyles.textType}>Favorite Place On Campus</Text>
                        <TextInput placeholder="Favorite Place On Campus"
                            style={globalStyles.textInput}
                            value={favPlaceOnCampus}
                            onChangeText={(value) => setFavPlaceOnCampus(value)}/>
                    </View>
                </View>
                <TouchableOpacity style={globalStyles.submitButton} onPress={() => submitProfile()}>
                    <Text style={globalStyles.submitButtonTitle}>Submit</Text>
                </TouchableOpacity>
                
            </View>
            <Button title="Return to Profile" onPress={() => props.navigation.navigate('Profile')}/>
            
        </SafeAreaView>
    </ScrollView>
    );

    
}