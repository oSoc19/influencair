import React from "react";
import { ReactComponent as Logo } from "./resources/images/logo.svg";
import story from "./story.json";

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.initial = {
      isFirstStory: false,
      isSecondStory: false,
      isThirdStory: false
    };
    this.state = {
      ...this.initial
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.story.story === 1) {
      this.setState({ ...this.initial, isFirstStory: true });
    } else if (nextProps.story.story === 2) {
      this.setState({ ...this.initial, isSecondStory: true });
    } else if (nextProps.story.story === 3) {
      this.setState({ ...this.initial, isThirdStory: true });
    }
  }

  render() {
    return (
      <div className="sidebar">
        <Logo
          alt="logo"
          className="logo"
          onClick={() => this.props.changeStoryAndScroll(story[0])}
        />
        <div
          className={this.state.isFirstStory ? "active" : "sidebar-text"}
          onClick={() => this.props.changeStoryAndScroll(story[4])}
        >
          Particulate matter
        </div>
        <div
          className={this.state.isSecondStory ? "active" : "sidebar-text"}
          onClick={() => this.props.changeStoryAndScroll(story[22])}
        >
          Health
        </div>
        <div
          className={this.state.isThirdStory ? "active" : "sidebar-text"}
          onClick={() => this.props.changeStoryAndScroll(story[24])}
        >
          History
        </div>
      </div>
    );
  }
}

export default Sidebar;
