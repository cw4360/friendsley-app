import React from 'react';
import { SafeAreaView, View, Text, Button, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Avatar, Title, Caption, TouchableRipple } from 'react-native-paper';
import { globalStyles } from "../styles/globalStyles";

export default function WelcomeScreen(props) {
    return (
        <SafeAreaView style={{marginTop: '50%'}}>
            <View style={globalStyles.userInfoSection}>
                <Title style={{alignSelf: 'center', margin: 20 }}>Welcome to Friendsley!</Title>
                <View style={{flexDirection: 'row', justifyContent: 'space-evenly', margin: 20}}>                    
                    <Button title="Sign Up" onPress={() => props.navigation.navigate('Sign Up')}/>
                    <Button title="Log In" onPress={() => props.navigation.navigate('Login')}/>
                </View>
                {/* <View>                    
                    <Button title="Go to Explore Screen" onPress={() => props.navigation.navigate("Friendsley")}/>
                </View> */}
            </View>
        </SafeAreaView>
        
    );
}