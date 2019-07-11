import React, { Component } from 'react'
import './App.css';
import SideBar from './Sidebar'
import story from './story.json'

const scrollHeight = 10000

export default class App extends Component {
  constructor() {
    super()
    this.state = {
      current_story: story[0],
      scroll: 0
    }
  }
  componentDidMount() {
    window.addEventListener('scroll', () => {
      this.setState({
        current_story: story[Math.floor(window.scrollY / 100)],
        scroll: window.scrollY
      })
    })
  }
  render() {
    return (
      <div className='App' style={{ height: scrollHeight }}>
        <div className='GridContainer'>
          <div className="Col1">
            <SideBar storie={this.state.current_story} />
          </div>
          <div className="Col2">
            {this.state.scroll}
          </div>
        </div>
      </div>)
  }
}
