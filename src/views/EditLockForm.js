import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import lockViewModel from '../viewmodels/LockViewModel';

const EditLockForm = ({ route }) => {
  const { lock } = route.params;
  const [name, setName] = useState(lock.name);
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
      await lockViewModel.updateLock(lock._id, { name });
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
      <Text>Editando cerradura: {lock.name}</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Nombre de la cerradura"
      />
      {error && <Text style={{ color: "red" }}>Error: {error}</Text>}
      {isLoading ? (
        <Text>Cargando...</Text>
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
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  space: {
    height: 10,
  },
});

export default EditLockForm;
