import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import COLORS from '../../constants/colors';

const TransbankHome = () => {
  const [selectedConcept, setSelectedConcept] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expirationDate: '',
    cvv: '',
  });

  const handleConceptChange = (concept: string) => {
    setSelectedConcept(concept);
    setAmount(concept === 'matricula' ? 50000 : 30000); // Montos simulados
  };

  const handleInputChange = (field: keyof typeof paymentDetails, value: string) => {
    setPaymentDetails({ ...paymentDetails, [field]: value });
  };

  const handlePayment = () => {
    Alert.alert(
      'Pago realizado',
      `Pago realizado exitosamente para ${
        selectedConcept === 'matricula' ? 'Matrícula' : 'Mensualidad'
      } por un monto de $${amount}.`
    );
    setSelectedConcept('');
    setAmount(0);
    setPaymentDetails({
      cardNumber: '',
      expirationDate: '',
      cvv: '',
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Plataforma de Pagos</Text>

      <View style={styles.paymentStep}>
        <Text style={styles.subtitle}>Seleccione el concepto de pago:</Text>
        <Picker
          selectedValue={selectedConcept}
          onValueChange={(itemValue) => handleConceptChange(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Seleccione..." value="" />
          <Picker.Item label="Matrícula" value="matricula" />
          <Picker.Item label="Mensualidad" value="mensualidad" />
        </Picker>
      </View>

      {selectedConcept !== '' && (
        <>
          <View style={styles.paymentStep}>
            <Text style={styles.subtitle}>Detalles del pago:</Text>
            <Text style={styles.detailText}>
              Concepto: {selectedConcept === 'matricula' ? 'Matrícula' : 'Mensualidad'}
            </Text>
            <Text style={styles.detailText}>Monto: ${amount}</Text>
          </View>

          <View style={styles.paymentStep}>
            <Text style={styles.subtitle}>Detalles de la tarjeta:</Text>
            <TextInput
              style={styles.input}
              placeholder="Número de Tarjeta"
              keyboardType="numeric"
              maxLength={16}
              value={paymentDetails.cardNumber}
              onChangeText={(text) => handleInputChange('cardNumber', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="MM/YY"
              maxLength={5}
              value={paymentDetails.expirationDate}
              onChangeText={(text) => handleInputChange('expirationDate', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="CVV"
              keyboardType="numeric"
              maxLength={3}
              value={paymentDetails.cvv}
              onChangeText={(text) => handleInputChange('cvv', text)}
            />
          </View>

          <TouchableOpacity
            style={[styles.payButton, !paymentDetails.cardNumber || !paymentDetails.expirationDate || !paymentDetails.cvv ? styles.disabledButton : {}]}
            onPress={handlePayment}
            disabled={
              !paymentDetails.cardNumber || !paymentDetails.expirationDate || !paymentDetails.cvv
            }
          >
            <Text style={styles.payButtonText}>Realizar Pago</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: COLORS.white,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 20,
  },
  paymentStep: {
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 5,
  },
  picker: {
    height: 50,
    borderWidth: 1,
    borderColor: COLORS.gray,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  payButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: COLORS.gray,
  },
  payButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TransbankHome;
