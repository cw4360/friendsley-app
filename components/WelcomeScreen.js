import React from 'react';
import { SafeAreaView, View, Text, Button, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Avatar, Title, Caption, TouchableRipple } from 'react-native-paper';
import AppLoading from 'expo';
import {
    useFonts,
    DMSans_400Regular,
    DMSans_400Regular_Italic,
    DMSans_500Medium,
    DMSans_500Medium_Italic,
    DMSans_700Bold,
    DMSans_700Bold_Italic,
  } from '@expo-google-fonts/dm-sans';
import {
    RobotoMono_400Regular,
    RobotoMono_500Medium,
    RobotoMono_400Regular_Italic,
} from '@expo-google-fonts/roboto-mono'
import { globalStyles } from "../styles/globalStyles";

export default function WelcomeScreen(props) {
    let [fontsLoaded] = useFonts({
        DMSans_400Regular,
        DMSans_400Regular_Italic,
        DMSans_500Medium,
        DMSans_500Medium_Italic,
        DMSans_700Bold,
        DMSans_700Bold_Italic,
        RobotoMono_400Regular,
        RobotoMono_500Medium,
        RobotoMono_400Regular_Italic,
      });
    
    if (!fontsLoaded) {
        return (
            // <AppLoading />
            <View></View>
        );
    }  else {
        return (
            <SafeAreaView style={{marginTop: 160}}>
                <View style={globalStyles.userInfoSection}>
                    <Title style={{
                        alignSelf: 'center', 
                        padding: 20, color: '#5971B5', 
                        fontFamily: 'DMSans_700Bold',
                        fontSize: 40,
                        }}>Friendsley</Title>
                    <View style={{alignItems: 'center'}}>  
                        <Image 
                            style={{ width: 186, height: 157, marginLeft: 10, marginBottom: 20}}
                            source={require('../assets/ios/friendsley-logo3x.png')}
                        />
                        <TouchableOpacity 
                            onPress={() => props.navigation.navigate('Login')}
                            style={globalStyles.loginButton}
                        >
                            <Text style={globalStyles.welcomeText}>LOGIN</Text>
                        </TouchableOpacity>                  
                        <TouchableOpacity 
                            onPress={() => props.navigation.navigate('Sign Up')}
                            style={globalStyles.signupButton}
                        >
                            <Text style={globalStyles.welcomeText}>SIGN UP</Text>
                        </TouchableOpacity>
                    </View>
                    {/* <View>                    
                        <Button title="Go to Explore Screen" onPress={() => props.navigation.navigate("Friendsley")}/>
                    </View> */}
                </View>
            </SafeAreaView>
        );
    }
}