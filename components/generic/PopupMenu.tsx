import React, { useEffect, useRef, useState } from "react";
import {
  Modal,
  View,
  Pressable,
  Text,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/theme";

export type PopupMenuItem = {
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  danger?: boolean;
  disabled?: boolean;
  selected?: boolean;
  onPress: () => void;
};

type AnchorRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  anchorRef: React.RefObject<View | null>;
  items: PopupMenuItem[];
  menuWidth?: number;
};

const MENU_MARGIN = 8;

export function PopupMenu({ visible, onClose, anchorRef, items, menuWidth = 180 }: Props) {
  const [anchor, setAnchor] = useState<AnchorRect | null>(null);

  useEffect(() => {
    if (!visible || !anchorRef.current) return;

    anchorRef.current.measureInWindow((x, y, width, height) => {
      setAnchor({ x, y, width, height });
    });
  }, [visible]);

  if (!anchor) {
    return visible ? (
      <Modal visible transparent animationType="none">
        <View />
      </Modal>
    ) : null;
  }

  const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

  const wouldOverflowRight = anchor.x + menuWidth > screenWidth - MENU_MARGIN;
  const left = wouldOverflowRight
    ? anchor.x + anchor.width - menuWidth
    : anchor.x;

  const estimatedMenuHeight = items.length * 48 + 16;
  const wouldOverflowBottom =
    anchor.y + anchor.height + estimatedMenuHeight > screenHeight - MENU_MARGIN;
  const top = wouldOverflowBottom
    ? anchor.y - estimatedMenuHeight
    : anchor.y + anchor.height + 4;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose}>
        <View style={[styles.menu, { left, top, width: menuWidth }]}>
          {items.map((item, index) => (
            <React.Fragment key={item.label}>
              <Pressable
                style={[styles.option, item.disabled && styles.optionDisabled]}
                disabled={item.disabled}
                onPress={() => {
                  onClose();
                  item.onPress();
                }}
              >
                {item.icon && (
                  <Ionicons
                    name={item.icon}
                    size={18}
                    color={
                      item.disabled
                        ? Colors.textColors.textMuted
                        : item.danger
                        ? Colors.systemStateColors.danger
                        : Colors.textColors.text
                    }
                  />
                )}

                <Text
                  style={[
                    styles.text,
                    item.danger && !item.disabled && { color: Colors.systemStateColors.danger },
                    item.disabled && { color: Colors.textColors.textMuted },
                  ]}
                >
                  {item.label}
                </Text>

                {item.selected && (
                  <Ionicons
                    name="checkmark"
                    size={18}
                    color={Colors.training.primary}
                    style={styles.checkmark}
                  />
                )}
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
    backgroundColor: Colors.background,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    elevation: 18,
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  optionDisabled: {
    opacity: 0.6,
  },
  divider: {
    height: 1,
    marginHorizontal: 12,
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  text: {
    fontSize: 16,
    color: Colors.textColors.text,
    flex: 1,
  },
  checkmark: {
    marginLeft: 8,
  },
});