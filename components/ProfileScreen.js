import React, { useState, useEffect, useContext } from "react";
import { SafeAreaView, View, Image, Button, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
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

export default function ProfileScreen(props) {
    const stateProps = useContext(StateContext);
    const auth = stateProps.auth;
    const db = stateProps.db;

    // State for user profiles' data
    let userEmail = auth.currentUser.email;
    // const [curUser, setCurUser] = useState(null);
    // const [isFinishedLoading, setIsFinishedLoading] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [classYear, setClassYear] = useState('');
    const [pronouns, setPronouns] = useState('');
    const [bio, setBio] = useState('');
    const [hometown, setHometown] = useState('');
    const [favPlaceOnCampus, setFavPlaceOnCampus] = useState('');

    // Get user info when ProfileScreen mounts.
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
        console.log("Document data:", docSnap.data());
        let userDoc = docSnap.data();
        // setCurUser(userDoc);
        // setIsFinishedLoading(true);
        setFirstName(userDoc.basics.firstName);
        setLastName(userDoc.basics.lastName);
        setClassYear(userDoc.personal.classYear);
        setPronouns(userDoc.basics.pronouns);
        setBio(userDoc.basics.bio);
        setHometown(userDoc.personal.hometown);
        setFavPlaceOnCampus(userDoc.personal.favPlaceOnCampus);
        } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
        }
    }

    return (
        <ScrollView>
            {/* <SafeAreaView style={isFinishedLoading ? globalStyles.container : globalStyles.hidden}> */}
            <SafeAreaView style={globalStyles.container}>
                <View style={globalStyles.userInfoSection}>
                    <View style={{marginTop:15}}>
                        <Avatar.Image 
                            style={{alignSelf: 'center'}}
                            size={90}
                            source={{
                                uri: "https://media-exp1.licdn.com/dms/image/C4E03AQHN5UZRpDR-iw/profile-displayphoto-shrink_800_800/0/1608143542511?e=1645056000&v=beta&t=o5TMq2eyqNkFSspHKXikcH6H86rySDCJcozAhNaXDsA"
                            }} 
                        />
                        <View>
                            <Title style={[globalStyles.title, {
                                marginTop: 15
                            }]}>{firstName + " " + lastName}</Title>
                            <Caption style={[globalStyles.caption, {fontStyle: 'italic'}]}>{pronouns}</Caption>
                            <Caption style={globalStyles.caption}>{userEmail}</Caption>
                            <View style={{marginTop: 4, marginBottom: 10}}>
                                <Text style={globalStyles.caption}>"{bio}"</Text>
                            </View>
                        </View>
                    </View>
                    <TouchableOpacity onPress={() => props.navigation.navigate('Edit Profile')} 
                        style={globalStyles.editProfileButton}>
                        <Text style={{color: 'black'}}>Edit Profile</Text>
                    </TouchableOpacity>
                </View>

                <View
                    style={{
                    borderBottomColor: '#dddddd',
                    borderBottomWidth: 1,
                    marginBottom: 20,
                    }}
                />

                <View style={globalStyles.userInfoSection}>
                    {/* Section Header */}
                    <View style={{flexDirection: 'row'}}>
                        <Icon style={{alignSelf: 'center', marginRight: 10}} name="heart-outline" color="#FF6347" size={25}/>
                        <Title style={globalStyles.title}>Personal</Title>
                    </View>
                    {/* Section Details */}
                    <View style={{marginTop: 10}}>
                        <View style={globalStyles.infoField}>
                            <Text style={globalStyles.textType}>Class Year:</Text>
                            <Text style={globalStyles.profileText}>{classYear}</Text>
                        </View>
                        <View style={globalStyles.infoField}>
                            <Text style={globalStyles.textType}>Major:</Text>
                            <Text style={globalStyles.profileText}></Text>
                        </View>
                        <View style={globalStyles.infoField}>
                            <Text style={globalStyles.textType}>Minor:</Text>
                            <Text style={globalStyles.profileText}></Text>
                        </View>
                        <View style={globalStyles.infoField}>
                            <Text style={globalStyles.textType}>Hometown:</Text>
                            <Text style={globalStyles.profileText}>{hometown}</Text>
                        </View>
                        <View style={globalStyles.infoField}>
                            <Text style={globalStyles.textType}>Residence Hall:</Text>
                            <Text style={globalStyles.profileText}></Text>
                        </View>
                        <View style={globalStyles.infoField}>
                            <Text style={globalStyles.textType}>Hobbies:</Text>
                            <Text style={globalStyles.profileText}></Text>
                        </View>
                        <View style={globalStyles.infoField}>
                            <Text style={globalStyles.textType}>Favorite Place on Campus:</Text>
                            <Text style={globalStyles.profileText}>{favPlaceOnCampus}</Text>
                        </View>
                        <View style={globalStyles.infoField}>
                            <Text style={globalStyles.textType}>Favorite Wellesley Memory:</Text>
                            <Text style={globalStyles.profileText}></Text>
                        </View>
                    </View>
                </View>

                <View style={globalStyles.userInfoSection}>
                    {/* Academic Section Header */}
                    <View style={{flexDirection: 'row'}}>
                        <Icon style={{alignSelf: 'center', marginRight: 10}} name="heart-outline" color="#FF6347" size={25}/>
                        <Title style={globalStyles.title}>Academics</Title>
                    </View>
                    {/* Academic Section Details */}
                    <View style={{marginTop: 10}}>
                        <View style={globalStyles.infoField}>
                            <Text style={globalStyles.textType}>Current Classes:</Text>
                            <Text style={globalStyles.profileText}></Text>
                        </View>
                        <View style={globalStyles.infoField}>
                            <Text style={globalStyles.textType}>Classes I Plan To Take:</Text>
                            <Text style={globalStyles.profileText}></Text>
                        </View>
                        <View style={globalStyles.infoField}>
                            <Text style={globalStyles.textType}>Favorite Classes:</Text>
                            <Text style={globalStyles.profileText}></Text>
                        </View>
                        <View style={globalStyles.infoField}>
                            <Text style={globalStyles.textType}>Study Abroad Experience:</Text>
                            <Text style={globalStyles.profileText}></Text>
                        </View>
                    </View>
                </View>

                <View style={globalStyles.userInfoSection}>
                    {/* Section Header */}
                    <View style={{flexDirection: 'row'}}>
                        <Icon style={{alignSelf: 'center', marginRight: 10}} name="heart-outline" color="#FF6347" size={25}/>
                        <Title style={globalStyles.title}>Career</Title>
                    </View>
                    {/* Section Details */}
                    <View style={{marginTop: 10}}>
                        <View style={globalStyles.infoField}>
                            <Text style={globalStyles.textType}>Interested Industry:</Text>
                            <Text style={globalStyles.profileText}></Text>
                        </View>
                        <View style={globalStyles.infoField}>
                            <Text style={globalStyles.textType}>Job Experience:</Text>
                            <Text style={globalStyles.profileText}></Text>
                        </View>
                        <View style={globalStyles.infoField}>
                            <Text style={globalStyles.textType}>Internship Experience:</Text>
                            <Text style={globalStyles.profileText}></Text>
                        </View>
                    </View>
                </View>

                <View>                    
                    <Button title="Go to Explore Screen" onPress={() => props.navigation.navigate('Explore')}/>
                </View>
            </SafeAreaView>
        </ScrollView>
    );
}