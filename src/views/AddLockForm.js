import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import lockViewModel from '../viewmodels/LockViewModel';

const AddLockForm = () => {
    const [name, setName] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigation = useNavigation();

    // Flag to prevent multiple simultaneous submissions
    let isSubmitting = false;

    const handleAddLock = async () => {
        if (isSubmitting) return;
        isSubmitting = true;

        if (!name.trim()) {
            setError('El nombre de la chapa no puede estar vacío');
            isSubmitting = false;
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            await lockViewModel.addLock({ name });
            if (navigation.canGoBack()) {
                navigation.goBack();
            } else {
                setError('No se puede regresar a la pantalla anterior.');
            }
        } catch (error) {
            if (error.response) {
                setError(`Error: ${error.response.data.message}`);
            } else if (error.request) {
                setError('Error de red. Por favor intenta de nuevo más tarde.');
            } else {
                setError(`Error: ${error.message}`);
            }
        } finally {
            setIsLoading(false);
            isSubmitting = false;
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Nombre de la chapa"
                value={name}
                onChangeText={setName}
                style={styles.input}
            />
            {error && <Text style={{ color: 'red' }}>Error: {error}</Text>}
            {isLoading ? (
                <Text>Cargando...</Text>
            ) : (
                <Button title="Agregar Chapa" onPress={handleAddLock} disabled={isLoading} />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        padding: 8,
    },
});

export default AddLockForm;
