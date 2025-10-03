import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Colors, Fonts, Spacing, GlobalStyles } from '../../styles/globalStyles';

const CustomButton = ({ 
  title, 
  onPress, 
  loading = false, 
  disabled = false,
  variant = 'primary' 
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        variant === 'secondary' && styles.buttonSecondary,
        disabled && styles.buttonDisabled
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      {loading ? (
        <ActivityIndicator color={Colors.text.light} />
      ) : (
        <Text style={styles.buttonText}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    ...GlobalStyles.button,
  },
  buttonSecondary: {
    backgroundColor: Colors.secondary,
  },
  buttonDisabled: {
    backgroundColor: Colors.text.secondary,
    opacity: 0.6,
  },
  buttonText: {
    ...GlobalStyles.buttonText,
  },
});

export default CustomButton;