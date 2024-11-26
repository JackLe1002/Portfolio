import 'react-native-gesture-handler';

import React, { useState, useEffect } from 'react';
import { AuthProvider } from './src/contexts/AuthContext';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { View, ActivityIndicator } from 'react-native';
import * as Font from 'expo-font';
const App = () => {
    const [isReady, setIsReady] = useState(false);

    async function loadResources() {
        await Font.loadAsync({
            'Montserrat-Regular': require('./assets/fonts/Montserrat-Regular.ttf'),
        });
        setIsReady(true);
    }

    useEffect(() => {
        loadResources();
    }, []);

    if (!isReady) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

  return (
      <AuthProvider>
          <NavigationContainer>
              <AppNavigator />
          </NavigationContainer>
      </AuthProvider>
  );
};

export default App;

