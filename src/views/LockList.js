import React from 'react';
import { observer } from 'mobx-react';
import { FlatList, View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native'; 
import lockViewModel from '../viewmodels/LockViewModel';

const LockList = observer(({ navigation }) => (
    <View style={styles.container}>
        <FlatList
            data={lockViewModel.locks}
            keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
            renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleLockPress(item, navigation)}> 
                    <View style={styles.item}>
                        <Text>{item.name}</Text>
                    </View>
                </TouchableOpacity>
            )}
        />
        <Button
            title="Agregar Chapa"
            onPress={() => navigation.navigate('AddLockForm')}
        />
    </View>
));

const handleLockPress = (lock, navigation) => {
    navigation.navigate('EditLockForm', { lock });
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    item: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
});

export default LockList;
