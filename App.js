import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, FlatList, Text, View, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'
import Header from './components/Header'
import TodoItem from './components/TodoItem'
import TaskModal from './components/TaskModal'
import { render } from 'react-dom';


export default class App extends React.Component {
  state = {
    todos: [{
      title: 'To do 앱 만들기',
      done: true,
    }, {
      title: '기차표 예약하기',
      done: false,
    }],
    showModal: false,
  }

  componentWillMount() {
    AsyncStorage.getItem('@todo:state').then((state) => {
      this.setState(JSON.parse(state))
    })
  }

  save = () => {
    AsyncStorage.setItem('@todo:state', JSON.stringify(this.state))
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Header 
          show={() => {
            this.setState({ showModal: true })          
          }}
        />
        <FlatList 
          data={this.state.todos}
          renderItem={({ item, index }) => {
            return (
              <TodoItem
                title={item.title}
                done={item.done}
                remove={() => {
                  this.setState({
                    todos: this.state.todos.filter((_, i) => i !== index)
                  }), this.save
                }}
                toggle={() => {
                  const newTodos = [...this.state.todos]
                  newTodos[index].done = !newTodos[index].done
                  this.setState({ todos: newTodos }), this.save
                }}
              />
            )
          }}
          keyExtractor={(_, index) => {
            return '${index}'
          }}
        />
        <TaskModal 
          isVisible={this.state.showModal}
          add={(title) => {
            this.setState({
              todos: this.state.todos.concat({
                title: title,
                done: false,
              }),
              showModal: false,
            }, this.save)
          }}
          hide={() => {
            this.setState({ showModal: false })
          }}
        />
        <StatusBar style="auto" />
      </SafeAreaView>
    );
  }
} 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
