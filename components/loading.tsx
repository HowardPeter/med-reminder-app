import { View } from 'react-native'
import React from 'react'
import LottieView from 'lottie-react-native'
import { animations } from '@/constants'

export default function Loading({ size }: Readonly<{ size: number }>) {
    return (
        <View style={{ height: size, aspectRatio: 1 }}>
            <LottieView style={{ flex: 1 }} source={animations.loading} autoPlay loop />
        </View>
    )
}