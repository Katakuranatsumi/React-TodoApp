import { SearchBar } from 'react-native-elements'
import React from 'react';
import { Platform, StatusBar, StyleSheet, View, Text, ScrollView,
   FlatList, TextInput, Button, KeyboardAvoidingView, AsyncStorage, TouchableOpacity, } from 'react-native';
import { AppLoading, Asset, Font, Icon } from 'expo';
import AppNavigator from './navigation/AppNavigator';
import { gray } from 'ansi-colors';

// 高さの判断をして値を設定
const STATUSBAR_HEIGHT = Platform.OS == 'ios' ? 20 : StatusBar.currentHeight;
// TODOを保持するKey/Valueのストアのキーを定義
const TODO = "@todoapp.todo"

// TODOアイテムのFunctionalComponent
const TodoItem = (props) => {
  let textStyle = styles.todoItem
  if (props.done === true) {
    textStyle = styles.todoItemDone
  }
  return (
    <TouchableOpacity onPress={props.onTapTodoItem}>
      <Text style={textStyle}>{props.title}</Text>   
    </TouchableOpacity>
  )
}

export default class App extends React.Component {

  // コンストラクタを定義
  constructor(props) {
    super(props)
  //  stateを初期化
　  this.state = {
    todo: [],
    currentIndex: 0,
    inputText: "",
    filterText: "",
 }
}
　// コンポーネントがマウントされた段階で読み込みを行う
componentDidMount() {
  this.loadTodo()
}

// AsyncStorageからTODOを読み込む処理
loadTodo = async () => {
  try {
   const todoString = await AsyncStorage.getItem(TODO)
   if (todoString) {
    const todo = JSON.parse(todoString)
    const currentIndex = todo.length
    this.setState({todo: todo, currentIndex: currentIndex})
   }
  } catch (e) {
    console.log(e)
  }
}

// AsyncStorageへTODOを保存する
saveTodo = async (todo) => {
  try{
   const todoString = JSON.stringify(todo)
   await AsyncStorage.setItem(TODO, todoString)
  } catch (e) {
   console.log(e)
  }
}

// TODOリストへの追加処理
　onAddItem = () => {
    const title = this.state.inputText
    if (title == "") {
     return
    }
    const index = this.state.currentIndex + 1
    const newTodo = {index: index, title: title, done: false}
    const todo = [...this.state.todo, newTodo]
    this.setState({
      todo: todo,
      currentIndex: index,
      inputText: ""
    })
  // saveTodoを読んで保存する
　 this.saveTodo(todo)
  }

// TODOリストをタップした時の処理
  onTapTodoItem = (todoItem) => {
    const todo = this.state.todo
    const index = todo.indexOf(todoItem)
    todoItem.done = !todoItem.done
    todo[index] = todoItem
    this.setState({todo: todo})
    this.saveTodo(todo)
  }

  render() {
      // フィルター処理
      const filterText = this.state.filterText
      let todo = this.state.todo
      if (filterText !== "") {
        todo = todo.filter(t => t.title.includes(filterText))
      }
      // SearchBarのplatformを決定
      const platform = Platform.OS == 'ios' ? 'ios' : 'android'
      return (
       <KeyboardAvoidingView style={styles.container} behavior="padding">
        <SearchBar
         platform={platform}
         cancelButtonTitle="Cansel"
         onChangeText={(text) => this.setState({filterText: text})}
         onClear={() => this.setState({filterText: ""})}
         value={this.state.filterText}
         placeholder="Type filter text"
        />
         <ScrollView style={styles.todolist}><FlatList data={todo}
            extraData={this.state}
            renderItem={({item}) => <TodoItem
            title={item.title}
            done={item.done}
            onTapTodoItem={() => this.onTapTodoItem(item)}
            />
          }
            keyExtractor={(item, index) => "todo_" + item.index}
            /></ScrollView>
            <View style={styles.input}>
            <TextInput
             onChangeText={(text) => this.setState({inputText: text})}
             value={this.state.inputText}
             style={styles.inputText}
           />
           <Button 
             onPress={this.onAddItem}
             title="Add"
             color="#841584"
             style={styles.inputButton}
           />
           </View>
       </KeyboardAvoidingView>
      );
    }
  }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: STATUSBAR_HEIGHT,
  },
// 　追加したUIのスタイル
  filter: {
    height: 30,
  },
  todolist: {
    flex: 1,
  },
  input: {
    height: 30,
    flexDirection: 'row', 
  },
  inputText: {
    flex: 1,
    backgroundColor: 'gray',
  },
  inputButton: {
   width: 100, 
  },
  // TODO表示用のスタイル
  todoItem: {
    fontSize: 20,
    backgroundColor: "white",
  },
  todoItemDone: {
    fontSize: 20,
    backgroundColor: "red",
  },
});
