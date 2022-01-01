import React from 'react';
import { SafeAreaView, View, Text, Image, TouchableOpacity } from 'react-native';
import { Title } from 'react-native-paper';
import { globalStyles } from "../styles/globalStyles";

export default function WelcomeScreen(props) {
    return (
        <SafeAreaView style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <View style={globalStyles.userInfoSection}>
                <Title style={{
                    alignSelf: 'center', 
                    padding: 20, color: '#5971B5', 
                    fontFamily: 'DMSans_700Bold',
                    fontSize: 40,
                    }}>Friendsley</Title>
                <View style={{alignItems: 'center'}}>  
                    <Image 
                        style={{ width: 207, height: 175, marginLeft: 10, marginBottom: 20}}
                        source={require('../assets/ios/friendsley3x.png')}
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
            </View>
        </SafeAreaView>
    );
}