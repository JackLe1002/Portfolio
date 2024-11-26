import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Modal, SectionList, ScrollView } from "react-native";
import { useAuthContext } from '../../hooks/useAuthContext';
import { FontAwesome6 } from '@expo/vector-icons';

import Text from '../../components/Text';
import ButtonPrimary from '../../components/ButtonPrimary';
import ButtonSecondary from '../../components/ButtonSecondary';
import { SIZES } from '../../components/Theme';
import { config } from "../../../config";

const serverAddress = config.SERVER_URL;

interface Tenant {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
}

interface TenantProperty {
    property: string;
    tenant: Tenant;
}

type TenantItemProps = {
    item: TenantProperty;
};

function TenantsList() {
    const { state } = useAuthContext();
    const { user } = state;
    const [isLoading, setIsLoading] = useState(false);
    const [update, setUpdate] = useState(false);

    const [modalVisible, setModalVisible] = useState(false);
    const [tenantsData, setTenantsData] = useState<TenantProperty[]>([]);
    const [tenantDataSelected, setTenantDataSelected] = useState<TenantProperty | null>(null);

    useEffect(() => {
        setIsLoading(true);
        fetch(serverAddress + "/owner-tenants", {
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
                const formattedData: TenantProperty[] = [];
                for (const propertyName in data) {
                    data[propertyName].forEach((tenant: Tenant) => {
                        formattedData.push({ property: propertyName, tenant });
                    });
                }
                setTenantsData(formattedData);
            })
            .then(() => {
                setIsLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching data: " + error);
            });
    }, [user?.token, update]);

    const TenantItem:React.FC<TenantItemProps> = ({ item }) => (
        <View style={styles.row}>
            <FontAwesome6 name='user' size={24} color='black' />
            <Text style={styles.cell}>{`${item.tenant.firstName} ${item.tenant.lastName}`}</Text>
            <View style={styles.actions}>
                <ButtonPrimary title='Details' onPress={() => handleDetailsTenant(item)} />
            </View>
        </View>
    );

    const handleDetailsTenant = (item: TenantProperty) => {
        setTenantDataSelected(item);
        setModalVisible(true);
    }

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Tenants</Text>
            <View style={styles.propertyContainer}>
                {isLoading ? (
                    <Text>Loading Active Service Requests...</Text>
                ) : (
                    tenantsData?.map((item: TenantProperty) => (
                        <View key={item.tenant.id}>
                            <TenantItem item={item} />
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
                            sections={
                                [
                                    {
                                        title: tenantDataSelected?.property,
                                        data: [
                                            "First name: " + tenantDataSelected?.tenant.firstName,
                                            "Last name: " + tenantDataSelected?.tenant.lastName,
                                            "Email: \r" + tenantDataSelected?.tenant.email,
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
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
export default TenantsList;