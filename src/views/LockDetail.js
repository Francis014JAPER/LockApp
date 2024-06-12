import React from 'react';
import { View, Text, Switch, Button } from 'react-native';
import lockViewModel from '../viewmodels/LockViewModel';

const LockDetail = ({ route, navigation }) => {
    const { lock } = route.params;

    const handleToggle = () => {
        if (lock && lock._id) {
            lockViewModel.updateLock(lock._id, { ...lock, isActive: !lock.isActive });
            navigation.goBack();
        }
    };

    const handleDelete = () => {
        if (lock && lock._id) {
            lockViewModel.deleteLock(lock._id);
            navigation.goBack();
        }
    };

    return (
        <View>
            <Text>{lock.name}</Text>
            <Switch value={lock.isActive} onValueChange={handleToggle} />
            <Button title="Delete" onPress={handleDelete} />
        </View>
    );
};

export default LockDetail;