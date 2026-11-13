import { useContext, useState } from "react";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, TextInput, View, FlatList, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TodoItem from "@/components/TodoItem";
import { useTodos } from "../../hooks/useTodos";
import { ThemeContext } from "@/context/ThemeContext";
import { Colors } from "@/constants/Colors";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export default function Index() {
  const [title, setTitle] = useState("");
  const { todos, addTodo, toggleTodo, removeTodo, isLoading, isSaving, error, canEdit, retryLoad } = useTodos();

  const { theme, colorScheme, setColorScheme } = useContext(ThemeContext) as {
    theme: typeof Colors.light;
    colorScheme: "light" | "dark" | null;
    setColorScheme: (scheme: "light" | "dark") => void;
  };
  const styles = createStyles(theme);

  const handleThemePress = () => {
    setColorScheme(colorScheme === "dark" ? "light" : "dark");
  };

  const handleAdd = async () => {
    if (await addTodo(title)) {
      setTitle("");
    }
  };

  const handlePress = (id: number) => {
    router.push({ pathname: "/details/[id]", params: { id } });
  };
 
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          editable={canEdit}
          style={styles.input}
          placeholder="Input text here"
          placeholderTextColor={theme.mutedText}
          selectionColor={theme.primary}
          keyboardAppearance={colorScheme ?? "light"}
          value={title}
          onChangeText={setTitle}
        />
        <Pressable style={[styles.button, !canEdit && { opacity: 0.5 }]} disabled={!canEdit} onPress={handleAdd}>
          {isSaving && <ActivityIndicator color={theme.onPrimary} />}
          <Text style={styles.buttonText}>{isSaving ? "Saving..." : "Add"}</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={colorScheme === "dark" ? "Cambiar a tema claro" : "Cambiar a tema oscuro"}
          style={styles.themeButton}
          onPress={handleThemePress}
        >
          <MaterialCommunityIcons
            name={colorScheme === "dark" ? "weather-night" : "weather-sunny"}
            size={24}
            color={theme.text}
          />
        </Pressable>
      </View>

      {isLoading && <><ActivityIndicator color={theme.primary} /><Text style={{ color: theme.text }}>Loading tasks...</Text></>}
      {error && <View><Text accessibilityRole="alert" style={{ color: theme.error }}>{error}</Text>
        {!canEdit && !isLoading && <Pressable accessibilityRole="button" onPress={retryLoad}><Text style={{ color: theme.text }}>Retry</Text></Pressable>}
      </View>}

      <FlatList
        data={todos}
        renderItem={({ item }) => (
          <TodoItem disabled={!canEdit} item={item} onToggle={toggleTodo} onRemove={removeTodo} onDetails={handlePress} />
        )}
        keyExtractor={todo => todo.id.toString()}
        contentContainerStyle={{ flexGrow: 1 }}
      />
    </SafeAreaView>
  );
}

function createStyles(theme: typeof Colors.light) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    inputContainer: {
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    input: {
      flex: 1,
      minWidth: 0,
      color: theme.text,
      borderWidth: 1,
      borderColor: theme.text,
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
    },
    button: {
      backgroundColor: theme.primary,
      padding: 12,
      borderRadius: 8,
      minHeight: 48,
      alignItems: "center",
      justifyContent: "center",
    },
    themeButton: {
      width: 48,
      height: 48,
      alignItems: "center",
      justifyContent: "center",
    },
    buttonText: {
      color: theme.onPrimary,
      fontSize: 16,
      fontWeight: "bold",
    },
  });
}
