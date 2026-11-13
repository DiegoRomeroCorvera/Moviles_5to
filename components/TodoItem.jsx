import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { StyleSheet, Text, View, Pressable } from "react-native";
import React, { useContext } from "react";
import { ThemeContext } from "@/context/ThemeContext";

const TodoItem = ({ item, onToggle, onRemove, onDetails, disabled = false }) => {
  const { theme } = useContext(ThemeContext);
  const styles = createStyles(theme);
  return (
    <View style={styles.itemRow}>
      <Text
        style={[styles.todoItem, item.completed && styles.completedText]}
        onPress={() => { if (!disabled) void onToggle(item.id); }}
      >
        {item.title}
      </Text>
      <Pressable onPress={() => onDetails(item.id)}>
        <MaterialCommunityIcons name="information" size={24} color={theme.primary} />
      </Pressable>
      <Pressable disabled={disabled} onPress={() => { void onRemove(item.id); }}>
        <MaterialCommunityIcons name="delete" size={24} color={theme.error} />
      </Pressable>
    </View>
  );
};

const createStyles = (theme) => StyleSheet.create({
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 4,
    padding: 10,
    borderBottomColor: theme.text,
    borderBottomWidth: 1,
    width: "100%",
    maxWidth: 1024,
    marginHorizontal: "auto",
  },
  todoItem: {
    color: theme.text,
    flex: 1,
    fontSize: 18,
  },
  completedText: {
    color: theme.mutedText,
    textDecorationLine: "line-through",
  },
});

export default TodoItem;
