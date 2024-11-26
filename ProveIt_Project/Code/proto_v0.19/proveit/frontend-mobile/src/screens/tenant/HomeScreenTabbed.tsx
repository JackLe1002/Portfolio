import {View, StyleSheet, TouchableOpacity, Image} from "react-native";
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import React, {useEffect, useState} from "react";

import Text from "../../components/Text"
import ButtonPrimary from '../../components/ButtonPrimary';
import ButtonSecondary from '../../components/ButtonSecondary';
import {useAuthContext} from "../../hooks/useAuthContext";
import {TenantProperty} from "../../../types";
import {config} from "../../../config";
import { SIZES } from "../../components/Theme";

import houseDay from '../../../assets/house-day.png';
import houseNight from '../../../assets/house-night.png';

type HomeProps = {
    navigation: NavigationProp<ParamListBase>;
};

const SERVER_URL = config.SERVER_URL;

const HomeScreen: React.FC<HomeProps> = ({ navigation }) => {

    const { state } = useAuthContext();
    const { user } = state;

    const [isLoading, setIsLoading] = useState(false);
    const [properties, setProperties] = useState<TenantProperty[] | null>(null);

    let date = new Date();
    let hour = date.getHours();
    let houseImage;

    if (hour < 20 && hour > 6) {
        houseImage = houseDay;
    } else {
        houseImage = houseNight;
    }

    useEffect(() => {
        setIsLoading(true);
        if (user) {
            fetch(SERVER_URL + "/properties-tenant" + "?tenantId=" + user.id, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + user?.token,
                },
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Network response was not ok");
                    }
                    return response.json();
                })
                .then((data) => {
                    setIsLoading(false);
                    setProperties(data);
                })
                .catch((error) => {
                    console.error("Error fetching data: " + error);
                });
        }
    }, [user]);

    return (
        <View style={styles.container}>
            <View style={styles.textContainer}>
                <Text style={styles.propertyName}>{properties ? properties[0].name : null}</Text>
                <Text>{properties ? properties[0].streetAddress: null}</Text>
            </View>

            <View style={{alignItems: 'center'}}>
                <Image source={houseImage} style={styles.image}></Image>
            </View>

            <View style={styles.buttonContainer}>
                <ButtonSecondary
                    title='New Service Request'
                    onPress={() => navigation.navigate("TenantServiceRequest")}
                    style={{marginVertical: 10}}
                ></ButtonSecondary>
                <ButtonSecondary
                    title='Chat with homie'
                    onPress={() => navigation.navigate("Homie", {propertyId: properties ? properties[0].id : null})}
                    style={{marginVertical: 10}}
                ></ButtonSecondary>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    buttonContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textContainer: {
        padding: 35,
    },
    propertyName: {
        fontSize: 24,
        marginBottom: 10
    },
    imageContainer: {
        width: '15%',
        borderRadius: 25,
    },
    image: {
        width: SIZES.width * 0.8,
        height: SIZES.width * 0.8,
        borderRadius: 50,
        overflow: "hidden",
      } 
});
export default HomeScreen;