import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const ChildProfessorsList = ({ route }) => {
  const { childId } = route.params;
  const [professors, setProfessors] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchProfessors = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/children/${childId}/professors`);
        setProfessors(response.data);
      } catch (error) {
        console.error('Error al cargar los profesores:', error);
      }
    };
    fetchProfessors();
  }, [childId]);

  const handleChatWithProfessor = (professorId) => {
    navigation.navigate('ChatWithProfessor', { childId, professorId });
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>Profesores</Text>
      <FlatList
        data={professors}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 15 }}>
            <Button title={item.name} onPress={() => handleChatWithProfessor(item.id)} />
          </View>
        )}
      />
    </View>
  );
};

export default ChildProfessorsList;
