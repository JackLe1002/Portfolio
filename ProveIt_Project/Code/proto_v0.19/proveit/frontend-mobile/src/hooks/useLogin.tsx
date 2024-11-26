import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { useNavigation } from "@react-navigation/native";
import { CommonActions } from '@react-navigation/native';
import { StackNavigationProp } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {config} from "../../config";
import { User } from "../../types"

type RootStackParamList = {
    DashboardOwner: undefined;
    DashboardTenant: undefined;
    DashboardService: undefined;
    HomeownerDashboard: undefined;
};

export function useLogin() {
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { dispatch } = useAuthContext();
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        setError("");

        const LOGIN_LINK = config.SERVER_URL + "/login";
        console.log(LOGIN_LINK);

        // API call
        const response = await fetch(LOGIN_LINK, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        const json = await response.json();

        // Handle BAD/GOOD response
        if (response.status === 200) {
            setIsLoading(false);

            const user : User = json.user;
            AsyncStorage.setItem("user", JSON.stringify(user))
            dispatch({ type: "LOGIN", payload: { user } });

            let screenName = "";

            if (user.phoneVerified && user.role?.role) {
                switch (user.role?.role) {
                    case "owner":
                    case "manager":
                        screenName = "HomeownerDashboard";
                        break;
                    case "tenant":
                        screenName = "TenantDashboard";
                        break;
                    case "service_provider":
                        screenName = "SPDashboard";
                        break;
                    default:
                        throw new Error(`No dashboard route for user's role of ${user.role?.role}`);
                }

                navigation.dispatch(
                    CommonActions.reset({
                        index: 0,
                        routes: [{ name: screenName }],
                    })
                );
            }
            // TODO: Add screens for these navs
            // else if (user.phoneVerified) {
            //     navigation.navigate('/setrole');
            // } else {
            //     navigation.navigate('/verifyphone');
            // }
        } else {
            console.log("Login failure")
            setIsLoading(false);
            setError(json.message);
        }
    };

    return { login, isLoading, error };
}
