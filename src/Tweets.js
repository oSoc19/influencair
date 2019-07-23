import React, { Component } from "react";
import { TwitterTweetEmbed } from "react-twitter-embed";

export default class Tweets extends Component {
  tweetIds = [
    "969864050292281345",
    "987610736791834625",
    "1101015818387771392",
    "1109355939575091200"
  ];

  componentWillMount() {
    this.firstClassname = "tweet-hide";
    this.secondClassname = "tweet-hide";
    this.thirdClassname = "tweet-hide";
    this.fourthClassname = "tweet-hide";
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.story.story === 3 && nextProps.story.chapter === 1) {
      if (nextProps.story.subChapter === 1) {
        this.firstClassname = "tweet-show";
        this.secondClassname = "tweet-right";
        this.thirdClassname = "tweet-right";
        this.fourthClassname = "tweet-right";
      } else if (nextProps.story.subChapter === 2) {
        this.firstClassname = "tweet-left";
        this.secondClassname = "tweet-show";
        this.thirdClassname = "tweet-right";
        this.fourthClassname = "tweet-right";
      } else if (nextProps.story.subChapter === 3) {
        this.firstClassname = "tweet-left";
        this.secondClassname = "tweet-left";
        this.thirdClassname = "tweet-show";
        this.fourthClassname = "tweet-right";
      } else if (nextProps.story.subChapter === 4) {
        this.firstClassname = "tweet-left";
        this.secondClassname = "tweet-left";
        this.thirdClassname = "tweet-left";
        this.fourthClassname = "tweet-show";
      }
    } else {
      this.firstClassname = "tweet-hide";
      this.secondClassname = "tweet-hide";
      this.thirdClassname = "tweet-hide";
      this.fourthClassname = "tweet-hide";
    }
  }

  render() {
    let { story } = this.props;
    return (
      <div className="tweet">
        <div className={this.firstClassname}>
          <TwitterTweetEmbed
            tweetId={this.tweetIds[0]}
            options={{ cards: "hidden" }}
          />
        </div>

        <div className={this.secondClassname}>
          <TwitterTweetEmbed
            tweetId={this.tweetIds[1]}
            options={{ cards: "hidden" }}
          />
        </div>
        <div className={this.thirdClassname}>
          <TwitterTweetEmbed
            tweetId={this.tweetIds[2]}
            options={{ cards: "hidden" }}
          />
        </div>
        <div className={this.fourthClassname}>
          <TwitterTweetEmbed
            tweetId={this.tweetIds[3]}
            options={{ cards: "hidden" }}
          />
        </div>
      </div>
    );
  }
}
