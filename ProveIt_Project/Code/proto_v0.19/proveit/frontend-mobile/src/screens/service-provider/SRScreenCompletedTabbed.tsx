import React, { useState } from "react";
import {ActivityIndicator, SectionList, ScrollView, Modal, StyleSheet, RefreshControl, View} from "react-native";
import {NavigationProp, ParamListBase, useFocusEffect} from '@react-navigation/native';
import { FontAwesome6 } from '@expo/vector-icons';

import Text from '../../components/Text';
import ButtonPrimary from '../../components/ButtonPrimary';
import ButtonSecondary from '../../components/ButtonSecondary';
import { COLOURS, SIZES } from '../../components/Theme';
import { useAuthContext } from "../../hooks/useAuthContext";
import {Job } from "../../../types";
import {config} from "../../../config";

const SERVER_URL = config.SERVER_URL;

type ServiceRequestsProps = {
    navigation: NavigationProp<ParamListBase>;
};

type JobItemProps = {
    item: Job;
    onDetailClick: (id: string) => void;
    //onQuoteClick: (id: string) => void;
    onWithdrawClick: (id: string) => void;
};

const ServiceRequests: React.FC<ServiceRequestsProps> = ({ navigation }) => {
    const { state } = useAuthContext();
    const { user } = state;

    const [isLoading, setIsLoading] = useState(false);

    const [completedJobs, setCompletedJobs] = useState<Job[]>([]);
    const [jobDetail, setJobDetail] = useState<Job | undefined>(undefined);
    const [modalVisible, setModalVisible] = useState<boolean>(false);

    const loadData = async () => {
        if (!user) return;
        setIsLoading(true);
        try {
            const response = await fetch(`${SERVER_URL}/completed-jobs`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            });
            if (!response.ok) throw new Error("Network response was not ok");
            const data = await response.json();
            if (data.data.jobs) setCompletedJobs(data.data.jobs);
            else setCompletedJobs([]);
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

    const onDetailClick = (id: string) => {
        const job = completedJobs.find((obj) => obj.id === id);
        setJobDetail(job);
        setModalVisible(true);
    };

    const onWithdrawClick = (id: string) => {
        console.log("withdraw", id);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Completed Jobs</Text>
            <ScrollView refreshControl={<RefreshControl refreshing={isLoading} onRefresh={loadData} />}>
                {isLoading ? (
                    <ActivityIndicator size="large" />
                ) : completedJobs.length > 0 ? (
                    completedJobs?.map((item: Job) => (
                        <View key={item.id}>
                            <JobItem
                                item={item}
                                onDetailClick={() => onDetailClick(item.id)}
                                onWithdrawClick={onWithdrawClick}
                            />
                        </View>
                    ))
                ) : (
                    <Text>You're not working on any service Request! Accept one to get started.</Text>
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
                                        title: jobDetail?.serviceType.serviceType,
                                        data: [
                                            'Address: ' + jobDetail?.property.streetAddress,
                                            'Initiator: ' + jobDetail?.initiator.firstName + ' ' + jobDetail?.initiator.lastName,
                                            'Request Timeline: ' + jobDetail?.timeline.title,
                                            'Price: $' + jobDetail?.proposal.quotePrice + ` (${jobDetail?.proposal.quoteType})`,
                                            'Details: ' + jobDetail?.proposal.detail,
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

const JobItem: React.FC<JobItemProps> = ({ item, onDetailClick, onWithdrawClick }) => (
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
        marginBottom: 20,
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
    button: {
        marginVertical: 5,
        backgroundColor: "#007bff",
        padding: 10,
        borderRadius: 5,
        alignItems: 'center'
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
