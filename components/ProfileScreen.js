import React, { useState, useEffect, useContext } from "react";
import { SafeAreaView, View, ScrollView, TouchableOpacity } from 'react-native';
import { Avatar, Title, Caption, Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { globalStyles } from "../styles/globalStyles";
import StateContext from './StateContext';

import { 
    // for storage access
    doc, getDoc
} from "firebase/firestore";

function formatJSON(jsonVal) {
    return JSON.stringify(jsonVal, null, 2);
}

export default function ProfileScreen(props) {
    console.log("Params: ", props.route.params);
    const stateProps = useContext(StateContext);
    const db = stateProps.db;
    const userProfileDoc = stateProps.userProfileDoc;
    const setUserProfileDoc = stateProps.setUserProfileDoc;

    // State for user profiles' data
    let userEmail = userProfileDoc.email;
    const [profilePicUri, setProfilePicUri] = useState(userProfileDoc.profilePicUri);
    const [name, setName] = useState(userProfileDoc.basics.name);
    const [pronouns, setPronouns] = useState(userProfileDoc.basics.pronouns);
    const [bio, setBio] = useState(userProfileDoc.basics.bio);
    const [classYear, setClassYear] = useState(userProfileDoc.personal.classYear);
    const [major, setMajor] = useState(userProfileDoc.personal.major);
    const [minor, setMinor] = useState(userProfileDoc.personal.minor);
    const [hometown, setHometown] = useState(userProfileDoc.personal.hometown);
    const [residenceHall, setResidenceHall] = useState(userProfileDoc.personal.residenceHall);
    const [hobbies, setHobbies] = useState(userProfileDoc.personal.hobbies);
    const [clubs, setClubs] = useState(userProfileDoc.personal.clubs);
    const [favPlaceOnCampus, setFavPlaceOnCampus] = useState(userProfileDoc.personal.favPlaceOnCampus);
    const [favWellesleyMemory, setFavWellesleyMemory] = useState(userProfileDoc.personal.favWellesleyMemory);
    const [currentClasses, setCurrentClasses] = useState(userProfileDoc.academics.currentClasses);
    const [plannedClasses, setPlannedClasses] = useState(userProfileDoc.academics.plannedClasses);
    const [favClasses, setFavClasses] = useState(userProfileDoc.academics.favClasses);
    const [studyAbroad, setStudyAbroad] = useState(userProfileDoc.academics.studyAbroad);
    const [interestedIndustry, setInterestedIndustry] = useState(userProfileDoc.career.interestedIndustry);
    const [jobExp, setJobExp] = useState(userProfileDoc.career.jobExp);
    const [internshipExp, setInternshipExp] = useState(userProfileDoc.career.internshipExp);


    useEffect(() => {
        console.log("Add focus listener");
        const unsubscribe = props.navigation.addListener('focus', () => {
          // Screen was focused
          console.log("Calling focus listener");
          console.log("Call focus listener, params: ", props.route.params);
          if (props.route.params) {
            console.log("Updated profile with new changes");
            unpackProfile(props.route.params.updatedProfile);
            }
            else {
                firebaseGetUserProfile(userEmail);
            }
        });
    
        return unsubscribe;
      }, [props.navigation]);

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
   * Get current logged-in user's profile info from Firebase's Firestore
   */ 
    async function firebaseGetUserProfile(email) {
        const docRef = doc(db, "profiles", email);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            // console.log("Document data:", docSnap.data());
            setUserProfileDoc(docSnap.data());
            unpackProfile(docSnap.data());
            
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
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
                            <View style={bio ? {marginTop: 4, marginBottom: 10} : globalStyles.hidden}>
                                <Text style={globalStyles.caption}>"{bio}"</Text>
                            </View>
                        </View>
                    </View>
                    <TouchableOpacity onPress={() => props.navigation.navigate('Edit Profile')} 
                        style={globalStyles.editProfileButton}>
                        <Text style={globalStyles.buttonText}>Edit Profile</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => props.navigation.navigate('Favorite Profiles')} 
                        style={[globalStyles.editProfileButton, {backgroundColor: '#ef476f'}]}>
                        <Text style={globalStyles.buttonText}>Favorite Profiles</Text>
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
                        <Icon style={{alignSelf: 'center', marginRight: 10}} name="heart-outline" color="#ef476f" size={25}/>
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
                    {/* Section Header */}
                    <View style={{flexDirection: 'row'}}>
                        <Icon style={{alignSelf: 'center', marginRight: 10}} name="chevron-down-circle-outline" color="#7209b7" size={25}/>
                        <Title style={globalStyles.title}>Career</Title>
                    </View>
                    {/* Section Details */}
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