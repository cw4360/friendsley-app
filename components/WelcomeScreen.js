import React from 'react';
import { SafeAreaView, View, Text, Button, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { globalStyles } from "../styles/globalStyles";

export default function WelcomeScreen(props) {
    return (
        <View style={globalStyles.userInfoSection}>
            <Text style={{alignSelf: 'center', margin: 20 }}>Welcome to Friendsley!</Text>
            <View style={{flexDirection: 'row', justifyContent: 'space-evenly', margin: 20}}>                    
                <Button title="Sign Up" onPress={() => props.navigation.navigate('Sign Up')}/>
                <Button title="Log In" onPress={() => props.navigation.navigate('Login')}/>
            </View>
            <View>                    
                <Button title="Go to Explore Screen" onPress={() => props.navigation.navigate("Friendsley")}/>
            </View>
        </View>
    );
}