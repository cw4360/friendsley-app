import React, { useState, useContext } from "react";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { SafeAreaView, View, TextInput,
    ScrollView, TouchableOpacity } from 'react-native';
import { Avatar, Text } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
// Would be used to resize iOS images, because 
// currently only Android images can be uploaded without crashing
// import ImageResizer from "react-native-image-resizer";
import { globalStyles } from "../styles/globalStyles";
import StateContext from './StateContext';

import { 
    // for storage access
    doc, setDoc
} from "firebase/firestore";
import { 
    // access to Firebase storage features (for files like images, video, etc.)
   ref, uploadBytes, uploadBytesResumable, getDownloadURL
  } from "firebase/storage";

function formatJSON(jsonVal) {
    return JSON.stringify(jsonVal, null, 2);
}

export default function EditProfileScreen(props) {
    const stateProps = useContext(StateContext);
    const db = stateProps.db;
    const storage = stateProps.storage;

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

    // State for image picker
    const [pickedImagePath, setPickedImagePath] = useState('');

    // This function is triggered when the "Choose from Library" button pressed
    async function showImagePicker() {
        // Ask the user for the permission to access the media library 
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            alert("You have refused to allow this app to access your photos");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync();
        
        // Explore the result
        // console.log(result);

        if (!result.cancelled) {
            setPickedImagePath(result.uri);
            setProfilePicUri(result.uri);
            // console.log(result.uri);
            // ImageResizer.createResizedImage(result.uri, 100, 100, 'JPEG', 
            // 100, 0, undefined, false).then ( response => {
            //     setPickedImagePath(response.uri);
            //     setProfilePicUri(response.uri);
            //     console.log(response.uri);
            // })
            // .catch(err => {
            //     console.log(err);
            // });
        }
    }
    
    // This function is triggered when the "Take Photo" button pressed
    async function openCamera() {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

        if (permissionResult.granted === false) {
            alert("You have refused to allow this app to access your camera");
            return;
        }

        const result = await ImagePicker.launchCameraAsync();

        // Explore the result
        // console.log(result);

        if (!result.cancelled) {
            setPickedImagePath(result.uri);
            setProfilePicUri(result.uri);
            // console.log("Selected image path:", result.uri);
        }
    }

    async function submitProfile() {
        // alert('Submitted');
        const newProfile = {
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
        },
        academics: {
            currentClasses: currentClasses,
            plannedClasses: plannedClasses,
            favClasses: favClasses,
            studyAbroad: studyAbroad,
        },
        career: {
            interestedIndustry: interestedIndustry,
            jobExp: jobExp,
            internshipExp: internshipExp,
        }
        };

        if (pickedImagePath) {
            newProfile.profilePicUri = pickedImagePath;
            console.log(formatJSON(newProfile.profilePicUri));
            await firebaseSubmitProfileWithPicture(newProfile);
            console.log('Submitted profile and photo');
        } else {
            firebaseSubmitProfile(newProfile);
            console.log('Submitted profile without photo');
        }

        props.navigation.navigate('Profile', {updatedProfile: newProfile} );
    }

    async function firebaseSubmitProfile(newProfile) {
        // Set profile data in Firebase
        const profileRef = doc(db, 'profiles', userEmail);
        await setDoc(profileRef, newProfile, { merge: true });
    }

    async function firebaseSubmitProfileWithPicture(newProfile) {
        const now = new Date();
        const timestamp = now.getTime(); // millsecond timestamp

        // Store image in Firebase storage
        const storageRef = ref(storage, 'profilePic/' + timestamp);

        // Get the downloadURL from the image in Firebase storage
        // Credit to Bianca Pio and Avery Kim:
        const fetchResponse = await fetch(pickedImagePath);
        const imageBlob = await fetchResponse.blob();

        // Add the downloadURL as the picked image for the msg
        const uploadTask = uploadBytesResumable(storageRef, imageBlob);
        console.log("Uploading profile picture for:", formatJSON(userEmail));
        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log("Upload is " + progress + "% done");
                switch (snapshot.state) {
                    case 'paused':
                        console.log("Upload is paused");
                        break;
                    case 'running':
                        console.log("Upload is running");
                        break;
                }
            },
            (error) => {
                console.error(error);
            },
            // Post the msg-with-imageUri to Firestore
            async function() {
                console.log("Uploading profile picture for", formatJSON(userEmail), "succeeded");
                // Once the upload is finished, get the downloadURL for the uploaed image
                const downloadURL = await getDownloadURL(storageRef);

                // Add the downloadURL as the imageUri for the profile
                const profileWithDownloadURL = {...newProfile, profilePicUri: downloadURL};

                // Store the profile in Firestore with the downloadURL as profilePicUri
                firebaseSubmitProfile(profileWithDownloadURL);
            }
        ); // end arguments to uploadTask.on
    }

    return (
        <KeyboardAwareScrollView>
            <ScrollView style={{backgroundColor: '#FFF0BB'}}>
                <SafeAreaView style={[globalStyles.container, {marginTop: 10}]}>
                    <View style={globalStyles.userInfoSection}>
                        <View style={{alignItems: 'center', marginBottom: 20}}>
                            {pickedImagePath ? 
                                <Avatar.Image 
                                    style={{alignSelf: 'center', marginBottom: 10}}
                                    size={100}
                                    source={{
                                        uri: pickedImagePath
                                    }} /> : 
                                <Avatar.Image 
                                style={{alignSelf: 'center', marginBottom: 10}}
                                size={100}
                                source={{
                                    uri: profilePicUri
                                }} />
                            }
                            <TouchableOpacity onPress={showImagePicker}>
                                <Text style={{color: 'dodgerblue'}}>Choose from Library</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={openCamera}>
                                <Text style={{color: 'dodgerblue'}}>Take Photo</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                setPickedImagePath('https://picsum.photos/700');
                            }}>
                                <Text style={{color: 'dodgerblue'}}>Remove Photo</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{flexDirection: 'column', marginTop: 10}}>
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
                                    maxLength={300}
                                    multiline
                                    numberOfLines={3}
                                    style={globalStyles.textInput}
                                    value={bio}
                                    onChangeText={(value) => setBio(value)}/>
                            </View>
                            <View style={globalStyles.profileField}>
                                <Text style={globalStyles.textType}>Class Year</Text>
                                <TextInput placeholder="Class Year"
                                    keyboardType="number-pad"
                                    style={globalStyles.textInput}
                                    value={classYear}
                                    onChangeText={(value) => setClassYear(value)}/>
                            </View>
                            <View style={globalStyles.profileField}>
                                <Text style={globalStyles.textType}>Major</Text>
                                <TextInput placeholder="Major"
                                    multiline
                                    numberOfLines={3}
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
                                    multiline
                                    numberOfLines={3}
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
                                    multiline
                                    numberOfLines={3}
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
                            <View style={globalStyles.profileField}>
                                <Text style={globalStyles.textType}>Current Classes</Text>
                                <TextInput placeholder="Current Classes"
                                    multiline
                                    numberOfLines={3}
                                    style={globalStyles.textInput}
                                    value={currentClasses}
                                    onChangeText={(value) => setCurrentClasses(value)}/>
                            </View>
                            <View style={globalStyles.profileField}>
                                <Text style={globalStyles.textType}>Classes I Plan to Take</Text>
                                <TextInput placeholder="Classes I Plan to Take"
                                    multiline
                                    numberOfLines={3}
                                    style={globalStyles.textInput}
                                    value={plannedClasses}
                                    onChangeText={(value) => setPlannedClasses(value)}/>
                            </View>
                            <View style={globalStyles.profileField}>
                                <Text style={globalStyles.textType}>Favorite Classes</Text>
                                <TextInput placeholder="Favorite Classes"
                                    multiline
                                    numberOfLines={3}
                                    style={globalStyles.textInput}
                                    value={favClasses}
                                    onChangeText={(value) => setFavClasses(value)}/>
                            </View>
                            <View style={globalStyles.profileField}>
                                <Text style={globalStyles.textType}>Study Abroad Experience</Text>
                                <TextInput placeholder="Study Abroad Experience"
                                    multiline
                                    numberOfLines={3}
                                    style={globalStyles.textInput}
                                    value={studyAbroad}
                                    onChangeText={(value) => setStudyAbroad(value)}/>
                            </View>
                            <View style={globalStyles.profileField}>
                                <Text style={globalStyles.textType}>Interested Industry</Text>
                                <TextInput placeholder="Interested Industry"
                                    multiline
                                    numberOfLines={3}
                                    style={globalStyles.textInput}
                                    value={interestedIndustry}
                                    onChangeText={(value) => setInterestedIndustry(value)}/>
                            </View>
                            <View style={globalStyles.profileField}>
                                <Text style={globalStyles.textType}>Job Experience</Text>
                                <TextInput placeholder="Job Experience"
                                    multiline
                                    numberOfLines={3}
                                    style={globalStyles.textInput}
                                    value={jobExp}
                                    onChangeText={(value) => setJobExp(value)}/>
                            </View>
                            <View style={globalStyles.profileField}>
                                <Text style={globalStyles.textType}>Internship Experience</Text>
                                <TextInput placeholder="Internship Experience"
                                    multiline
                                    numberOfLines={3}
                                    style={globalStyles.textInput}
                                    value={internshipExp}
                                    onChangeText={(value) => setInternshipExp(value)}/>
                            </View>
                        </View>
                        <TouchableOpacity style={globalStyles.submitButton} onPress={() => submitProfile()}>
                            <Text style={globalStyles.buttonText}>Submit</Text>
                        </TouchableOpacity> 
                    </View>                
                </SafeAreaView>
            </ScrollView>
        </KeyboardAwareScrollView>
    );
}