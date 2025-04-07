import { View } from 'react-native'
import React from 'react'
import LottieView from 'lottie-react-native'
import { animations } from '@/constants'

export default function Thinking({ size }) {
    return (
        <View style={{ height: size, aspectRatio: 1 }}>
            <LottieView style={{ flex: 1 }} source={animations.thinking} autoPlay loop />
        </View>
    )
}