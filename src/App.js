import React, { Component } from "react";
import "./App.css";
import SideBar from "./Sidebar";
import FloatingParticles from "./FloatingParticles";
import Text from "./Text";
import story from "./story.json";

const scrollHeight = 15000;
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
      isBackwardScroll: false,
      blockScroll: false
    }

    this.blockScroll = this.blockScroll.bind(this)
  }
  componentDidMount() {
    window.addEventListener("scroll", (e) => {
      if (this.state.blockScroll) {
        window.scrollTo(0, this.state.scroll)
        return
      }
      this.setState({
        currentStory: story[Math.floor(window.scrollY / (scrollHeight / story.length))],
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
  blockScroll(blockScroll) {
    this.setState({
      blockScroll
    })
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
                  blockScroll={this.blockScroll}
                />

                <FloatingParticles
                  story={this.state.currentStory}
                  width={this.state.storyWidth}
                  height={this.state.storyHeight}
                  isBackwardScroll={this.state.isBackwardScroll}
                  blockScroll={this.blockScroll}
                />
              </div>
              )}
            </div>
          )
        }
      </div>
    )
  }
}
