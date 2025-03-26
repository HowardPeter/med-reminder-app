import { View, Text } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import React from 'react'

export default function signIn() {
    return (
        <View>
            <Text style={{ fontSize: hp(2.8) }} className='font-bold text-center'>signIn</Text>
        </View>
    )
}