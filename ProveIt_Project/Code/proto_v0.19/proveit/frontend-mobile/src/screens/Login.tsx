import React, {useState} from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, StatusBar, Image, ScrollView } from 'react-native';
import { useLogin } from "../hooks/useLogin";
import proveitLogo from '../../assets/prove-it-logo-200.png';
import Footer from '../components/Footer';
import CustomButton from "../components/CustomButton";
import { COLOURS, SIZES, FONTWEIGHT } from '../components/Theme';
import Text from '../components/Text';
import ButtonPrimary from '../components/ButtonPrimary';

const Login = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const { login, error, isLoading } = useLogin();
    const handleLogin = async () => {
        if (username && password) {
            await login(username, password);
            //console.log("Error" + error);
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView style={{padding: 20}}>
                <StatusBar barStyle="dark-content" />

                <View style={styles.logoContainer}>
                    <Image source={proveitLogo} style={styles.logo} />
                    <Text style={styles.title}>Welcome Back!</Text>                
                </View>

                <View style={styles.inputContainer}>
                    <TextInput
                        autoCapitalize={"none"}
                        style={styles.input}
                        placeholder="Email"
                        value={username}
                        onChangeText={setUsername}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        value={password}
                        secureTextEntry
                        onChangeText={setPassword}
                    />
                </View>

                <ButtonPrimary title='Log in' onPress={handleLogin} style={styles.button}></ButtonPrimary>
                
                <View style={{flex: 1, alignItems: 'center', marginVertical: '5%'}}>
                    <TouchableOpacity style={{marginTop: '5%'}}>
                        <Text style={styles.anchorText}>Forgot Password?</Text>
                    </TouchableOpacity>

                    <Text style={{color: 'black', marginTop: '10%'}}>Don't have an account?</Text>
                    <TouchableOpacity>
                        <Text style={styles.anchorText}>Register</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <Footer>
                <Text style={{color:'white'}}>HomeTrumpeter LLC</Text>
            </Footer>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    logoContainer: {
        flexDirection:'column',
        alignItems:'center',
    },
    logo: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
        marginTop: '20%'
    },
    title: {
        fontSize: SIZES.h1,
        fontFamily: 'Montserrat-Regular',
        marginTop: '10%',
        textAlign: 'center',
    },
    input: {
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 5,
        marginBottom: 20,
        fontFamily: 'Montserrat-Regular',
    },
    inputContainer: {
        marginVertical: '10%'
    },
    button: {
        minWidth: '50%',
        minHeight: '5%',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontFamily: 'Montserrat-Regular',
    },
    anchorText: {
        color: '#007bff',
        fontSize: SIZES.p,
        fontFamily: 'Montserrat-Regular',
    },
});

export default Login;