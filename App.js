import React from 'react';
import { Platform, StatusBar, StyleSheet, View, Text, ScrollView, FlatList, TextInput, Button, KeyboardAvoidingView } from 'react-native';
import { AppLoading, Asset, Font, Icon } from 'expo';
import AppNavigator from './navigation/AppNavigator';
import { gray } from 'ansi-colors';

// 高さの判断をして値を設定
const STATUSBAR_HEIGHT = Platform.OS == 'ios' ? 20 : StatusBar.currentHeight;

export default class App extends React.Component {

  // コンストラクタを定義
  constructor(props) {
    super(props)
    //  stateを初期化
　  this.state = {
    todo: [],
    currentIndex: 0,
    inputText: "",
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
  }

  render() {
      return (
       <KeyboardAvoidingView style={styles.container} behavior="padding">
       <View>
         <Text>Filterがここに配置されます。</Text>
         </View>
         <ScrollView style={styles.todolist}><FlatList data={this.state.todo}
            renderItem={({item}) => <Text>{item.title}</Text>}
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
  }
});
