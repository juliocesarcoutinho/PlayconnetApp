import {StatusBar, View} from 'react-native';
import WelcomeScreen from "@/app/components/WelcomeScreen";
import React from 'react';

export default function Index() {
    return (
        <>
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
            <View
                style={{
                    flex: 1,
                }}
            >
                <WelcomeScreen />
            </View>
        </>
    );
}
