import React, { useState, useEffect, useCallback } from 'react';
import {View, TextInput, Button, Modal, ActivityIndicator, TouchableOpacity, ScrollView} from 'react-native';
import Text from '../../components/Text';
import { useAuthContext } from "../../hooks/useAuthContext";
import { Picker } from '@react-native-picker/picker';

import { StyleSheet } from 'react-native';
import {GeneralServiceType, Property, ServiceType, SpecificServiceType, Timeline} from "../../../types";
import {config} from "../../../config";
import {NavigationProp, ParamListBase} from "@react-navigation/native";
import ButtonPrimary from '../../components/ButtonPrimary';
import { SIZES } from '../../components/Theme';

const SERVER_URL = config.SERVER_URL;

type ServiceRequestProps = {
    navigation: NavigationProp<ParamListBase>;
};
const ServiceRequest: React.FC<ServiceRequestProps> = ( {navigation} ) => {
    const {state} = useAuthContext();
    const {user} = state;


    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const [generalServiceTypes, setGeneralServiceTypes] = useState<GeneralServiceType[]>([]);
    const [selectedGenType, setSelectedGenType] = useState<GeneralServiceType | null>(null);

    const [specificServices, setSpecificServices] = useState<SpecificServiceType[]>([]);
    const [selectedSpecService, setSelectedSpecService] = useState<SpecificServiceType | null | undefined>(null);

    const [timelines, setTimelines] = useState<Timeline[]>([]);
    const [selectedTimeline, setSelectedTimeline] = useState<Timeline | null>(null);

    const [issueDetail, setIssueDetail] = useState<string>("");

    const [property, setProperty] = useState<Property | null>(null);

    const GENERAL_SERVICE_TYPE_LINK = SERVER_URL + "/general-service-types";
    const SPECIFIC_SERVICES_LINK = SERVER_URL + "/specific-service-types";
    const TENANT_PROPERTY_LINK = SERVER_URL + '/properties-tenant';
    const TIMELINES_LINK = SERVER_URL + "/request-timelines";

    const fetchData = useCallback(
        async (url: string, method = "GET") => {
            const headers = new Headers();
            headers.append("Content-Type", "application/json");

            if (user) {
                headers.append("Authorization", `Bearer ${user.token}`);
            }
            const requestOptions = {
                method: method,
                headers: headers,
            };

            try {
                const response = await fetch(url, requestOptions);
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            } catch (error) {
                console.error("Error:", error);
                throw error;
            }
        },
        [user],
    );

    useEffect(() => {
        fetchData(GENERAL_SERVICE_TYPE_LINK)
            .then((response) => {
                if (response.isSuccess) {
                    setGeneralServiceTypes(response.data);
                } else {
                    setError(response.message);
                }
            });

        fetchData(TENANT_PROPERTY_LINK + "?tenantId=" + user?.id)
            .then((response) => {
                if (!response.error) {
                    setProperty(response[0]);
                } else {
                    setError("ERROR GETTING PROPERTY");
                }
            });

        fetchData(TIMELINES_LINK)
            .then((response) => {
                if (response.isSuccess) {
                    setTimelines(response.data);
                } else {
                    setError(response.message);
                }
            });
    }, [fetchData, GENERAL_SERVICE_TYPE_LINK, TENANT_PROPERTY_LINK, TIMELINES_LINK, user?.id]);

    useEffect (() => {
        if (selectedGenType) {
            const params = new URLSearchParams({parentId: selectedGenType.id});

            fetchData(SPECIFIC_SERVICES_LINK + "?" + params.toString())
                .then((response) => {
                    if (response.isSuccess) {
                        setSpecificServices(response.data);
                    } else {
                        setError(response.message);
                    }
                })
                .catch((error) => {
                    console.error("Error fetching data:", error);
                    setError(error.error);
                });
        }
    }, [selectedGenType])


    const handleGeneralTypeSelect = (type: string) => {
        const actual_type = generalServiceTypes.find(t => t.id === type);
        setSelectedGenType(actual_type || null);
    };


    const handleSpecServiceSelect = (type: string) => {
        console.log('Handling spec service select...');
        const actual_type = specificServices.find(t => t.id === type);
        console.log("actual type:" );
        console.log(actual_type);
        setSelectedSpecService(actual_type);
        console.log("selectedSpec:" + selectedSpecService);
        
    };

    const handleTimelineSelect = (itemValue: string | number) => {
        const timeline = timelines.find(t => t.id === itemValue);
        setSelectedTimeline(timeline || null);
    };

    const handleSubmit = () => {
        setIsLoading(true);
        setError(null);
        console.log('Handling submit...');


        const createRequestBody = {
            propertyId: property?.id,
            timelineId: selectedTimeline?.id,
            serviceTypeId: selectedSpecService?.id,
            detail: issueDetail
        }
        console.log(createRequestBody);

        fetch(SERVER_URL + "/ticket/initiated", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + user?.token,
            },
            body: JSON.stringify(createRequestBody),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((responseJson) => {
                setIsLoading(false);
                if (responseJson.isSuccess) {
                    alert(responseJson.message ?? "Request successfully created");
                    navigation.navigate("Active Tickets");
                } else {
                    setError(responseJson.message);
                }
            })
            .catch((error) => setError(error));
    }


    return (
        <ScrollView style={styles.container}>
            <View style={styles.formGroup}>
                <Text style={styles.label}>What type of service is needed?</Text>
                <Picker
                    selectedValue={selectedGenType?.id}
                    onValueChange={(itemValue, itemIndex) => handleGeneralTypeSelect(itemValue)}>
                    {generalServiceTypes.map((type) => (
                        <Picker.Item key={type.id} label={type.serviceType} value={type.id} />
                    ))}
                </Picker>
            </View>

            <View style={styles.formGroup}>
                <Text style={styles.label}>Which subcategory best describes the required service?</Text>
                <Picker
                    selectedValue={selectedSpecService?.id}
                    onValueChange={(itemValue, itemIndex) => handleSpecServiceSelect(itemValue)}>
                    {specificServices.map((service) => (
                        <Picker.Item key={service.id} label={service.serviceType} value={service.id} />
                    ))}
                </Picker>
            </View>

            <View style={styles.formGroup}>
                <Text style={styles.label}>When should the work be done?</Text>
                <Picker
                    selectedValue={selectedTimeline?.id}
                    onValueChange={(itemValue, itemIndex) => handleTimelineSelect(itemValue)}>
                    {timelines.map((timeline) => (
                        <Picker.Item key={timeline.id} label={timeline.title} value={timeline.id} />
                    ))}
                </Picker>
            </View>

            <View style={styles.formGroup}>
                <Text style={styles.label}>Describe the issue that needs to be addressed:</Text>
                <TextInput
                    multiline
                    numberOfLines={3}
                    onChangeText={setIssueDetail}
                    value={issueDetail}
                    style={styles.textInput}
                />
            </View>

            <View style={styles.buttonContainer}>
                {isLoading ? (
                    <ActivityIndicator />
                ) : (
                    <ButtonPrimary title="Submit" onPress={handleSubmit} />
                )}
            </View>
        </ScrollView>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    formGroup: {
        marginBottom: 20,
    },
    label: {
        marginBottom: 10,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
    },
    buttonContainer: {
        marginTop: 20,
        marginBottom: SIZES.height * 0.1,
    },
    textInput: {
        height: 100,
        borderColor: 'gray',
        borderWidth: 1,
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    }
});

export default ServiceRequest;