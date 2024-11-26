import React, {useState, useEffect, useRef} from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Animated } from 'react-native';
import {useAuthContext} from "../../hooks/useAuthContext";
import {config} from "../../../config";
import {RouteProp} from '@react-navigation/native';
import { AppStackParamList } from "../../navigation/AppNavigator";
import ButtonPrimary from '../../components/ButtonPrimary';
import { SIZES } from '../../components/Theme';

const SERVER_URL = config.SERVER_URL;

interface HomieProps {
    route: RouteProp<AppStackParamList, 'Homie'>;
}
interface IMessage {
    id: number;
    text: string;
    sender: string;
}

interface IRasaResponse {
    recipient_id: string;
    text: string;
}

const TypingAnimation = () => {
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0,
                    duration: 400,
                    useNativeDriver: true,
                }),
            ])
        );

        animation.start();

        return () => animation.stop();
    }, [opacity]);

    return (
        <Animated.Text style={{ opacity: opacity }}> . . . </Animated.Text>
    );
};

const Homie:React.FC<HomieProps> = ({ route}) => {

    const { propertyId } = route.params;
    console.log("Property ID: ", propertyId)

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [userInput, setUserInput] = useState<string>("");
    const [isThinking, setIsThinking] = useState<boolean>(false);

    const {state} = useAuthContext();
    const {user} = state;

    const scrollViewRef = useRef<ScrollView>(null);

    const processMessage = async (botMessage: IRasaResponse) => {
        return new Promise<void>((resolve) => {
            setTimeout(() => {
                setMessages((prevMessages) => [
                    ...prevMessages,
                    {
                        id: prevMessages.length + 1,
                        text: botMessage.text,
                        sender: "bot",
                    },
                ]);
                resolve();
            }, botMessage.text.length * 30);
        });
    };


    const handleSubmit = async () => {
        const messageToSend = userInput.trim();
        if (!messageToSend) return;

        setUserInput("");
        setIsThinking(true);

        const userId = user?.token;
        const userMessage: IMessage = {
            id: messages.length + 1,
            text: messageToSend,
            sender: userId || "unknown",
        };
        setMessages((prevMessages) => [...prevMessages, userMessage]);

        try {
            const response = await fetch(
                `${SERVER_URL}/chat-response`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        sender: userId,
                        message: messageToSend,
                        metadata: { propertyId: propertyId },
                    }),
                },
            );

            const responseData: IRasaResponse[] = await response.json();
            for (const botMessage of responseData) {
                await processMessage(botMessage);
            }
            setIsThinking(false);
        } catch (error) {
            console.error("Error sending message to Rasa:", error);
        }
    };

    const handleChange = (text: string) => {
        setUserInput(text);
    };

    const keyboardVerticalOffset = Platform.OS === 'ios' ? 80 : 0

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container} keyboardVerticalOffset={keyboardVerticalOffset}>
            <ScrollView style={styles.messagesContainer}
                        ref={scrollViewRef}
                        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
                        onLayout={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
            >
                {messages.map((msg) => (
                    <View key={msg.id} style={[msg.sender !== 'bot' ? styles.messageBubbleSent : styles.messageBubbleReceived, msg.sender !== 'bot' ? styles.sent : styles.received]}>
                        <Text style={[msg.sender !== 'bot' ? styles.textSent : styles.textReceived]} >{msg.text}</Text>
                    </View>
                ))}
                {isThinking && (
                    <View style={[styles.messageBubbleReceived, styles.received]}>
                        <TypingAnimation />
                    </View>
                )}
            </ScrollView>
            <View style={styles.inputContainer}>
                <TextInput
                    value={userInput}
                    onChangeText={handleChange}
                    style={styles.input}
                    placeholder="Type or speak"
                    returnKeyType="send"
                    onSubmitEditing={handleSubmit}
                />
                {/*{browserSupportsSpeechRecognition && (*/}
                {/*    <>*/}
                {/*        <TouchableOpacity onPress={startDictation} disabled={listening} style={styles.button}>*/}
                {/*            <Text>Start</Text>*/}
                {/*        </TouchableOpacity>*/}
                {/*        <TouchableOpacity onPress={stopDictation} disabled={!listening} style={styles.button}>*/}
                {/*            <Text>Stop</Text>*/}
                {/*        </TouchableOpacity>*/}
                {/*    </>*/}
                {/*)}*/}
                <ButtonPrimary title='Send' onPress={handleSubmit}></ButtonPrimary>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',

    },
    messagesContainer: {
        flex: 1,
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 20,
    },
    messageBubbleSent: {
        padding: 10,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 2,
        marginVertical: 5,
        maxWidth: '80%',
    },
    messageBubbleReceived: {
        padding: 10,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderBottomLeftRadius: 2,
        borderBottomRightRadius: 20,
        marginVertical: 5,
        maxWidth: '80%',
    },
    sent: {
        alignSelf: 'flex-end',
        color: 'white',
        backgroundColor: '#194185',
        textDecorationColor: 'white',
    },
    received: {
        alignSelf: 'flex-start',
        backgroundColor: '#ebebeb',
    },
    inputContainer: {
        minHeight: 100,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#f5f5f5',
    },
    input: {
        flex: 1,
        height: 40,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 10,
        marginRight: 10,
    },
    textSent: {
        fontFamily: 'Montserrat-Regular',
        fontSize: SIZES.h3,
        color: 'white',
    },
    textReceived: {
        fontFamily: 'Montserrat-Regular',
        fontSize: SIZES.h3,
        color: 'black',
    },
    text: {
        fontSize: SIZES.h3,
    }
});

export default Homie;
