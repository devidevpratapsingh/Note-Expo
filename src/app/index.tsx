import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },

  headerCard: {
    padding: 20,
    borderRadius: 22,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  heading: {
    fontSize: 30,
    fontWeight: "bold",
  },

  subheading: {
    marginTop: 4,
    fontSize: 15,
  },

  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 18,
  },

  searchInput: {
    padding: 16,
    borderRadius: 18,
    fontSize: 16,
    marginBottom: 16,
  },

  editorContainer: {
    padding: 20,
    borderRadius: 22,
    marginBottom: 20,
  },

  notesContainer: {
    padding: 20,
    borderRadius: 22,
  },

  titleInput: {
    padding: 16,
    borderRadius: 16,
    fontSize: 16,
    marginBottom: 14,
  },

  bodyInput: {
    minHeight: 120,
    textAlignVertical: "top",
    padding: 16,
    borderRadius: 16,
    fontSize: 16,
    marginBottom: 18,
  },

  noteCard: {
    padding: 18,
    borderRadius: 18,
  },

  noteTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },

  noteContent: {
    marginTop: 8,
    lineHeight: 22,
  },

  noteDate: {
    marginTop: 12,
    fontWeight: "600",
  },

  noteActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
  },

  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
  },

  actionButtonText: {
    fontWeight: "bold",
    fontSize: 14,
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 10,
  },

  button: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
  },

  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

const themes = {
  light: {
    background: "#F5EFE6",
    card: "#FFF8F0",
    text: "#3E3A36",
    subtext: "#7A726B",
    accent: "#C8A27A",
    input: "#EFE4D6",
  },

  dark: {
    background: "#1E2A38",
    card: "#243447",
    text: "#F4F7FA",
    subtext: "#AAB6C4",
    accent: "#4F7CAC",
    input: "#31475E",
  },
};

type Note = {
  id: string;
  title: string;
  content: string;
  date: string;
};

const initialNotes: Note[] = [
  {
    id: "1",
    title: "React Native",
    content: "Learn FlatList and responsive layouts.",
    date: "13 May 2026",
  },
  {
    id: "2",
    title: "Assignment",
    content: "Complete notes app UI using Expo.",
    date: "12 May 2026",
  },
  {
    id: "3",
    title: "Dark Mode",
    content: "Implement useColorScheme properly.",
    date: "10 May 2026",
  },
  {
    id: "4",
    title: "JavaScript",
    content: "Understand hooks and component lifecycle.",
    date: "08 May 2026",
  },
];

function formatNoteDate(date: Date) {
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const ClassNotes = () => {
  const systemScheme = useColorScheme();

  const { width } = useWindowDimensions();

  const isTablet = width >= 768;

  const [manualDark, setManualDark] = useState<boolean | null>(null);

  const [search, setSearch] = useState("");

  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const isDark = manualDark !== null ? manualDark : systemScheme === "dark";

  const theme = isDark ? themes.dark : themes.light;

  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(search.toLowerCase()),
  );

  const resetEditor = () => {
    setTitle("");
    setBody("");
    setEditingId(null);
  };

  const handleSave = () => {
    Keyboard.dismiss();

    const trimmedTitle = title.trim();
    const trimmedBody = body.trim();

    if (!trimmedTitle && !trimmedBody) {
      Alert.alert(
        "Empty note",
        "Please enter a title or note text before saving.",
      );
      return;
    }

    if (editingId) {
      setNotes((prev) =>
        prev.map((note) =>
          note.id === editingId
            ? {
                ...note,
                title: trimmedTitle || "Untitled",
                content: trimmedBody,
              }
            : note,
        ),
      );
    } else {
      setNotes((prev) => [
        {
          id: String(Date.now()),
          title: trimmedTitle || "Untitled",
          content: trimmedBody,
          date: formatNoteDate(new Date()),
        },
        ...prev,
      ]);
    }

    resetEditor();
  };

  const handleBack = () => {
    Keyboard.dismiss();
    resetEditor();
  };

  const handleNotePress = (note: Note) => {
    setTitle(note.title);
    setBody(note.content);
    setEditingId(note.id);
  };

  const handleDelete = (id: string) => {
    Alert.alert("Delete note", "Are you sure you want to delete this note?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          setNotes((prev) => prev.filter((note) => note.id !== id));
          if (editingId === id) {
            resetEditor();
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <StatusBar style={isDark ? "light" : "dark"} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View style={[styles.headerCard, { backgroundColor: theme.card }]}>
          <View>
            <Text style={[styles.heading, { color: theme.text }]}>
              Class Notes
            </Text>

            <Text style={[styles.subheading, { color: theme.subtext }]}>
              Important Topics
            </Text>
          </View>

          <Switch
            value={isDark}
            onValueChange={setManualDark}
            trackColor={{
              false: "#d6c6b8",
              true: theme.accent,
            }}
            thumbColor="white"
          />
        </View>

        <TextInput
          placeholder="Search notes..."
          placeholderTextColor={theme.subtext}
          value={search}
          onChangeText={setSearch}
          style={[
            styles.searchInput,
            {
              backgroundColor: theme.input,
              color: theme.text,
            },
          ]}
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View
            style={[styles.editorContainer, { backgroundColor: theme.card }]}
          >
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              {editingId ? "Edit Note" : "Create Note"}
            </Text>

            <TextInput
              placeholder="Note title"
              placeholderTextColor={theme.subtext}
              value={title}
              onChangeText={setTitle}
              style={[
                styles.titleInput,
                {
                  backgroundColor: theme.input,
                  color: theme.text,
                },
              ]}
            />

            <TextInput
              placeholder="Write your note..."
              placeholderTextColor={theme.subtext}
              multiline
              value={body}
              onChangeText={setBody}
              style={[
                styles.bodyInput,
                {
                  backgroundColor: theme.input,
                  color: theme.text,
                },
              ]}
            />

            <View style={styles.buttonRow}>
              <TouchableOpacity
                activeOpacity={0.75}
                onPress={handleBack}
                style={[styles.button, { backgroundColor: "#8A817C" }]}
              >
                <Text style={styles.buttonText}>Back</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.75}
                onPress={handleSave}
                style={[styles.button, { backgroundColor: theme.accent }]}
              >
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>

        <View style={[styles.notesContainer, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Notes List
          </Text>

          <View style={{ gap: 14 }}>
            {filteredNotes.map((item) => (
              <Pressable
                key={item.id}
                onPress={() => handleNotePress(item)}
                style={[
                  styles.noteCard,
                  {
                    backgroundColor:
                      editingId === item.id ? theme.accent : theme.input,
                    width: isTablet ? width / 2.2 : "100%",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.noteTitle,
                    {
                      color: editingId === item.id ? "white" : theme.text,
                    },
                  ]}
                >
                  {item.title}
                </Text>

                <Text
                  style={[
                    styles.noteContent,
                    {
                      color:
                        editingId === item.id
                          ? "rgba(255,255,255,0.9)"
                          : theme.subtext,
                    },
                  ]}
                  numberOfLines={2}
                >
                  {item.content}
                </Text>

                <Text
                  style={[
                    styles.noteDate,
                    {
                      color: editingId === item.id ? "white" : theme.accent,
                    },
                  ]}
                >
                  {item.date}
                </Text>

                <View style={styles.noteActions}>
                  <TouchableOpacity
                    activeOpacity={0.75}
                    onPress={() => handleNotePress(item)}
                    style={[
                      styles.actionButton,
                      {
                        backgroundColor:
                          editingId === item.id ? "rgba(255,255,255,0.25)" : theme.accent,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.actionButtonText,
                        { color: "white" },
                      ]}
                    >
                      Update
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.75}
                    onPress={() => handleDelete(item.id)}
                    style={[
                      styles.actionButton,
                      {
                        backgroundColor:
                          editingId === item.id ? "rgba(255,255,255,0.25)" : "#C45C5C",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.actionButtonText,
                        { color: "white" },
                      ]}
                    >
                      Delete
                    </Text>
                  </TouchableOpacity>
                </View>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ClassNotes;
