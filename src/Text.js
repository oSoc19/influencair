import React, { Component } from "react";
import * as d3 from "d3";
import influencair from "./resources/images/influencair.svg";

import "d3-force";
import "./App.css";

class Text extends Component {
  svgElement = React.createRef();
  imgElement = React.createRef();
  margin = { left: 60, top: 20, right: 20, bottom: 20 };
  width = this.props.width - this.margin.left - this.margin.right;
  height = this.props.height - this.margin.top - this.margin.bottom;
  spacing = 10;

  componentDidMount() {
    const { width, height, spacing } = this;

    this.svg = d3
      .select(this.svgElement.current)
      .attr("width", this.props.width)
      .attr("height", this.props.height);

    this.groupText = this.svg
      .append("g")
      .attr(
        "transform",
        "translate(" + (2 * width) / 5 + ", " + height / 5 + ")"
      )
      .attr("text-anchor", "middle")
      .attr("font-family", "sans-serif")
      .attr("fill", "#F15740")
      .attr("font-size", "45px");

    this.brussels = this.groupText
      .append("text")
      .text("Brussels. ")
      .attr("x", 0);
    this.brusselsBox = this.brussels.node().getBBox();

    this.airQuality = this.groupText.append("text").text("Air quality. ");
    this.airQualityBox = this.airQuality.node().getBBox();
    this.airQuality.attr(
      "x",
      this.brusselsBox.width / 2 + this.airQualityBox.width / 2 + spacing
    );

    this.health = this.groupText.append("text").text("Health. ");
    this.healthBox = this.health.node().getBBox();
    this.health.attr(
      "x",
      this.brusselsBox.width / 2 +
      this.airQualityBox.width +
      this.healthBox.width / 2 +
      2 * spacing
    );

    this.whatIs = this.groupText
      .append("text")
      .text("What is  ")
      .style("opacity", 0);

    this.questionMark = this.groupText
      .append("text")
      .text("?")
      .style("opacity", 0);

    this.question = this.groupText
      .append("text")
      .text("What about it?")
      .attr(
        "x",
        (this.brusselsBox.width / 2 +
          this.airQualityBox.width +
          this.healthBox.width / 2) /
        2
      )
      .attr("y", this.brusselsBox.height);

    this.airComponents = this.groupText
      .append("text")
      .text("Air consists of gasses and particles.")
      .style("opacity", 0)
      .attr(
        "x",
        (this.brusselsBox.width / 2 +
          this.airQualityBox.width +
          this.healthBox.width / 2) /
          2
      );
  }

  componentWillReceiveProps(nextProps) {
    const { width, height, spacing } = this;
    const { story, isBackwardScroll } = nextProps;
    if (!story) return;

    if (story.story === this.props.story.story && story.subChapter === this.props.story.subChapter) return

    if (story.story === 0) {
      this.airComponents.style("opacity", 0);
      this.question.style("opacity", 1);
      if (story.subChapter === 1) {
        this.brussels
          .transition()
          .duration(400)
          .attr("transform", "translate(-" + width + ")")
          .style("opacity", 0)


        if (isBackwardScroll) {
          this.brussels
            .transition()
            .attr("transform", "translate(0)")
            .style("opacity", 1)
            .duration(400);
        }
      } else if (story.subChapter === 2) {
        this.brussels.style("opacity", 0);
        this.health
          .transition()
          .duration(1000)
          .attr("transform", "translate(" + width + ")")
          .style("opacity", 0);

        if (isBackwardScroll) {
          this.airQuality
            .transition()
            .duration(1000)
            .attr("transform", "translate(0,0)")
            .attr(
              "x",
              this.brusselsBox.width / 2 +
              this.airQualityBox.width / 2 +
              spacing
            )
            .on("end", function () {
              d3.select(this).text("Air quality.");
            });

          this.questionMark
            .transition()
            .duration(1500)
            .style("opacity", 0)
            .attr("transform", "translate(" + width + ")");

          this.whatIs
            .transition()
            .duration(1500)
            .style("opacity", 0)
            .attr("transform", "translate(" + width + ")");

          this.question
            .transition()
            .duration(1000)
            .attr("transform", "translate(0,0)")
            .attr(
              "x",
              (this.brusselsBox.width / 2 +
                this.airQualityBox.width +
                this.healthBox.width / 2) /
              2
            )
            .attr("y", this.brusselsBox.height)
            .on("end", function () {
              d3.select(this).text("What about it?");
            });

          this.health
            .transition()
            .duration(1000)
            .attr(
              "transform",
              "translate(" +
              this.brusselsBox.width / 2 +
              this.airQualityBox.width +
              this.healthBox.width / 2 +
              ")"
            )
            .style("opacity", 1);
        }
      } else if (story.subChapter === 3) {
        this.brussels.style("opacity", 0);
        this.health.style("opacity", 0);
        this.airComponents.style("opacity", 0);
        this.whatIs
          .transition()
          .duration(1000)
          .attr("x", 0)
          .style("opacity", 1)
          .attr("transform", "translate(" + width / 14 + ")");
        const WhatIsBox = this.whatIs.node().getBBox();

        this.airQuality
          .transition()
          .duration(1000)
          .attr("x", 0)
          .attr(
            "transform",
            "translate(" + (width / 14 + WhatIsBox.width + 4 * spacing) + ")"
          )
          .on("end", function () {
            d3.select(this).text("Air quality");
          });

        this.questionMark
          .transition()
          .duration(1000)
          .attr("x", 0)
          .style("opacity", 1)
          .attr(
            "transform",
            "translate(" +
            (this.airQualityBox.width + WhatIsBox.width + 3 * spacing) +
            ")"
          );

        this.question
          .transition()
          .duration(1000)
          .attr("transform", "translate(0, " + height + ")");

        if (isBackwardScroll) {
          d3.select(this.imgElement.current).style("opacity", 1);
          this.airQuality.style("opacity", 1);
        }
      }
<<<<<<< HEAD
    } else if (story.story === 1) {
      if (story.chapter === 0) {
        this.svg.style("opacity", 1);
        this.airComponents
          .transition()
          .duration(1000)
          .style("opacity", 1);
      } else {
        this.svg.style("opacity", 0);
      }

      this.brussels.style("opacity", 0);
      this.health.style("opacity", 0);
      this.question.style("opacity", 0);
=======
    } else if (story.story === 1 && story.subChapter === 0) {
>>>>>>> f655509fccb38a4e2e2089c60a507b40a76121a5
      this.questionMark
        .transition()
        .attr("transform", "translate(0, -" + height + ")")
        .style("opacity", 0)
        .duration(500);

      this.whatIs
        .transition()
        .attr("transform", "translate(0, -" + height + ")")
        .style("opacity", 0)
        .duration(500);

      this.airQuality
        .transition()
        .attr("transform", "translate(0, -" + height + ")")
        .style("opacity", 0)
        .duration(500)
        .on('start', () => { this.props.blockScroll(true) })
        .on('end', () => { this.props.blockScroll(false) })


      d3.select(this.imgElement.current)
        .transition()
        .style("opacity", 0)
        .duration(500)

    }
  }

  render() {
    return (
      <div>
        <svg className="top" ref={this.svgElement} />
        <img
          alt='something'
          className="background_img"
          ref={this.imgElement}
          src={influencair}
        />
      </div>
    );
  }
}

export default Text;
