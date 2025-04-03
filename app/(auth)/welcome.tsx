import React, { useRef, useState } from 'react';
import { View, Text, StatusBar, SafeAreaView, TouchableOpacity, FlatList, Image } from 'react-native';
import { COLORS, SIZES } from '@/constants/index';
import data from '@/data/onboarding.js';
import AntDesign from '@expo/vector-icons/AntDesign';
import { router } from 'expo-router';

const Welcome = () => {
    const flatlistRef = useRef();
    const [currentPage, setCurrentPage] = useState(0);

    // Cập nhật currentPage khi thay đổi các item nhìn thấy
    const handleViewableItemsChanged = useRef(({ viewableItems }) => {
        if (viewableItems && viewableItems[0]) {
            setCurrentPage(viewableItems[0].index);
        }
    });

    const handleNext = () => {
        if (currentPage === data.length - 1) {
            router.push('/(auth)/signIn');
        } else {
            flatlistRef.current.scrollToIndex({
                animated: true,
                index: currentPage + 1
            });
        }
    };

    const handleBack = () => {
        if (currentPage === 0) return;
        flatlistRef.current.scrollToIndex({
            animated: true,
            index: currentPage - 1
        });
    };

    const handleSkipToEnd = () => {
        router.push('/(auth)/signIn');
    };

    const handleGetStarted = () => {
        router.push('/(auth)/signIn');
    };

    return (
        <View style={{
            flex: 1,
            backgroundColor: COLORS.background,
            justifyContent: 'center'
        }}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

            <SafeAreaView>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingHorizontal: SIZES.base * 2
                }}>
                    <TouchableOpacity
                        onPress={handleBack}
                        style={{ padding: SIZES.base }}>
                        <AntDesignIcons
                            name="left"
                            style={{
                                fontSize: 25,
                                color: COLORS.black,
                                opacity: currentPage === 0 ? 0 : 1
                            }}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handleSkipToEnd}>
                        <Text style={{
                            fontSize: 18,
                            color: COLORS.black,
                            opacity: currentPage === data.length - 1 ? 0 : 1
                        }}>Skip</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>

            <FlatList
                data={data}
                pagingEnabled
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={item => item._id ? item._id : item.id} // Kiểm tra _id, nếu không có thì dùng id
                renderItem={({ item }) => (
                    <View style={{
                        width: SIZES.width,
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <View style={{ alignItems: 'center', marginVertical: SIZES.base * 2 }}>
                            <Image
                                source={item.image}
                                style={{ width: 350, height: 350, resizeMode: 'contain' }}
                            />
                        </View>
                        <View style={{ paddingHorizontal: SIZES.base * 4, marginVertical: SIZES.base * 4 }}>
                            <Text style={{
                                fontSize: 27,
                                textAlign: 'center',
                                fontWeight: 'bold',
                                marginBottom: 15
                            }}>
                                {item.title}
                            </Text>
                            <Text style={{
                                fontSize: 16,
                                opacity: 0.7,
                                textAlign: 'center',
                                marginTop: 1,
                                lineHeight: 24
                            }}>
                                {item.description}
                            </Text>
                        </View>
                    </View>
                )}
                ref={flatlistRef}
                onViewableItemsChanged={handleViewableItemsChanged.current}
                viewabilityConfig={{ viewAreaCoveragePercentThreshold: 100 }}
                initialNumToRender={1}
                extraData={SIZES.width}
            />

            <SafeAreaView>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingHorizontal: SIZES.base * 2,
                    paddingVertical: SIZES.base * 2
                }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        {
                            [...Array(data.length)].map((_, index) => (
                                <View
                                    key={index}
                                    style={{
                                        width: 12,
                                        height: 12,
                                        borderRadius: 6,
                                        backgroundColor: index === currentPage
                                            ? '#04A996'
                                            : '#04A99640',
                                        marginRight: 8
                                    }} />
                            ))
                        }
                    </View>

                    {
                        currentPage !== data.length - 1 ? (
                            <TouchableOpacity
                                onPress={handleNext}
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: 60,
                                    height: 60,
                                    borderRadius: 30,
                                    backgroundColor: '#04A996'
                                }}
                                activeOpacity={0.8}
                            >
                                <AntDesign name="right" style={{ fontSize: 18, color: COLORS.white, opacity: 0.3 }} />
                                <AntDesign name="right" style={{ fontSize: 25, color: COLORS.white, marginLeft: -15 }} />
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity
                                onPress={handleGetStarted}
                                style={{
                                    paddingHorizontal: SIZES.base * 2,
                                    height: 60,
                                    width: '80%',
                                    borderRadius: 30,
                                    backgroundColor: '#04A996',
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    alignSelf: 'center'
                                }}>
                                <Text style={{
                                    color: COLORS.white,
                                    fontSize: 18,
                                    fontWeight: 'bold',
                                }}>
                                    Get Started
                                </Text>
                            </TouchableOpacity>
                        )
                    }
                </View>
            </SafeAreaView>
        </View>
    );
};

export default Welcome;