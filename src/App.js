import React, { Component } from "react";
import "./App.css";
import SideBar from "./Sidebar";
import FloatingParticles from "./FloatingParticles";
import story from "./story.json";

const scrollHeight = 10000;

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      currentStory: story[0],
      scroll: 0
    };
  }
  componentDidMount() {
    window.addEventListener("scroll", () => {
      this.setState({
        currentStory: story[Math.floor(window.scrollY / 100)],
        scroll: window.scrollY
      });
    });
  }
  render() {
    return (
      <div className="App" style={{ height: scrollHeight }}>
        <div className="GridContainer">
          <div className="Col1">
            <SideBar story={this.state.currentStory} />
          </div>
          <div className="Col2">
            {this.state.scroll}
            <FloatingParticles story={this.state.currentStory} />
          </div>
        </div>
      </div>
    );
  }
}
