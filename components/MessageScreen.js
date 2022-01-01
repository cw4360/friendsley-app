import React, {useContext, useEffect, useState, useRef } from 'react';
import { SafeAreaView, View, Text, TextInput, Image, ScrollView, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; 
import { globalStyles } from '../styles/globalStyles';
import StateContext from './StateContext'; 

import { 
    // for storage access
    doc, getDoc, setDoc, updateDoc, arrayUnion
} from "firebase/firestore";

function formatJSON(jsonVal) {
    return JSON.stringify(jsonVal, null, 2);
}

export default function MessageScreen({ route, navigation }) {
    const { receipentEmail, chatUID } = route.params;

    const stateProps = useContext(StateContext);
    const db = stateProps.db;
    const userProfileDoc = stateProps.userProfileDoc; 
    const userEmail = userProfileDoc.email; 

    const [messages, setMessages] = useState([]);
    const [content, setContent] = useState('');

    const scrollViewRef = useRef();

    // Get chat messages when Message screen mounts
    useEffect(() => {
        firebaseGetMessages();
        // console.log(chatUID);
    }, []);

    async function firebaseGetMessages() {
        // Get the chat messages in the messages collection with the key of chatUID
        const docRef = doc(db, "messages", chatUID);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const messagesDoc = docSnap.data().messageObjects;
            setMessages(messagesDoc);
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }

    async function sendMessage() {
        // Create timestamp 
        const now = new Date().getTime(); 
        const date = new Date(now).toLocaleString("en-US", {timeZoneName: "short"});
        console.log("Date: ", date);
        const newMessage = {
            author: userEmail, 
            content: content, 
            receipent: receipentEmail,
            timestamp: now,
            date: date,
        };
        const newAllMessages = [...messages, newMessage];

        // Display new message immediately
        setMessages(newAllMessages);

        // Write new message to Firebase
        const messageRef = doc(db, 'messages', chatUID);

        await updateDoc(messageRef, {
            messageObjects: arrayUnion(newMessage)
        });

        // Clear message contents for next message
        setContent('');
    }

    return (
        <View style={{backgroundColor: '#FFF0BB', flex: 1}}>
            <ScrollView ref={scrollViewRef} style={{ padding: 15, paddingBottom: 25}}
                onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}>
                {messages.length ? ( messages.map( (obj) => {
                    return (
                        <View key={obj.timestamp} style={obj.author === userEmail ? 
                            globalStyles.senderMessageBox: globalStyles.receipentMessageBox}
                        >
                            <Text style={obj.author === userEmail ? globalStyles.senderText: globalStyles.receipentText}>{obj.date}</Text>
                            <Text style={obj.author === userEmail ? globalStyles.senderText: globalStyles.receipentText}>{obj.content}</Text>
                        </View>
                    );
                })) : 
                <View style={{paddingHorizontal: '10%'}}>
                    <Text style={{color: '#000', fontFamily: 'RobotoMono_500Medium',
                        textAlign: 'center'}}>
                        Begin the conversation by sending a message</Text>
                </View>
                }
            </ScrollView>
            <View style={{ height: '50%', backgroundColor: '#FFF', padding: 15}}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <View style={globalStyles.messageInput}>
                        <TextInput placeholder="Message Content"
                        style={{color: '#000', fontFamily: 'RobotoMono_500Medium', paddingLeft: 15}}
                        placeholderTextColor='grey'
                        value={content}
                        onChangeText={(value) => setContent(value)}
                        />
                    </View>
                    <TouchableOpacity onPress={() => sendMessage()}
                        style={{paddingLeft: 20, justifyContent: 'center', flex: .1}}>
                        <Icon  name="send" color="dodgerblue" size={25}/>
                    </TouchableOpacity>
                </View>
                
            </View>
        </View>
    );
}