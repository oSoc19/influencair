import React, { Component } from "react";
import "./App.css";
import SideBar from "./Sidebar";
import FloatingParticles from "./FloatingParticles";
import story from "./story.json";

const scrollHeight = 10000
const sideBarWidth = 300

const minSupportedHeight= 300
const minSupportedWidth= 1000

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      currentStory: story[0],
      scroll: 0,
      storyWidth: window.innerWidth - sideBarWidth
    };
  }
  componentDidMount() {
    window.addEventListener('scroll',() => {
      this.setState({
        currentStory: story[Math.floor(window.scrollY / (scrollHeight / story.length))],
        scroll: window.scrollY
      })
    })
    window.addEventListener('resize', () => {
      this.setState({
        storyWidth: window.innerWidth - sideBarWidth
      })
    })
  }
  render() {
    return (
      <div className="App" style={{ height: scrollHeight }}>
        {(window.innerWidth < minSupportedWidth || window.innerHeight < minSupportedHeight) 
          ?
            <div> We don\'t support this size</div>
          :
            <div className="GridContainer" style={{ gridTemplateColumns: `${sideBarWidth}px auto` }}>
              <div className="Col1">
                <SideBar story={this.state.currentStory} scroll={this.state.scroll} />
              </div>
              <div className="Col2">
                <FloatingParticles story={this.state.currentStory} width={this.state.storyWidth} />
              </div>
            </div>
        }
      </div>
    );
  }
}
