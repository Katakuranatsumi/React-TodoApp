import React from 'react';
import { Platform, StatusBar, StyleSheet, View, Text, ScrollView,
   FlatList, KeyboardAvoidingView, AsyncStorage, TouchableOpacity, } from 'react-native';
import { AppLoading, Asset, Font } from 'expo';
import AppNavigator from './navigation/AppNavigator';
import { gray } from 'ansi-colors';
import { SearchBar, Input, Button, ListItem } from 'react-native-elements'
// ボタンのアイコンを Featherから利用する
import Icon from 'react-native-vector-icons/Feather'
// done IconがあるMaterialIconsを追加
import Icon2 from 'react-native-vector-icons/MaterialIcons'

// 高さの判断をして値を設定
const STATUSBAR_HEIGHT = Platform.OS == 'ios' ? 20 : StatusBar.currentHeight;
// TODOを保持するKey/Valueのストアのキーを定義
const TODO = "@todoapp.todo"

// TODOアイテムのFunctionalComponent
const TodoItem = (props) => {
  let icon = null
  if (props.done === true) {
    icon = <Icon2 name="done" />
  }
  return (
    <TouchableOpacity onPress={props.onTapTodoItem}>
      <ListItem 
      title={props.title}
      rightIcon={icon}
      bottomDivider
      />  
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
            <Input
             onChangeText={(text) => this.setState({inputText: text})}
             value={this.state.inputText}
             containerStyle={styles.inputText}
           />
           <Button 
            icon={
              <Icon
               name='plus'
               size={30}
               color='white'
              />
            }
            title=""
            onPress={this.onAddItem}
            buttonStyle={styles.inputButton}
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
    height: 50,
    flexDirection: 'row', 
    paddingRight: 10,
  },
  inputText: {
    flex: 1,
    backgroundColor: 'gray',
    paddingRight: 10,
    paddingLeft: 10,
  },
  inputButton: {
   width: 48,
   height: 48,
   borderWidth: 0,
   borderColor: 'transparent',
   borderRadius: 48,
   backgroundColor: '#ff6347', 
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
