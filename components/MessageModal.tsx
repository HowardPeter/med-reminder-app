import { Modal, Pressable, View, StyleSheet, Text, Touchable, TouchableOpacity } from "react-native";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useRouter } from "expo-router";

    interface MessageModalProps {
        isVisible: boolean;
        onClose: () => void;
        email: string;
    }

const MessageModal: React.FC<MessageModalProps> = ({ isVisible, onClose, email }) => {
    const router = useRouter();
    return <Modal animationType="slide" visible={isVisible} transparent={true}>
        <Pressable style={styles.container} onPress={onClose}>
            <View style={styles.modalView}>
                <View style={styles.modalIcon}>
                    <FontAwesome name="check" size={60} color={'#FFFFFF'}/>
                </View>
                <View style={styles.modalContent}>
                    <Text 
                        className="text-center font-bold"
                        style={[styles.headerText, {fontSize: wp(5.5)}]}
                    >Vertified successfully</Text>
                    <Text 
                        className="text-center"
                        style={styles.messageText}
                    >Please continue to reset your password!!</Text>
                    <TouchableOpacity 
                        onPress={() => { 
                            onClose();
                            router.replace({pathname: '/enterNewPassword', params: { email }});
                        }}
                        className="bg-teal-500 rounded-3xl py-3 mt-6 px-5 h-14 justify-center items-center" 
                        style={{width: wp(40)}}
                    >
                    <Text className="text-white text-lg font-bold text-center">Change password</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Pressable>
    </Modal>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 25, 
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)'
    },
    modalView: {
        backgroundColor: '#FFFFFF',
        width: '100%',
        alignItems: 'center',
        paddingTop: 45, 
        borderRadius: 15,
        elevation: 5, 
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowRadius: 5,
        shadowOffset: {width: 0, height: 2},
    },
    modalIcon: {
        backgroundColor: '#04A996',
        height: 100,
        width: 100,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: -50,
        elevation: 5, 
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowRadius: 5,
        shadowOffset: {width: 0, height: 2},
    },
    modalContent: {
        width: '100%',
        alignItems: 'center',
        padding: 20,
    },
    headerText: {
        textAlign: 'center',
        marginBottom: 10
    },
    messageText: {
        textAlign: 'center',
    }
})

export default MessageModal;