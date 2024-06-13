import React from 'react';
import { observer } from 'mobx-react';
import { FlatList, View, Text, StyleSheet, TouchableOpacity } from 'react-native'; 
import { FontAwesome } from '@expo/vector-icons';
import lockViewModel from '../viewmodels/LockViewModel';

const LockList = observer(({ navigation }) => (
    <View style={styles.container}>
        <Text style={styles.title}>CERRADURAS</Text>
        <FlatList
            data={lockViewModel.locks}
            keyExtractor={(item) => item._id.toString()}
            renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleLockPress(item, navigation)} style={styles.itemContainer}>
                    <View style={styles.item}>
                        <FontAwesome 
                            name={item.isActive ? "lock" : "unlock"} 
                            size={24} 
                            color="white" 
                            style={styles.icon} 
                        />
                        <View style={styles.textContainer}>
                            <Text style={styles.itemTitle}>{item.name}</Text>
                        </View>
                        <FontAwesome name="arrow-right" size={24} color="white" />
                    </View>
                </TouchableOpacity>
            )}
        />
        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddLockForm')}>
            <Text style={styles.addButtonText}>Agregar Chapa</Text>
        </TouchableOpacity>
    </View>
));

const handleLockPress = (lock, navigation) => {
    navigation.navigate('EditLockForm', { lock });
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1c1c1e',
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        marginVertical: 16,
    },
    itemContainer: {
        marginBottom: 16,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#2c2c2e',
        borderRadius: 8,
    },
    icon: {
        marginRight: 16,
    },
    textContainer: {
        flex: 1,
    },
    itemTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
    itemDescription: {
        fontSize: 14,
        color: '#9c9c9c',
    },
    addButton: {
        marginTop: 16,
        padding: 16,
        backgroundColor: '#007aff',
        borderRadius: 8,
        alignItems: 'center',
    },
    addButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
    },
});

export default LockList;