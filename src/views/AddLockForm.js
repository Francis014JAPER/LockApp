import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import lockViewModel from '../viewmodels/LockViewModel';

const AddLockForm = () => {
    const [name, setName] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigation = useNavigation();

    // Variable para prevenir envíos múltiples simultáneos
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
            <Text style={styles.title}>Agregar Nueva Chapa</Text>
            <TextInput
                placeholder="Nombre de la chapa"
                placeholderTextColor="#9c9c9c"
                value={name}
                onChangeText={setName}
                style={styles.input}
            />
            {error && <Text style={styles.errorText}>{error}</Text>}
            {isLoading ? (
                <Text style={styles.loadingText}>Cargando...</Text>
            ) : (
                <TouchableOpacity style={styles.addButton} onPress={handleAddLock} disabled={isLoading}>
                    <Text style={styles.addButtonText}>Agregar Chapa</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#1c1c1e',
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        marginBottom: 16,
    },
    input: {
        height: 40,
        borderColor: '#2c2c2e',
        borderWidth: 1,
        backgroundColor: '#2c2c2e',
        borderRadius: 8,
        color: 'white',
        paddingHorizontal: 10,
        marginBottom: 12,
    },
    errorText: {
        color: 'red',
        marginBottom: 12,
        textAlign: 'center',
    },
    loadingText: {
        color: 'white',
        textAlign: 'center',
        marginBottom: 12,
    },
    addButton: {
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

export default AddLockForm;
