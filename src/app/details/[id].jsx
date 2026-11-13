import { router, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTodos } from "../../../hooks/useTodos";
import { useContext } from "react";
import { ThemeContext } from "@/context/ThemeContext";

export default function Details() {
  const { id } = useLocalSearchParams();
  const { todos, isLoading, error, retryLoad } = useTodos();
  const { theme } = useContext(ThemeContext);
  const styles = createStyles(theme);
  const todo = todos.find((t) => t.id === Number(id));

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {isLoading ? (
          <ActivityIndicator color={theme.primary} />
        ) : error ? (
          <View>
            <Text accessibilityRole="alert" style={styles.value}>{error}</Text>
            <Pressable accessibilityRole="button" onPress={retryLoad}>
              <Text style={styles.value}>Retry</Text>
            </Pressable>
          </View>
        ) : todo ? (
          <>
            <Text style={styles.label}>ID</Text>
            <Text style={styles.value}>{todo.id}</Text>

            <Text style={styles.label}>Title</Text>
            <Text style={styles.value}>{todo.title}</Text>

            <Text style={styles.label}>Status</Text>
            <Text style={styles.value}>
              {todo.completed ? "Completed" : "Pending"}
            </Text>
          </>
        ) : (
          <Text style={styles.value}>Todo not found</Text>
        )}
      </View>

      <Pressable style={styles.button} onPress={() => router.canGoBack() ? router.back() : router.replace("/")}>
        <Text style={styles.buttonText}>Back</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
    padding: 16,
  },
  content: {
    flex: 1,
  },
  label: {
    color: theme.mutedText,
    fontSize: 14,
    marginTop: 16,
  },
  value: {
    color: theme.text,
    fontSize: 20,
  },
  button: {
    backgroundColor: theme.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: theme.onPrimary,
    fontSize: 16,
    fontWeight: "bold",
  },
});
