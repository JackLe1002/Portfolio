import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Modal, FlatList, SectionList, ScrollView } from 'react-native';
import Text from '../../components/Text';
import { useNavigation } from '@react-navigation/native';
import { useAuthContext } from '../../hooks/useAuthContext';
import { FontAwesome6 } from '@expo/vector-icons';

import { Property, PropertyDetail, ServiceRequest } from '../../../types';
import {config} from "../../../config";
import { SIZES } from '../../components/Theme';
import ButtonPrimary from '../../components/ButtonPrimary';
import ButtonSecondary from '../../components/ButtonSecondary';

const serverAddress = config.SERVER_URL;

type PropertyItemProps = {
    item: Property;
};

type ServiceRequestItemProps = {
    item: ServiceRequest;
};

const PropertiesTable = () => {
    const { state } = useAuthContext();
    const { user } = state;
    const [isLoading, setIsLoading] = useState(false);

    const [properties, setProperties] = useState<Property[] | null>(null);
    const [update, setUpdate] = useState<boolean>(false);
    const [serviceRequests, setServiceRequests] = useState<ServiceRequest[] | null>(null);
    const [activeServiceRequests, setActiveServiceRequests] = useState<ServiceRequest[] | null>(null);
    const [completedServiceRequests, setCompletedServiceRequests] = useState<ServiceRequest[] | null>(null);


    const [propertyDetail, setPropertyDetail] = useState<PropertyDetail | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [isPropertySelected, setIsPropertySelected] = useState(false);
    const [serviceRequestSelected, setServiceRequestSelected] = useState<ServiceRequest | null>(null);

    const navigation = useNavigation();

    useEffect(() => {
        setIsLoading(true);
        fetch(serverAddress + '/properties-owner', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + user?.token,
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                setIsLoading(false);
                setProperties(data);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, [user?.token, update]);

    useEffect(() => {
        if(serviceRequests === null) {
            setIsLoading(true);
            fetch(serverAddress + '/ticket/manager/tickets', {
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

                    let activeSR = data.filter((sr: ServiceRequest) => !['withdrawn', 'rejected', 'completed'].includes(sr.status));
                    let completedSR = data.filter((sr: ServiceRequest) => ['withdrawn', 'rejected', 'completed'].includes(sr.status));
                    
                    setActiveServiceRequests(activeSR);
                    setCompletedServiceRequests(completedSR);
                    setServiceRequests(data);
                })
                .catch((error) => {
                    console.error("Error fetching tickets data: " + error);
                });
        }
    }, [user?.token, update]);

    const handleDelete = (item: Property) => {
        // Implement delete functionality
    };

    const handleDetailsProperty = (property: Property) => {
        fetch(serverAddress + "/get-property-details", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + user?.token,
            },
            body: JSON.stringify({ id: property.id }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((responseJson) => {
                if (responseJson.isSuccess) {
                    setPropertyDetail(responseJson);
                } else if (!responseJson.isSuccess) {
                    console.error(responseJson);
                }
            })
            .then(() => {
                setIsPropertySelected(true);
                setModalVisible(true);
            })
            .catch((error) => {
                console.error("Error fetching data: " + error);
            });
    };

    const handleDetailsServiceRequest = (serviceRequest: ServiceRequest) => {
        setServiceRequestSelected(serviceRequest);
        setIsPropertySelected(false);
        setModalVisible(true);
    };

    const PropertyItem:React.FC<PropertyItemProps> = ({ item }) => (
        <View style={styles.row}>
            <FontAwesome6 name='house' size={24} color='black' />
            <Text style={styles.cell}>{item.streetAddress}</Text>
            <View style={styles.actions}>
                <ButtonPrimary title='Details' onPress={() => handleDetailsProperty(item)} />
            </View>
        </View>
    );

    const TicketItem:React.FC<ServiceRequestItemProps> = ({ item }) => (
        <View style={styles.row}>
            <Text style={styles.cell}>{item.detail}</Text>
            <View style={styles.actions}>
                <ButtonPrimary title='Details' onPress={() => handleDetailsServiceRequest(item)} />
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <ScrollView>
                <Text style={styles.header}>Properties</Text>
                <View style={styles.propertyContainer}>
                    {isLoading ? (
                        <Text>Loading Properties...</Text>
                    ) : (
                        properties?.map((item: Property) => (
                            <View key={item.id}>
                                <PropertyItem item={item} />
                            </View>
                        ))
                    )}
                </View>

                <Text style={styles.header}>Active Service Requests</Text>
                <View style={styles.propertyContainer}>
                    {isLoading ? (
                        <Text>Loading Active Service Requests...</Text>
                    ) : (
                        activeServiceRequests?.map((item: ServiceRequest) => (
                            <View key={item.id}>
                                <TicketItem item={item} />
                            </View>
                        ))
                    )}
                </View>

                <Text style={styles.header}>Completed Service Requests</Text>
                <View style={styles.propertyContainer}>
                    {isLoading ? (
                        <Text>Loading Completed Service Requests...</Text>
                    ) : (
                        completedServiceRequests?.map((item: ServiceRequest) => (
                            <View key={item.id}>
                                <TicketItem item={item} />
                            </View>
                        ))
                    )}
                </View>

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        setModalVisible(!modalVisible);
                    }}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <SectionList
                                sections={(isPropertySelected ? [
                                    {
                                        title: propertyDetail?.name,
                                        data: [
                                            "Address: " + propertyDetail?.streetAddress,
                                            "County: " + propertyDetail?.countyName,
                                            "City: " + propertyDetail?.cityName,
                                            "State: " + propertyDetail?.stateName,
                                            "Zip code: " + propertyDetail?.zipcode,
                                            "Rent: $" + propertyDetail?.rent,
                                            "Property type: " + propertyDetail?.propertyType,
                                        ]
                                    }
                                ] : [
                                    {
                                        title: serviceRequestSelected?.serviceType.parent.serviceType,
                                        data: [
                                            "Address: " + serviceRequestSelected?.property.streetAddress,
                                            "Status: " + serviceRequestSelected?.status,
                                            "Created on: " + serviceRequestSelected?.createdAt,
                                            "Timeline: " + serviceRequestSelected?.timeline.title,
                                            "Service: " + serviceRequestSelected?.serviceType.serviceType,
                                            "Detail: " + serviceRequestSelected?.detail,
                                        ]
                                    }
                                ])}
                                renderItem={({ item }) => <Text style={styles.sectionItem}>{item}</Text>}
                                renderSectionHeader={({ section }) => (
                                    <Text style={styles.sectionHeader}>{section.title}</Text>
                                )}
                            />
                            <ButtonSecondary
                                title='Close'
                                onPress={() => setModalVisible(!modalVisible)}>
                            </ButtonSecondary>
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        fontSize: SIZES.h1,
        fontWeight: 'bold',
        padding: 10,
    },
    propertyContainer: {
        padding: 10,
        margin: 10,
        backgroundColor: 'lightgray',
        borderStyle: 'solid',
        borderColor: 'black',
        borderCurve: 'circular',
        borderWidth: 1,
        borderRadius: 10,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
    },
    cell: {
        flex: 1,
        fontSize: SIZES.p,
        marginLeft: 10,
    },
    actions: {
        flexDirection: 'row',
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    sectionHeader: {
        fontSize: SIZES.h1,
        fontWeight: 'bold',
        marginBottom: 20
    },
    sectionItem: {
        fontSize: SIZES.p,
        marginBottom: 10
    }
});

export default PropertiesTable;
