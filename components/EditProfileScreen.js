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
    const [name, setName] = useState('');
    const [pronouns, setPronouns] = useState('');
    const [bio, setBio] = useState('');
    const [classYear, setClassYear] = useState('');
    const [major, setMajor] = useState('');
    const [minor, setMinor] = useState('');
    const [hometown, setHometown] = useState('');
    const [residenceHall, setResidenceHall] = useState('');
    const [hobbies, setHobbies] = useState('');
    const [clubs, setClubs] = useState('');
    const [favPlaceOnCampus, setFavPlaceOnCampus] = useState('');
    const [favWellesleyMemory, setFavWellesleyMemory] = useState('');

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
        setName(userDoc.basics.name);
        setPronouns(userDoc.basics.pronouns);
        setBio(userDoc.basics.bio);
        setClassYear(userDoc.personal.classYear);
        setMajor(userDoc.personal.major);
        setMinor(userDoc.personal.minor);
        setHometown(userDoc.personal.hometown);
        setResidenceHall(userDoc.personal.residenceHall);
        setHobbies(userDoc.personal.hobbies);
        setClubs(userDoc.personal.clubs);
        setFavPlaceOnCampus(userDoc.personal.favPlaceOnCampus);
        setFavWellesleyMemory(userDoc.personal.favWellesleyMemory);
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
                name: name,
                pronouns: pronouns.toLowerCase(), 
            },
            personal: {
                classYear: classYear, 
                major: major, 
                minor: minor, 
                hometown: hometown, 
                residenceHall: residenceHall,
                clubs: clubs,
                hobbies: hobbies,
                favPlaceOnCampus: favPlaceOnCampus,
                favWellesleyMemory: favWellesleyMemory,
            } 
        }, { merge: true });
        props.navigation.navigate('Profile');
    }

    return (
        <ScrollView>
        <SafeAreaView style={[globalStyles.container, {marginTop: 20}]}>
            {/* <Button title="Get user" onPress={() => alert(formatJSON(auth.currentUser))}/> */}
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
                        <Text style={globalStyles.textType}>Name</Text>
                        <TextInput placeholder="Name"
                            style={globalStyles.textInput}
                            value={name}
                            onChangeText={(value) => setName(value)}/>
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
                            multiline
                            numberOfLines={3}
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
                        <Text style={globalStyles.textType}>Major</Text>
                        <TextInput placeholder="Major"
                            style={globalStyles.textInput}
                            value={major}
                            onChangeText={(value) => setMajor(value)}/>
                    </View>
                    <View style={globalStyles.profileField}>
                        <Text style={globalStyles.textType}>Minor</Text>
                        <TextInput placeholder="Minor"
                            style={globalStyles.textInput}
                            value={minor}
                            onChangeText={(value) => setMinor(value)}/>
                    </View>
                    <View style={globalStyles.profileField}>
                        <Text style={globalStyles.textType}>Hometown</Text>
                        <TextInput placeholder="Hometown"
                            style={globalStyles.textInput}
                            value={hometown}
                            onChangeText={(value) => setHometown(value)}/>
                    </View>
                    <View style={globalStyles.profileField}>
                        <Text style={globalStyles.textType}>Residence Hall</Text>
                        <TextInput placeholder="Residence Hall"
                            style={globalStyles.textInput}
                            value={residenceHall}
                            onChangeText={(value) => setResidenceHall(value)}/>
                    </View>
                    <View style={globalStyles.profileField}>
                        <Text style={globalStyles.textType}>Hobbies</Text>
                        <TextInput placeholder="Hobbies"
                            multiline
                            numberOfLines={3}
                            style={globalStyles.textInput}
                            value={hobbies}
                            onChangeText={(value) => setHobbies(value)}/>
                    </View>
                    <View style={globalStyles.profileField}>
                        <Text style={globalStyles.textType}>Clubs</Text>
                        <TextInput placeholder="Clubs"
                            multiline
                            numberOfLines={3}
                            style={globalStyles.textInput}
                            value={clubs}
                            onChangeText={(value) => setClubs(value)}/>
                    </View>
                    <View style={globalStyles.profileField}>
                        <Text style={globalStyles.textType}>Favorite Place On Campus</Text>
                        <TextInput placeholder="Favorite Place On Campus"
                            style={globalStyles.textInput}
                            value={favPlaceOnCampus}
                            onChangeText={(value) => setFavPlaceOnCampus(value)}/>
                    </View>
                    <View style={globalStyles.profileField}>
                        <Text style={globalStyles.textType}>Favorite Wellesley Memory</Text>
                        <TextInput placeholder="Favorite Wellesley Memory"
                            multiline
                            numberOfLines={3}
                            style={globalStyles.textInput}
                            value={favWellesleyMemory}
                            onChangeText={(value) => setFavWellesleyMemory(value)}/>
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