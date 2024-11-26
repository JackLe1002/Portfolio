import React, { useEffect, useState } from "react";
import { View, StyleSheet, SectionList, Modal, FlatList, TouchableOpacity, RefreshControl, ScrollView, ActivityIndicator } from "react-native";
import { NavigationProp, ParamListBase, useFocusEffect } from '@react-navigation/native';
import { FontAwesome6 } from '@expo/vector-icons';

import Text from '../../components/Text';
import ButtonPrimary from '../../components/ButtonPrimary';
import ButtonSecondary from '../../components/ButtonSecondary';
import { COLOURS, SIZES } from '../../components/Theme';
import { useAuthContext } from "../../hooks/useAuthContext";
import { ServiceRequestSP } from "../../../types";
import { config } from "../../../config";


const SERVER_URL = config.SERVER_URL;

type TicketItemProps = {
    item: ServiceRequestSP;
    onDetailClick: (id: string) => void;
    //onQuoteClick: (id: string) => void;
    onWithdrawClick: (id: string) => void;
};

type ServiceRequestsProps = {
    navigation: NavigationProp<ParamListBase>;
};

const ServiceRequests: React.FC<ServiceRequestsProps> = ({ navigation }) => {
    const { state } = useAuthContext();
    const { user } = state;

    const [isLoading, setIsLoading] = useState(false);
    const [tickets, setTickets] = useState<ServiceRequestSP[] | null>(null);
    const [ticketDetail, setTicketDetail] = useState<ServiceRequestSP | undefined>(undefined);
    const [modalVisible, setModalVisible] = useState<boolean>(false);


    const loadData = async () => {
        if (!user) return;
        setIsLoading(true);
        try {
            const response = await fetch(`${SERVER_URL}/sp-service-requests`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            });
            if (!response.ok) throw new Error("Network response was not ok");
            const data = await response.json();
            const updatedTickets = data.data.map((ticket: ServiceRequestSP) => ({
                ...ticket,
                serviceType: ticket.serviceType || "NULL"
            }));
            setTickets(updatedTickets);
        } catch (error) {
            console.error("Error fetching data: ", error);
        } finally {
            setIsLoading(false);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            loadData();
        }, [user])
    );

    // TODO: Implement handleTicketDetailClick, handleWithdrawClick, and handleQuoteClick
    const handleTicketDetailClick = (id: string) => {
        console.log('Detail Clicked', id);
        if (tickets != null) {
            const ticket = tickets.find((obj) => obj.id === id);
            setTicketDetail(ticket);
            setModalVisible(true);
        }
    };

    const handleWithdrawClick = (id: string) => {
        console.log('Withdraw Clicked', id);
        // Implement action
    };

    const handleQuoteClick = (id: string) => {
        console.log('Quote Clicked', id);
        // Implement action
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>New Tickets</Text>

            <ScrollView refreshControl={<RefreshControl refreshing={isLoading} onRefresh={loadData} />}>
                {isLoading ? (
                    <ActivityIndicator size="large" />
                ) : (
                    tickets?.filter(t => t.status === "initiated" || t.status === "submitted").map((item: ServiceRequestSP) => (
                        <View key={item.id}>
                            <TicketItem
                                item={item}
                                onDetailClick={() => handleTicketDetailClick(item.id)}
                                onWithdrawClick={() => handleWithdrawClick(item.id)}
                            />
                        </View>
                    ))
                )}
            </ScrollView>

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
                            sections={
                                [
                                    {
                                        title: ticketDetail?.serviceType.serviceType,
                                        data: [
                                            'Service Type: ' + ticketDetail?.serviceType.serviceType,
                                            'Property Name: ' + ticketDetail?.property.name,
                                            'Address: ' + ticketDetail?.property.streetAddress,
                                            'Request Date: ' + ticketDetail?.createdAt,
                                            'Request Timeline: ' + ticketDetail?.timeline.title,
                                            'Details: ' + ticketDetail?.serviceRequest.detail,
                                        ]
                                    }
                                ]
                            }
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
        </View>
    );
};

const TicketItem: React.FC<TicketItemProps> = ({ item, onDetailClick, onWithdrawClick }) => (
    <View style={styles.row}>
        <Text style={styles.cell}>{item.serviceType.serviceType}</Text>

        <View style={styles.actions}>
            <ButtonPrimary title={<FontAwesome6 name='magnifying-glass' color='white' />} onPress={() => {onDetailClick(item.id)}}></ButtonPrimary>
            {item.status === "requested" && (
                <ButtonPrimary title={<FontAwesome6 name='x' color='white' />} onPress={() => {onWithdrawClick(item.id)}}></ButtonPrimary>
            )}
        </View>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        padding: 10,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        marginHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#cccccc',
    },
    cell: {
        flex: 1,
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

export default ServiceRequests;
