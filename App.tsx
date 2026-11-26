import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Task } from './types/Task';
import Row from './components/Row';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'TODO_TASKS';

export default function App() {
  const [input, setInput] = useState<string>("")
  const [tasks, setTasks] = useState<Task[]>([])

  
  useEffect(() => {
    (async () => {
      try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        if (json) setTasks(JSON.parse(json));
      } catch (e) {
     
      }
    })();
  }, []);

  useEffect(() => {
AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}, [tasks]);



  const addTask = () => {
    if (!input.trim()) return

    const id = tasks.length
    const task: Task = { id,text: input, completed: 0}
    setTasks([...tasks,task])
    setInput("")
    console.log("Adding new item")
  }

  const toggleTodo = (id: number) => {
  setTasks(tasks.map(task => {
  if (task.id === id) {
    return { ...task, completed: task.completed ? 0 : 1 };
  } else {
    return task;
  }
}));
}
 
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder='Add new task...'
          onSubmitEditing={addTask}
        />
        </View>
        <FlatList<Task>
          data={tasks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (<Row item={item} toggleTodo={toggleTodo}/>
)}

          
        />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'stretch',
    justifyContent: 'center',
  },
});
