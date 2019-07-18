import React, { Component } from "react";
import "./App.css";
import SideBar from "./Sidebar";
import FloatingParticles from "./FloatingParticles";
import Text from "./Text";
import story from "./story.json";
import influencair from "./influencair.svg";

const scrollHeight = 10000;
const sideBarWidth = 300;

const minSupportedHeight = 300;
const minSupportedWidth = 1000;

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      currentStory: story[0],
      scroll: 0,
      storyWidth: window.innerWidth - sideBarWidth,
      storyHeight: window.innerHeight,
      isBackwardScroll: false
    };
  }
  componentDidMount() {
    window.addEventListener("scroll", () => {
      this.setState({
        currentStory:
          story[Math.floor(window.scrollY / (scrollHeight / story.length))],
        scroll: window.scrollY,
        isBackwardScroll: window.scrollY < this.state.scroll
      });
    });
    window.addEventListener("resize", () => {
      this.setState({
        storyWidth: window.innerWidth - sideBarWidth,
        storyHeight: window.innerHeight
      });
    });
  }
  render() {
    return (
      <div className="App" style={{ height: scrollHeight }}>
        {window.innerWidth < minSupportedWidth ||
        window.innerHeight < minSupportedHeight ? (
          <div> We don\'t support this size</div>
        ) : (
          <div
            className="GridContainer"
            style={{ gridTemplateColumns: `${sideBarWidth}px auto` }}
          >
            <div className="Col1">
              <SideBar
                story={this.state.currentStory}
                scroll={this.state.scroll}
              />
            </div>
            <div className="Col2">
              <Text
                story={this.state.currentStory}
                width={this.state.storyWidth}
                height={this.state.storyHeight}
                isBackwardScroll={this.state.isBackwardScroll}
              />

              <FloatingParticles
                story={this.state.currentStory}
                width={this.state.storyWidth}
                height={this.state.storyHeight}
                isBackwardScroll={this.state.isBackwardScroll}
              />
            </div>
          </div>
        )}
      </div>
    );
  }
}
