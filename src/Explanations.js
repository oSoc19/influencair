import React, { Component } from "react";
import SplitText from "react-pose-text";

const charPoses = {
  exit: { opacity: 0, y: 0 },
  enter: {
    opacity: 1,
    y: 0,
    delay: ({ charIndex }) => charIndex * 4
  }
};

class Explanations extends Component {
  constructor() {
    super();
    this.state = {
      text: "",
      isVisible: false
    };
  }

  componentWillReceiveProps(nextProps) {
    let { story } = nextProps;
    if (!story) return;

    if (story.story > 1) {
      this.setState({ text: story.text, isVisible: true });
    } else {
      this.setState({ text: "", isVisible: false });
    }
  }
  render() {
    return (
      <div className="explanations">
        {this.props.story.story === 2 &&
          this.state.text.split("\n").map(line => (
            <p>
              <SplitText initialPose="exit" pose="enter" charPoses={charPoses}>
                {line}
              </SplitText>
            </p>
          ))}
        {this.props.story.story === 3 && (
          <SplitText initialPose="exit" pose="enter" charPoses={charPoses}>
            {this.state.text}
          </SplitText>
        )}
      </div>
    );
  }
}

export default Explanations;
