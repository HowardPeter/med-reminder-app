import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import React from 'react'
import Octicons from '@expo/vector-icons/Octicons'
import AntDesign from '@expo/vector-icons/AntDesign';
import CustomKeyboardView from '@/components/CustomKeyboardView';

export default function signIn() {
    return (
        <CustomKeyboardView inChat={false}>
            <View className='bg-white'>
                {/* Chứa logo và tên ứng dụng */}
                <View style={{ alignItems: 'center' }}>
                    <Image
                        source={require('../../assets/images/logo.jpg')}
                        style={styles.image}
                    />
                    <Text style={styles.appName}>
                        PILLPALL
                    </Text>
                </View>

                {/* Chứa title và welcome */}
                <View style={{ alignItems: 'center', marginTop: 50 }}>
                    <Text style={styles.welcome}>
                        Welcome Back
                    </Text>
                    <Text style={styles.title}>
                        Log in to your account
                    </Text>
                </View>
                {/* Chứa Email Text Input với icon */}
                <View style={{ alignItems: 'center' }}>
                    <View style={{ marginTop: 50 }}>
                        <Text style={styles.email}>
                            Email
                        </Text>
                        <View style={styles.inputContainer}>
                            <Octicons name="mail" size={20} color="#000000" style={styles.icon} />

                            <TextInput
                                placeholder='Enter your email...'
                                style={styles.emailInput}
                            />
                        </View>
                    </View>
                </View>
                {/* Chứa Password Text Input với icon */}
                <View style={{ alignItems: 'center' }}>
                    <View style={{ marginTop: 25 }}>
                        <Text style={styles.email}>
                            Password
                        </Text>
                        <View style={styles.inputContainer}>
                            <Octicons name="lock" size={20} color="#000000" style={styles.icon} />
                            <TextInput
                                placeholder='**********'
                                style={styles.emailInput}
                            />
                            <TouchableOpacity>
                                <AntDesign name="eye" size={20} color="#000000" style={styles.icon} />
                            </TouchableOpacity>
                        </View>
                        {/* Forgot password */}
                        <TouchableOpacity>
                            <Text style={styles.forgotPass}>
                                Forgot password?
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                {/* Button Login */}
                <View style={{ alignItems: 'center', marginTop: 25 }}>
                    <TouchableOpacity
                        style={styles.containerButton}
                    >
                        <Text style={styles.SignInButton}>
                            Sign In
                        </Text>
                    </TouchableOpacity>
                </View>
                {/* Footer */}
                <View style={{ alignItems: 'center', marginTop: 50 }} className='mb-10'>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.dontHaveAccount}>
                            Don’t have an account?
                        </Text>
                        <TouchableOpacity>
                            <Text style={styles.SignUp}>
                                Sign Up
                            </Text>
                        </TouchableOpacity>
                    </View>
                    {/* Login with phone number */}
                    <TouchableOpacity>
                        <View
                            style={{ marginTop: 20 }}>
                            <Text style={styles.loginWithPhone}>
                                Login with phone number
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </CustomKeyboardView>
    )
}

const styles = StyleSheet.create({
    image: {
        width: 150,
        height: 154,
        marginTop: 77
    },
    appName: {
        fontSize: 24,
        fontFamily: 'IstokWeb-Bold',
        letterSpacing: 8,
        fontWeight: 'bold',
        color: '#04A996',
    },
    welcome: {
        fontSize: 30,
        fontWeight: 'bold',
        letterSpacing: 3,
        fontFamily: 'IstokWeb-Bold',
    },
    title: {
        fontSize: 16,
        fontFamily: 'InstrumentSans',
        letterSpacing: 1,
        color: '#949494',
        marginTop: 10,
        fontWeight: 'bold'
    },
    email: {
        fontSize: 16,
        fontFamily: 'InstrumentSans',
        fontWeight: '800',
        marginBottom: 5,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 10,
        borderColor: '#949494',
        borderWidth: 1,
        width: 300,
        height: 50,
        paddingHorizontal: 10
    },
    icon: {
        marginRight: 10,
    },
    emailInput: {
        flex: 1,
    },
    forgotPass: {
        fontSize: 16,
        fontFamily: 'InstrumentSans',
        fontWeight: '800',
        color: '#949494',
        marginTop: 20,
        textDecorationColor: "#949494",
        textDecorationLine: "underline",
    },
    containerButton: {
        width: 300,
        height: 50,
        backgroundColor: '#04A996',
        borderRadius: 20,
        justifyContent: 'center',
    },
    SignInButton: {
        textAlign: 'center',
        color: 'white',
        fontSize: 16,
        fontFamily: 'InstrumentSans',
        fontWeight: 'bold',
    },
    dontHaveAccount: {
        fontSize: 16,
        fontFamily: 'InstrumentSans',
        fontWeight: '800',
        color: '#949494',
        paddingRight: 5,
    },
    SignUp: {
        fontSize: 16,
        fontFamily: 'InstrumentSans',
        fontWeight: '800',
        color: '#04A996',
        paddingLeft: 5,
    },
    loginWithPhone: {
        fontSize: 16,
        fontFamily: 'InstrumentSans',
        fontWeight: '800',
        color: '#949494'
    }
})