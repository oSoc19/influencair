import React, { Component } from "react";
import "./App.css";
import SideBar from "./Sidebar";
import FloatingParticles from "./FloatingParticles";
import Explanations from "./Explanations";
import { PMPlotComponent } from "./PMPlotComponent";
import Tweets from "./Tweets";
import Text from "./Text";
import story from "./story.json";

const scrollHeight = window.innerHeight * story.length;
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
      blockScroll: false,
      clearBox: new Map()
    };

    this.blockScroll = this.blockScroll.bind(this);
    this.changeStoryAndScroll = this.changeStoryAndScroll.bind(this);
    this.clearBoxHandler = this.clearBoxHandler.bind(this);
  }
  componentDidMount() {
    window.addEventListener("scroll", e => {
      if (this.state.blockScroll) {
        window.scrollTo(0, this.state.scroll);
        return;
      }
      const currentStory =
        story[Math.floor(window.scrollY / (scrollHeight / story.length))];
      const isBackwardScroll = window.scrollY < this.state.scroll;
      if (
        currentStory.story === this.state.currentStory.story &&
        currentStory.chapter === this.state.currentStory.chapter &&
        currentStory.subChapter === this.state.currentStory.subChapter
      )
        return;
      this.setState({
        currentStory,
        scroll: window.scrollY,
        isBackwardScroll
      });
    });
    if (window.scrollY === 0) {
      setTimeout(() => {
        window.scrollTo(0, window.innerHeight);
      }, 500);
    }
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
    });
  }

  changeStoryAndScroll(newStory) {
    let index = story.indexOf(newStory);
    let newScroll = index * (scrollHeight / story.length) + 10;
    window.scrollTo(0, newScroll);
    window.location.reload();
    this.setState({ currentStory: newStory, scroll: newScroll });
  }

  clearBoxHandler(e, id, box) {
    const clearBox = this.state.clearBox;
    // if (e === 'set') {
    //   clearBox.set(id, box)
    // } else if (e === 'delete' && clearBox.has('id')) {
    //   clearBox.delete(id)
    // } else {
    //   return
    // }
    this.setState({
      clearBox
    });
  }
  render() {
    return (
      <div className="App" style={{ height: scrollHeight }}>
        {window.innerWidth < minSupportedWidth ||
        window.innerHeight < minSupportedHeight ? (
          <div> We don't support this size</div>
        ) : (
          <div
            className="GridContainer"
            style={{ gridTemplateColumns: `${sideBarWidth}px auto` }}
          >
            <div className="Col1">
              <SideBar
                story={this.state.currentStory}
                scroll={this.state.scroll}
                changeStoryAndScroll={this.changeStoryAndScroll}
              />
            </div>
            <div className="Col2">
              <Text
                story={this.state.currentStory}
                width={this.state.storyWidth}
                height={this.state.storyHeight}
                isBackwardScroll={this.state.isBackwardScroll}
                blockScroll={this.blockScroll}
                clearBoxHandler={this.clearBoxHandler}
              />
              <FloatingParticles
                story={this.state.currentStory}
                width={this.state.storyWidth}
                height={this.state.storyHeight}
                isBackwardScroll={this.state.isBackwardScroll}
                blockScroll={this.blockScroll}
                clearBox={[...this.state.clearBox.values()]}
              />
              <Explanations story={this.state.currentStory} />
              <Tweets story={this.state.currentStory} />
              <PMPlotComponent story={this.state.currentStory} />
            </div>
          </div>
        )}
      </div>
    );
  }
}
