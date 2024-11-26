import React, { useEffect, useState } from "react";
import {Button, Modal, SectionList, StyleSheet, View} from "react-native";
import Text from '../../components/Text';
import {NavigationProp, ParamListBase, useFocusEffect} from '@react-navigation/native';
import { useAuthContext } from "../../hooks/useAuthContext";
import {Job } from "../../../types";
import {config} from "../../../config";
import JobList from "../../components/JobList";
import ButtonSecondary from "../../components/ButtonSecondary";
import {SIZES} from "../../components/Theme";

const SERVER_URL = config.SERVER_URL;

type ServiceRequestsProps = {
    navigation: NavigationProp<ParamListBase>;
};

const ServiceRequests: React.FC<ServiceRequestsProps> = ({ navigation }) => {
    const { state } = useAuthContext();
    const { user } = state;
    const [update, setUpdate] = useState<boolean>(false);


    const [activeJobs, setActiveJobs] = useState<Job[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const [showMessageModal, setShowMessageModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const handleShowMessageModal = (message: string) => {
        setModalMessage(message);
        setShowMessageModal(true);
    };

    const loadData = async () => {
        if (!user) return;
        setIsLoading(true);
        try {
            const response = await fetch(`${SERVER_URL}/active-jobs`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            });
            if (!response.ok) throw new Error("Network response was not ok");
            const data = await response.json();
            if(data.data.jobs) setActiveJobs(data.data.jobs);
            else setActiveJobs([]);
        } catch (error) {
            console.error("Error fetching data: ", error);
        } finally {
            setIsLoading(false);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            loadData();
        }, [user, update])
    );

    const handleActivateJob = (jobId: string) => {
        setIsLoading(true);
        if(!user) return;
        fetch(
            `${SERVER_URL}/activate-job?id=`+ jobId,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                }
            },
        ).then((response) => {
            setIsLoading(false);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            response.json().then((data) => {
                if(data.isSuccess) {
                    handleShowMessageModal("Job activated successfully")
                    setUpdate(!update);
                }

            }).catch((error) => {
                console.error("Error:", error);
            });
        });
    }

    const handleCompleteJob = (jobId: string) => {
        setIsLoading(true);
        if(!user) return;
        fetch(
            `${SERVER_URL}/complete-job?id=`+ jobId,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                }
            },
        ).then((response) => {
            setIsLoading(false);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            response.json().then((data) => {
                if(data.isSuccess) {
                    handleShowMessageModal("Job marked as completed!")
                    setUpdate(!update);
                }

            }).catch((error) => {
                console.error("Error:", error);
            });
        });
    }

    const ModalContent = (
        <Modal
            animationType="slide"
            transparent={true}
            visible={showMessageModal}
            onRequestClose={() => {
                setShowMessageModal(!showMessageModal);
            }}>
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text>{modalMessage}</Text>
                    <ButtonSecondary
                        title='Close'
                        onPress={() => setShowMessageModal(!showMessageModal)}>
                    </ButtonSecondary>
                </View>
            </View>
        </Modal>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Current Jobs</Text>
            <JobList
                jobs={activeJobs}
                activateJob={handleActivateJob}
                completeJob={handleCompleteJob}
                isLoading={isLoading}
            />
            {ModalContent}
        </View>
    );
};

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
        marginLeft: 4,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderWidth: 1,
        borderColor: '#007bff',
        borderRadius: 4,
    },
    withdrawButton: {
        // Needs style
    },
    statusActive: {
        // Needs style
    },
    statusWarning: {
        // Needs style
    },
    listContainer: {
        padding: 10,
        margin: 10,
        backgroundColor: 'lightgray',
        borderStyle: 'solid',
        borderColor: 'black',
        borderCurve: 'circular',
        borderWidth: 1,
        borderRadius: 10,
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
        borderColor: '#007bff',
        borderWidth: 2,
        padding: 30,
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
    },
});

export default ServiceRequests;
