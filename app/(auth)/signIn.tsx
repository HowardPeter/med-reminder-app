import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native'
import React, { useState } from 'react'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import Octicons from '@expo/vector-icons/Octicons'
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import CustomKeyboardView from '@/components/CustomKeyboardView';
import { useAuth } from '../../hooks/useAuth';
import { useRouter } from 'expo-router'
import Loading from '@/components/loading';

export default function SignIn() {
    const router = useRouter();
    const { login } = useAuth();
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    // Hàm xử lý đăng nhập
    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Sign In', 'Please fill all fields!');
            return;
        }
        setIsLoading(true)
        const response = await login(email, password);
        setIsLoading(false)
        if (response.success) {
            Alert.alert('Sign In', 'Login successfully!');
            setEmail("");
            setPassword("");
        } else {
            console.log('Sign In', response.msg);
        }
    };

    return (
        <CustomKeyboardView>
            <View className='bg-white'>
                {/* Logo và tên ứng dụng */}
                <View style={{ alignItems: 'center' }}>
                    <Image
                        source={require('../../assets/images/logo.jpg')}
                        style={styles.image}
                    />
                    <Text style={styles.appName}>PILLPALL</Text>
                </View>

                {/* Title và Welcome */}
                <View style={{ alignItems: 'center', marginTop: 50 }}>
                    <Text style={styles.welcome}>Welcome Back</Text>
                    <Text style={styles.title}>Log in to your account</Text>
                </View>

                {/* Email Input */}
                <View style={{ alignItems: 'center' }}>
                    <View style={{ marginTop: 50 }}>
                        <Text style={styles.email}>Email</Text>
                        <View style={styles.inputContainer}>
                            <Octicons name="mail" size={20} color="#000000" style={styles.icon} />
                            <TextInput
                                value={email}
                                onChangeText={setEmail}
                                placeholder='Enter your email...'
                                style={styles.emailInput}
                            />
                        </View>
                    </View>
                </View>

                {/* Password Input */}
                <View style={{ alignItems: 'center' }}>
                    <View style={{ marginTop: 25 }}>
                        <Text style={styles.email}>Password</Text>
                        <View style={styles.inputContainer}>
                            <Octicons name="lock" size={20} color="#000000" style={styles.icon} />
                            <TextInput
                                value={password}
                                onChangeText={setPassword}
                                placeholder='**********'
                                style={styles.emailInput}
                                secureTextEntry={!isPasswordVisible}
                            />
                            <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                                {isPasswordVisible ? (
                                    <AntDesign name="eye" size={20} color="black" />
                                ) : (
                                    <Entypo name="eye-with-line" size={20} color="black" />
                                )}
                            </TouchableOpacity>
                        </View>
                        {/* Forgot password */}
                        <TouchableOpacity onPress={() => router.push('/(auth)/forgotPassword')}>
                            <Text style={styles.forgotPass}>Forgot password?</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Button Login */}
                <View style={{ alignItems: 'center', marginTop: 25 }}>
                    {isLoading ?
                        <Loading size={hp(7)} />
                        :
                        <View>
                            <TouchableOpacity onPress={handleLogin} style={styles.containerButton}>
                                <Text style={styles.SignInButton}>Sign In</Text>
                            </TouchableOpacity>
                        </View>
                    }
                </View>


                {/* Footer */}
                <View style={{ alignItems: 'center', marginTop: 50 }} className='mb-10'>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.dontHaveAccount}>Don’t have an account?</Text>
                        <TouchableOpacity onPress={() => router.push('/(auth)/signUp')}>
                            <Text style={styles.SignUp}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>
                    {/* Login with phone number */}
                    <TouchableOpacity>
                        <View style={{ marginTop: 20 }}>
                            <Text style={styles.loginWithPhone}>Login with phone number</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </CustomKeyboardView>
    );
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
});