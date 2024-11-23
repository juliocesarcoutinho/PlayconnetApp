import { Stack } from 'expo-router';

export default function RootLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: true,
                headerTransparent: true,
                headerTitle: '',
                headerTintColor: 'white',
                headerStyle: {
                    backgroundColor: 'transparent',
                },
            }}
        />
    );
}
