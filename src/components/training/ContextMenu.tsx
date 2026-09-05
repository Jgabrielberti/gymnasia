import React from "react";
import { Modal, View, Pressable, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/src/constants/theme";

export type ContextMenuItem = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  danger?: boolean;
  onPress: () => void;
};

type Props = {
  visible: boolean;
  x: number;
  y: number;
  onClose: () => void;
  items: ContextMenuItem[];
};

export function ContextMenu({ visible, x, y, onClose, items }: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose}>
        <View
          style={[
            styles.menu,
            {
              left: x,
              top: y,
            },
          ]}
        >
          {items.map((item, index) => (
            <React.Fragment key={item.label}>
              <Pressable
                style={styles.option}
                onPress={() => {
                  onClose();
                  item.onPress();
                }}
              >
                <Ionicons
                  name={item.icon}
                  size={18}
                  color={
                    item.danger
                      ? Colors.systemStateColors.danger
                      : Colors.textColors.text
                  }
                />

                <Text
                  style={[
                    styles.text,
                    item.danger && {
                      color: Colors.systemStateColors.danger,
                    },
                  ]}
                >
                  {item.label}
                </Text>
              </Pressable>

              {index !== items.length - 1 && <View style={styles.divider} />}
            </React.Fragment>
          ))}
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  menu: {
    position: "absolute",
    width: 170,
    backgroundColor: Colors.background,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    elevation: 18,
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 5,
    },
  },

  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },

  divider: {
    height: 1,
    marginHorizontal: 12,
    backgroundColor: "rgba(255,255,255,0.06)",
  },

  text: {
    fontSize: 16,
    color: Colors.textColors.text,
  },
});
