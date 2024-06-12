import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LockList from './src/views/LockList';
import AddLockForm from './src/views/AddLockForm';
import EditLockForm from './src/views/EditLockForm';
import 'react-native-gesture-handler';



const Stack = createStackNavigator();

const App = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="LockList" component={LockList} options={{ title: 'Lista de Chapas' }} />
                <Stack.Screen name="AddLockForm" component={AddLockForm} options={{ title: 'Agregar Chapa' }} />
                <Stack.Screen name="EditLockForm" component={EditLockForm} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;
