import React from 'react';
import {View, Text, ImageBackground, StyleSheet, TouchableOpacity, Platform, StatusBar} from 'react-native';
import { useFonts, Inter_400Regular } from '@expo-google-fonts/inter';
import { FontAwesome } from '@expo/vector-icons'; // Biblioteca para ícones

export default function WelcomeScreen() {
    const [fontsLoaded] = useFonts({
        Inter_400Regular,
    });

    if (!fontsLoaded) {
        return null;
    }

    return (
        <ImageBackground
            source={require('../../assets/images/welcome/fundo.jpg')}
            style={styles.background}
            imageStyle={styles.imageStyle}
        >
            <View style={styles.overlay} />
            <View style={styles.content}>
                <Text style={styles.logo}>Play Connect</Text>
                <Text style={styles.description}>
                    Bem-vindo à nossa comunidade de adolescentes Play Connect!
                </Text>
                <TouchableOpacity style={styles.button} activeOpacity={0.7}>
                    <Text style={styles.buttonText}>Entrar com e-mail e senha</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.googleButton]} activeOpacity={0.7}>
                    <FontAwesome name="google" size={20} color="#888888" style={styles.googleIcon} />
                    <Text style={[styles.buttonText, styles.googleButtonText]}>
                        Entrar com Google
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.7}>
                    <Text style={styles.linkText}>Ainda não tem uma conta? Criar conta</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageStyle: {
        resizeMode: 'cover',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 44,
    },
    logo: {
        fontSize: 32,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 20,
    },
    description: {
        fontSize: 16,
        color: 'white',
        textAlign: 'center',
        marginBottom: 30,
        fontFamily: 'Inter_400Regular',
    },
    button: {
        backgroundColor: '#6200EE',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 25,
        marginBottom: 15,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        width: '80%',
    },
    googleButton: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#888888', // Borda cinza suave
    },
    googleIcon: {
        marginRight: 15,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
    },
    googleButtonText: {
        color: '#888888', // Texto em cinza suave
    },
    linkText: {
        color: 'white',
        marginTop: 20,
        textDecorationLine: 'underline',
    },
});
