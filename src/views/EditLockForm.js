import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, Switch } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from '@expo/vector-icons';
import lockViewModel from '../viewmodels/LockViewModel';

const EditLockForm = ({ route }) => {
  const { lock } = route.params;
  const [name, setName] = useState(lock.name);
  const [isActive, setIsActive] = useState(lock.isActive || false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  const handleUpdateLock = async () => {
    if (!name.trim()) {
      setError('El nombre de la cerradura no puede estar vacío');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await lockViewModel.updateLock(lock._id, { name, isActive });
      if (navigation.canGoBack()) {
        navigation.goBack();
      } else {
        setError('No se puede regresar a la pantalla anterior.');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteLock = async () => {
    Alert.alert(
      "Confirmación",
      "¿Estás seguro de que deseas eliminar esta cerradura?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Eliminar",
          onPress: async () => {
            setIsLoading(true);
            try {
              await lockViewModel.deleteLock(lock._id);
              if (navigation.canGoBack()) {
                navigation.goBack();
              } else {
                setError('No se puede regresar a la pantalla anterior.');
              }
            } catch (error) {
              setError(error.message);
            } finally {
              setIsLoading(false);
            }
          },
          style: "destructive"
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editando cerradura: {lock.name}</Text>
      <View style={styles.iconContainer}>
        <FontAwesome name={isActive ? "lock" : "unlock"} size={24} color="white" />
      </View>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Nombre de la cerradura"
        placeholderTextColor="#9c9c9c"
      />
      <View style={styles.switchContainer}>
        <Text style={styles.switchText}>{isActive ? "Activa" : "Inactiva"}</Text>
        <Switch
          value={isActive}
          onValueChange={setIsActive}
          thumbColor={isActive ? "#007aff" : "#f4f3f4"}
          trackColor={{ false: "#767577", true: "#81b0ff" }}
        />
      </View>
      {error && <Text style={styles.errorText}>Error: {error}</Text>}
      {isLoading ? (
        <Text style={styles.loadingText}>Cargando...</Text>
      ) : (
        <>
          <Button title="Guardar Cambios" onPress={handleUpdateLock} disabled={isLoading} />
          <View style={styles.space} />
          <Button title="Eliminar Cerradura" onPress={handleDeleteLock} color="red" disabled={isLoading} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c1c1e',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: "#2c2c2e",
    borderWidth: 1,
    backgroundColor: '#2c2c2e',
    borderRadius: 8,
    color: 'white',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  switchText: {
    color: 'white',
    marginRight: 8,
  },
  space: {
    height: 10,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  loadingText: {
    color: 'white',
  },
});

export default EditLockForm;