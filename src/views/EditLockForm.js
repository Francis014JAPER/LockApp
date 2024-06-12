import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

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
      navigation.goBack();
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
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
        <Button title="Guardar Cambios" onPress={handleUpdateLock} />
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
});

export default EditLockForm;
