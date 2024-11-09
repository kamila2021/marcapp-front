import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const ParentChildrenList = ({ route }) => {
  const { userId } = route.params;
  const [children, setChildren] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    // Llamada para obtener los hijos del apoderado usando el userId
    const fetchChildren = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/parents/${userId}/children`);
        setChildren(response.data);
      } catch (error) {
        console.error('Error al cargar los hijos:', error);
      }
    };
    fetchChildren();
  }, [userId]);

  const handleViewProfessors = (childId) => {
    // Navega a la lista de profesores asociados al hijo seleccionado
    navigation.navigate('ChildProfessorsList', { childId });
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>Hijos</Text>
      <FlatList
        data={children}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 15 }}>
            <Button title={item.name} onPress={() => handleViewProfessors(item.id)} />
          </View>
        )}
      />
    </View>
  );
};

export default ParentChildrenList;
