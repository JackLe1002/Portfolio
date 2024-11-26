import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, FlatList, Modal, Button, ActivityIndicator } from "react-native";
import Text from "../components/Text";
import { Job } from "../../types";

interface SPJobTableProps {
    jobs: Job[];
    activateJob: (jobId: string) => void;
    completeJob: (jobId: string) => void;
    isLoading: boolean;
}

const SPJobTable: React.FC<SPJobTableProps> = ({ jobs, activateJob, completeJob, isLoading }) => {
    const [showJobDetail, setShowJobDetail] = useState<boolean>(false);
    const [jobDetail, setJobDetail] = useState<Job | undefined>(undefined);

    const handleJobDetailClick = (id: string) => {
        const job = jobs.find((obj) => obj.id === id);
        setJobDetail(job);
        setShowJobDetail(true);
    };

    const handleCloseJobDetail = () => {
        setJobDetail(undefined);
        setShowJobDetail(false);
    };

    const renderJobItem = ({ item }: { item: Job }) => (
        <View style={styles.row}>
            <Text style={styles.cell}>{item.initiator.firstName + " " + item.initiator.lastName}</Text>
            <Text style={styles.cell}>{item.serviceType.serviceType}</Text>
            <Text style={styles.cell}>{item.property.streetAddress}</Text>

            <View style={styles.cell}>
                <TouchableOpacity style={styles.button} onPress={() => handleJobDetailClick(item.id)} disabled={isLoading}>
                    <Text>Details</Text>
                </TouchableOpacity>
                {item.activityStatus === "pending" && (
                    <TouchableOpacity style={styles.button} onPress={() => activateJob(item.id)} disabled={isLoading}>
                        <Text>Start Job</Text>
                    </TouchableOpacity>
                )}
                {item.activityStatus === "started" && (
                    <TouchableOpacity style={styles.button} onPress={() => completeJob(item.id)} disabled={isLoading}>
                        <Text>Complete Job</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            {isLoading ? (
                <ActivityIndicator size="large" />
            ) : jobs.length > 0 ? (
                <FlatList
                    data={jobs}
                    renderItem={renderJobItem}
                    keyExtractor={(item) => item.id}
                />
            ) : (
                <Text>You're not working on any service Request! Accept one to get started.</Text>
            )}

            <Modal
                animationType="slide"
                transparent={true}
                visible={showJobDetail}
                onRequestClose={handleCloseJobDetail}
            >
                <View style={styles.modalView}>
                    <Text>Job Details</Text>
                    {jobDetail != null ? (
                        <>
                            <Text style={styles.modalText}>Activity Status: {jobDetail.activityStatus}</Text>
                            <Text style={styles.modalText}>Service Request: {jobDetail.serviceType.serviceType}</Text>
                            <Text style={styles.modalText}>Description: {jobDetail.proposal.detail}</Text>
                            <Text style={styles.modalText}>Address: {jobDetail.property.streetAddress}</Text>
                            <Text style={styles.modalText}>Quote Price: ${jobDetail.proposal.quotePrice} ({jobDetail.proposal.quoteType})</Text>
                            <Text style={styles.modalText}>Request Timeline: {jobDetail.timeline.title}</Text>
                        </>
                    ) : (
                        <Text>No details available.</Text>
                    )}
                    <Button title="Close" onPress={handleCloseJobDetail} />
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 20,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
    },
    cell: {
        margin: 5,
        flex: 1,
    },
    button: {
        marginVertical: 5,
        backgroundColor: "#007bff",
        padding: 10,
        borderRadius: 5,
    },
    modalView: {
        top: "20%",
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        borderColor: '#007bff',
        borderWidth: 2,
        padding: 30,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalText: {
        marginBottom: 10, 
        fontSize: 15
    },
});

export default SPJobTable;
