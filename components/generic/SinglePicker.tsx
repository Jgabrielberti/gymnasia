import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
} from "react-native";
import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";

type PickerItemProps = {
  label: string;
  value: string | number; 
};

type SinglePickerProps = {
  children: React.ReactNode; 
  selectedValue: string | number | null; 
  onValueChange: (value: string | number) => void; 
  placeholder: string;
  iconName?: keyof typeof Ionicons.glyphMap;
};

const Item = (_props: PickerItemProps) => null;

export function SinglePicker({
  children,
  selectedValue,
  onValueChange,
  placeholder,
  iconName = "barbell-outline",
}: SinglePickerProps) {
  const [visible, setVisible] = useState(false);

  const items = React.Children.toArray(children)
    .filter((child): child is React.ReactElement<PickerItemProps> => 
      React.isValidElement(child) && child.type === Item
    )
    .map((child) => ({
      label: child.props.label,
      value: child.props.value,
    }));

  const selectItem = (value: string | number) => {
    onValueChange(value);
    setVisible(false); 
  };

  const getButtonText = () => {
    if (selectedValue === null || selectedValue === undefined || selectedValue === "") {
      return placeholder;
    }
    const selectedItem = items.find((item) => item.value === selectedValue);
    return selectedItem ? selectedItem.label : placeholder;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={() => setVisible(true)}>
        {iconName && <Ionicons name={iconName} size={20} color={Colors.textColors.textMuted} />}
        <Text 
          style={[
            styles.buttonText, 
            (!selectedValue || selectedValue === "") && { color: Colors.textColors.textMuted }
          ]} 
          numberOfLines={1}
        >
          {getButtonText()}
        </Text>
        <Ionicons name="chevron-down-outline" size={18} color={Colors.textColors.textMuted} style={styles.arrowIcon} />
      </TouchableOpacity>

      <Modal
        transparent
        visible={visible}
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setVisible(false)}
        >
          <TouchableOpacity activeOpacity={1} style={styles.modalContent}>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>{placeholder}</Text>
              <TouchableOpacity onPress={() => setVisible(false)}>
                <Text style={styles.closeButton}>Cancelar</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={items}
              keyExtractor={(item) => String(item.value)}
              contentContainerStyle={{ paddingBottom: 16 }}
              renderItem={({ item }) => {
                const isSelected = item.value === selectedValue;
                return (
                  <TouchableOpacity
                    style={[styles.item, isSelected && styles.itemSelected]}
                    onPress={() => selectItem(item.value)}
                  >
                    <Text
                      style={[
                        styles.itemText,
                        isSelected && styles.itemTextSelected,
                      ]}
                    >
                      {item.label}
                    </Text>
                    {isSelected && (
                      <Ionicons name="checkmark-sharp" size={20} color={Colors.training.primary} />
                    )}
                  </TouchableOpacity>
                );
              }}
            />
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

SinglePicker.Item = Item;

const styles = StyleSheet.create({
  container: { 
    width: "100%",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 60,
    paddingHorizontal: 16,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.training.primary,
  },
  buttonText: { 
    flex: 1,
    color: Colors.textColors.text, 
    fontSize: 18,
    marginLeft: 12,
  },
  arrowIcon: {
    marginLeft: 8,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center", 
    alignItems: "center",
    padding: 24,
  },
  modalContent: {
    backgroundColor: Colors.background,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    width: "100%",
    maxHeight: "70%",
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.08)",
  },
  headerTitle: { 
    fontSize: 18, 
    fontWeight: "700", 
    color: Colors.textColors.text 
  },
  closeButton: { 
    color: Colors.textColors.textSecondary, 
    fontSize: 16,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16, 
    paddingHorizontal: 20, 
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.03)",
  },
  itemSelected: { 
    backgroundColor: "rgba(255, 255, 255, 0.03)",
  },
  itemText: { 
    fontSize: 16, 
    color: Colors.textColors.text,  
  },
  itemTextSelected: { 
    color: Colors.training.primary, 
    fontWeight: "700" 
  },
});