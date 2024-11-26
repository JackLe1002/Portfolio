import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { CommonActions } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useAuthContext } from './useAuthContext'

type RootStackParamList = {
    Home: undefined;
};

export const useLogout = () => {
    const { dispatch } = useAuthContext()
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    const logout = () => {
        // remove user from local storage
        AsyncStorage.removeItem('user')

        // dispatch logout action
        dispatch({ type: 'LOGOUT' })

        // navigate to home screen
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: 'Home' }],
            })
        );
    }

    return { logout }
}