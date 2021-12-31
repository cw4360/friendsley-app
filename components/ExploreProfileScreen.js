import React, { useState, useEffect, useContext } from "react";
import { SafeAreaView, View, Alert, Image, Button, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
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
import FavoriteProfilesScreen from "./FavoriteProfilesScreen";

function formatJSON(jsonVal) {
    return JSON.stringify(jsonVal, null, 2);
}

export default function ExploreProfileScreen({ route, navigation }) {
    const { userEmail } = route.params;

    const stateProps = useContext(StateContext);
    const db = stateProps.db;
    const userProfileDoc = stateProps.userProfileDoc;
    
    const [userFavorites, setUserFavorites] = useState([]);

    // State for user profiles' data
    const [profilePicUri, setProfilePicUri] = useState('https://picsum.photos/700');
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
    const [currentClasses, setCurrentClasses] = useState('');
    const [plannedClasses, setPlannedClasses] = useState('');
    const [favClasses, setFavClasses] = useState('');
    const [studyAbroad, setStudyAbroad] = useState('');
    const [interestedIndustry, setInterestedIndustry] = useState('');
    const [jobExp, setJobExp] = useState('');
    const [internshipExp, setInternshipExp] = useState('');  
    
    // State for favorite heart
    const [isFavorite, setIsFavorite] = useState(false);

    // Get user info when ExploreProfileScreen mounts.
    useEffect(() => {
        firebaseGetUserProfile(userEmail);
        firebaseGetUserFavorites();
    }, []);

    function unpackProfile(userDoc){
        setProfilePicUri(userDoc.profilePicUri);
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
        setCurrentClasses(userDoc.academics.currentClasses);
        setPlannedClasses(userDoc.academics.plannedClasses);
        setFavClasses(userDoc.academics.favClasses);
        setStudyAbroad(userDoc.studyAbroad);
        setInterestedIndustry(userDoc.career.interestedIndustry);
        setJobExp(userDoc.career.jobExp);
        setInternshipExp(userDoc.career.internshipExp);
    }

    /**
   * Get user's profile info from Firebase's Firestore
   */ 
    async function firebaseGetUserProfile(email) {
        // alert("CURRENT USER'S EMAIL, PROFILE SCREEN", formatJSON(email)); 
        const docRef = doc(db, "profiles", email);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            // console.log("Document data:", docSnap.data());
            unpackProfile(docSnap.data());
            
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }

    async function firebaseGetUserFavorites() {
        const docRef = doc(db, "favorites", userProfileDoc.email);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            // console.log("Document data:", docSnap.data());
            const favoritesDoc = docSnap.data();
            setUserFavorites(favoritesDoc.favorite);  

            const check = favoritesDoc.favorite.filter( person => person.email === userEmail).length;
            console.log(check);
            if (check > 0) {
                setIsFavorite(true);
            } else {
                setIsFavorite(false);
            }

        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
            setDoc(doc(db, 'favorites', userProfileDoc.email), 
                { favorite: [] }
            );
        }
    }

    function makeFavorite() {
        console.log("made it");
        setDoc(doc(db, 'favorites', userProfileDoc.email), 
            { 
                favorite: [...userFavorites, {
                    name: name, 
                    pronouns: pronouns,
                    email: userEmail,
                    bio: bio,
                    profilePicUri: profilePicUri,
                }]
            }
        );
        setIsFavorite(true);
        console.log("Added user to favorites");
    }

    function makeUnfavorite() {
        const createTwoButtonAlert = () =>
            Alert.alert(
            "Unfavorite",
            "Are you sure you want to unfavorite this profile?",
            [
                {
                text: "Cancel",
                onPress: () => {},
                style: "cancel"
                },
                { text: "OK", onPress: () => {
                    setDoc(doc(db, 'favorites', userProfileDoc.email), 
                        { 
                            favorite: userFavorites.filter( person => person.email !== userEmail)
                        }
                    );
                    setIsFavorite(false);
                    console.log("Removed user from favorites");
                    navigation.navigate('Explore');
                }}
            ]
            );
        createTwoButtonAlert();
    }

    return (
        <ScrollView style={{backgroundColor: '#FFF0BB'}}>
            <SafeAreaView style={globalStyles.container}>
                <View style={globalStyles.userInfoSection}>
                    <View style={{marginTop:15}}>
                        <Avatar.Image 
                            style={{alignSelf: 'center'}}
                            size={100}
                            source={{
                                uri: profilePicUri
                            }} 
                        />
                        <View>
                            <Title style={[globalStyles.title, {
                                marginTop: 10
                            }]}>{name}</Title>
                            <View style={pronouns ? {marginTop: -5} : globalStyles.hidden}>
                                <Caption style={{fontFamily: 'DMSans_400Regular_Italic', fontSize: 16, letterSpacing: 1}}>{pronouns}</Caption>
                            </View>
                            <Caption style={globalStyles.caption}>{userEmail}</Caption>
                            <View style={bio ? {marginTop: 4} : globalStyles.hidden}>
                                <Text style={globalStyles.caption}>"{bio}"</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row'}}>
                       <TouchableOpacity onPress={() => {}} 
                            style={[globalStyles.editProfileButton, {flex: 1}]}>
                            <Text style={globalStyles.buttonText}>Message</Text>
                        </TouchableOpacity> 
                        {isFavorite? <TouchableOpacity onPress={() => makeUnfavorite()}
                                style={{justifyContent: 'center', flex: .175, marginTop: 10, marginLeft: 15}}>
                                <Icon  name="heart" color="#ef476f" size={30}/>
                            </TouchableOpacity> :
                            <TouchableOpacity onPress={() => makeFavorite()}
                                style={{justifyContent: 'center', flex: .175, marginTop: 10, marginLeft: 15}}>
                                <Icon  name="heart-outline" color="#ef476f" size={30}/>
                            </TouchableOpacity>
                        }
                    </View>
                    
                </View>

                <View
                    style={{
                    borderBottomColor: '#dddddd',
                    borderBottomWidth: 1,
                    marginBottom: 20,
                    }}
                />

                <View style={globalStyles.userInfoSection}>
                    {/* Personal Section Header */}
                    <View style={{flexDirection: 'row'}}>
                        <Icon style={{alignSelf: 'center', marginRight: 10}} name="heart-outline" color="#ef476f" size={25}/>
                        <Title style={globalStyles.title}>Personal</Title>
                    </View>
                    {/* Personal Section Details */}
                    <View style={{marginTop: 10}}>
                        <View style={classYear ? globalStyles.infoField : globalStyles.hidden}>
                            <Text style={globalStyles.textType}>Class Year:</Text>
                            <Text style={globalStyles.profileText}>{classYear}</Text>
                        </View>
                        <View style={major ? globalStyles.infoField : globalStyles.hidden}>
                            <Text style={globalStyles.textType}>Major:</Text>
                            <Text style={globalStyles.profileText}>{major}</Text>
                        </View>
                        <View style={minor ? globalStyles.infoField : globalStyles.hidden}>
                            <Text style={globalStyles.textType}>Minor:</Text>
                            <Text style={globalStyles.profileText}>{minor}</Text>
                        </View>
                        <View style={hometown ? globalStyles.infoField : globalStyles.hidden}>
                            <Text style={globalStyles.textType}>Hometown:</Text>
                            <Text style={globalStyles.profileText}>{hometown}</Text>
                        </View>
                        <View style={residenceHall ? globalStyles.infoField : globalStyles.hidden}>
                            <Text style={globalStyles.textType}>Residence Hall:</Text>
                            <Text style={globalStyles.profileText}>{residenceHall}</Text>
                        </View>
                        <View style={hobbies ? globalStyles.infoField : globalStyles.hidden}>
                            <Text style={globalStyles.textType}>Hobbies:</Text>
                            <Text style={globalStyles.profileText}>{hobbies}</Text>
                        </View>
                        <View style={clubs ? globalStyles.infoField : globalStyles.hidden}>
                            <Text style={globalStyles.textType}>Clubs:</Text>
                            <Text style={globalStyles.profileText}>{clubs}</Text>
                        </View>
                        <View style={favPlaceOnCampus ? globalStyles.infoField : globalStyles.hidden}>
                            <Text style={globalStyles.textType}>Favorite Place on Campus:</Text>
                            <Text style={globalStyles.profileText}>{favPlaceOnCampus}</Text>
                        </View>
                        <View style={favWellesleyMemory ? globalStyles.infoField : globalStyles.hidden}>
                            <Text style={globalStyles.textType}>Favorite Wellesley Memory:</Text>
                            <Text style={globalStyles.profileText}>{favWellesleyMemory}</Text>
                        </View>
                    </View>
                </View>

                <View style={globalStyles.userInfoSection}>
                    {/* Academic Section Header */}
                    <View style={{flexDirection: 'row'}}>
                        <Icon style={{alignSelf: 'center', marginRight: 10}} name="school-outline" color="#023e8a" size={25}/>
                        <Title style={globalStyles.title}>Academics</Title>
                    </View>
                    {/* Academic Section Details */}
                    <View style={{marginTop: 10}}>
                        <View style={currentClasses ? globalStyles.infoField : globalStyles.hidden}>
                            <Text style={globalStyles.textType}>Current Classes:</Text>
                            <Text style={globalStyles.profileText}>{currentClasses}</Text>
                        </View>
                        <View style={plannedClasses ? globalStyles.infoField : globalStyles.hidden}>
                            <Text style={globalStyles.textType}>Classes I Plan To Take:</Text>
                            <Text style={globalStyles.profileText}>{plannedClasses}</Text>
                        </View>
                        <View style={favClasses ? globalStyles.infoField : globalStyles.hidden}>
                            <Text style={globalStyles.textType}>Favorite Classes:</Text>
                            <Text style={globalStyles.profileText}>{favClasses}</Text>
                        </View>
                        <View style={studyAbroad ? globalStyles.infoField : globalStyles.hidden}>
                            <Text style={globalStyles.textType}>Study Abroad Experience:</Text>
                            <Text style={globalStyles.profileText}>{studyAbroad}</Text>
                        </View>
                    </View>
                </View>

                <View style={globalStyles.userInfoSection}>
                    {/* Career Section Header */}
                    <View style={{flexDirection: 'row'}}>
                        <Icon style={{alignSelf: 'center', marginRight: 10}} name="chevron-down-circle-outline" color="#7209b7" size={25}/>
                        <Title style={globalStyles.title}>Career</Title>
                    </View>
                    {/* Career Section Details */}
                    <View style={{marginTop: 10}}>
                        <View style={interestedIndustry ? globalStyles.infoField : globalStyles.hidden}>
                            <Text style={globalStyles.textType}>Interested Industry:</Text>
                            <Text style={globalStyles.profileText}>{interestedIndustry}</Text>
                        </View>
                        <View style={jobExp ? globalStyles.infoField : globalStyles.hidden}>
                            <Text style={globalStyles.textType}>Job Experience:</Text>
                            <Text style={globalStyles.profileText}>{jobExp}</Text>
                        </View>
                        <View style={internshipExp ? globalStyles.infoField : globalStyles.hidden}>
                            <Text style={globalStyles.textType}>Internship Experience:</Text>
                            <Text style={globalStyles.profileText}>{internshipExp}</Text>
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        </ScrollView>
    );
}