import React, { Component } from "react";
import * as d3 from "d3";
import "d3-force";
import "./App.css";

class Text extends Component {
  svgElement = React.createRef();

  componentDidMount() {
    const margin = { left: 60, top: 20, right: 20, bottom: 20 };
    const width = this.props.width - margin.left - margin.right;
    const height = this.props.height - margin.top - margin.bottom;

    this.svg = d3
      .select(this.svgElement.current)
      .attr("width", this.props.width)
      .attr("height", this.props.height);

    let groupText = this.svg
      .append("g")
      .attr("transform", "translate(" + width / 2 + ", " + height / 2 + ")")
      .attr("text-anchor", "middle")
      .attr("font-family", "sans-serif")
      .attr("font-size", "40px");

    this.brussels = groupText
      .append("text")
      .text("Brussels. ")
      .attr("x", 0);
    let brusselsBox = this.brussels.node().getBBox();

    this.airQuality = groupText.append("text").text("Air Quality. ");
    this.airQualityBox = this.airQuality.node().getBBox();
    this.airQuality.attr(
      "x",
      brusselsBox.width / 2 + this.airQualityBox.width / 2
    );

    this.health = groupText.append("text").text("Health. ");
    let healthBox = this.health.node().getBBox();
    this.health.attr(
      "x",
      brusselsBox.width / 2 + this.airQualityBox.width + healthBox.width / 2
    );

    this.question = groupText
      .append("text")
      .text("What about it?")
      .attr(
        "x",
        (brusselsBox.width / 2 +
          this.airQualityBox.width +
          healthBox.width / 2) /
          2
      )
      .attr("y", brusselsBox.height);
  }

  componentWillReceiveProps(nextProps) {
    const { story } = nextProps;
    if (!story) return;

    const margin = { left: 60, top: 20, right: 20, bottom: 20 };
    const width = this.props.width - margin.left - margin.right;

    if (story.story === 0) {
      if (story.subChapter === 1) {
        this.brussels
          .transition()
          .attr("transform", "translate(-" + width + ")")
          .style("opacity", 0)
          .duration(1000);
      } else if (story.subChapter === 2) {
        this.health
          .transition()
          .duration(1000)
          .attr("transform", "translate(" + width + ")")
          .style("opacity", 0);
      } else if (story.subChapter === 3) {
        this.airQuality
          .transition()
          .duration(1000)
          .attr("transform", "translate(" + 170 + ")")
          .on("end", function() {
            d3.select(this).text("Air Quality?");
          });

        this.question
          .transition()
          .duration(1000)
          .attr("transform", "translate(0, -" + this.airQualityBox.height + ")")
          .on("end", function() {
            d3.select(this).text("What is ");
          });
      }
    } else if (story.story === 1) {
      this.svg
        .transition()
        .duration(1000)
        .style("opacity", 0)
        .on("end", function() {
          d3.select(this).text("Air consists of gasses and particles ");
        });
    }
  }

  render() {
    return (
      <div>
        <svg className="top" ref={this.svgElement} />
      </div>
    );
  }
}

export default Text;
