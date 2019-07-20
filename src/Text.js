import React, { Component } from "react";
import * as d3 from "d3";
import { ReactComponent as Influencair } from "./resources/images/influencair.svg";

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
    const { story, chapter, subChapter } = this.props.story

    this.svg = d3
      .select(this.svgElement.current)
      .attr('width', this.props.width)
      .attr('height', this.props.height);

    this.groupText = this.svg
      .append('g')
      .attr('text-anchor', 'middle')
      .attr('font-family', 'sans-serif')
      .attr('fill', '#F15740')
      .attr('font-size', '45px');

    /* Brussels */
    this.brussels = this.groupText
      .append('text')
      .text('Brussels .')
      .attr('y', height / 6)
      .attr("x", this.width / 2)
      .attr('opacity', 0)
    this.brusselsBox = this.brussels
      .node()
      .getBBox()
    this.brusselsX = this.width / 2

    /* AirQuality */
    this.airQuality = this.groupText
      .append('text')
      .text(' Air quality ')
      .attr('opacity', 0)
      .attr('y', height / 6)
    this.airQualityBox = this.airQuality
      .node()
      .getBBox()
    this.airQualityX = this.width / 2 + this.brusselsBox.width + spacing
    this.airQuality
      .attr("x", this.airQualityX)

    /* Health */
    this.health = this.groupText
      .append('text')
      .text('. Health')
      .attr('opacity', 0)
      .attr('y', height / 6)
    this.healthBox = this.health
      .node()
      .getBBox()
    this.healthX = this.width / 2 + this.brusselsBox.width + this.airQualityBox.width
    this.health
      .attr('x', this.healthX)


    this.whatIs = this.groupText
      .append('text')
      .text('What is ')
      .attr('opacity', 0)
      .attr('y', height / 6)
    this.whatIsBox = this.whatIs
      .node()
      .getBBox()
    this.whatIs.attr('x', this.airQualityX - (this.airQualityBox.width / 2) - (this.whatIsBox.width / 2) - spacing)

    this.questionMark = this.groupText
      .append('text')
      .text('?')
      .attr('opacity', 0)
      .attr('y', height / 6)
    this.questionMarkBox = this.questionMark
      .node()
      .getBBox()
    this.questionMark.attr('x', this.airQualityX + (this.airQualityBox.width / 2) + spacing + (this.questionMarkBox.width / 2))

    this.question = this.groupText
      .append('text')
      .text('What about it?')
      .attr('x', this.airQualityX)
      .attr('y', (height / 6) + this.airQualityBox.height + spacing)
      .attr('opacity', 0)

    this.airComponents = this.groupText
      .append("text")
      .text("Air consists of gasses and particles.")
      .attr("opacity", 0)
      .attr('x', this.airQualityX)
      .attr('y', (height / 6) + this.airQualityBox.height + spacing)

    this.animateBrussels(this.props.story)
    this.animateHealth(this.props.story)
    this.animateAirQuality(this.props.story)
    this.animateQuestion(this.props.story)
  }
  animateBrussels(storyObj) {
    const { story, chapter, subChapter } = storyObj
    if (story === 0) {
      if (chapter === 0) {
        if (subChapter === 0) {
          this.brussels
            .attr('opacity', 1)
        } else if (subChapter === 1) {
          this.brussels
            .transition()
            .duration(400)
            .attr('transform', `translate(0,0)`)
            .attr('opacity', 1)
        } else if (subChapter === 2) {
          this.brussels
            .transition()
            .duration(400)
            .attr('transform', `translate(-${this.width},0)`)
            .attr('opacity', 0)
        } else {
          this.brussels
            .attr('transform', `translate(-${this.width},0)`)
            .attr('opacity', 0)
        }
      }
    } else {
      this.brussels
        .attr('transform', `translate(-${this.width},0)`)
        .attr('opacity', 0)
    }
  }
  animateHealth(storyObj) {
    const { story, chapter, subChapter } = storyObj
    if (story === 0) {
      if (chapter === 0) {
        if (subChapter === 0) {
          this.health
            .attr('opacity', 1)
        } else if (subChapter === 1) {
          this.health
            .transition()
            .duration(400)
            .delay(400)
            .attr('transform', 'translate(0)')
            .attr('opacity', 1)
        } else if (subChapter === 2) {
          this.health
            .transition()
            .duration(400)
            .delay(400)
            .attr('transform', `translate(${this.width})`)
            .attr('opacity', 0)
        } else if (subChapter > 2) {
          this.health
            .attr('transform', `translate(${this.width})`)
            .attr('opacity', 0)
        }
      }
    } else {
      this.health
        .attr('transform', `translate(${this.width})`)
        .attr('opacity', 0)
    }
  }
  animateAirQuality(storyObj) {
    const { story, chapter, subChapter } = storyObj
    if (story === 0) {
      if (chapter === 0) {
        if (subChapter === 0) {
          this.airQuality
            .attr('opacity', 1)
            .attr('transform', 'translate(0,0)')
        } else if (subChapter === 1) {
          this.questionMark
            .transition()
            .duration(500)
            .attr('opacity', 0)
            .attr('transform', `translate(${this.width},0)`)
          this.whatIs
            .transition()
            .duration(500)
            .attr('opacity', 0)
            .attr('transform', `translate(${this.width},0)`)
          this.airQuality
            .transition()
            .duration(200)
            .attr('opacity', 1)
            .attr('transform', 'translate(0,0)')
        } else if (subChapter === 2) {
          this.whatIs
            .transition()
            .duration(500)
            .delay(800)
            .attr('opacity', 1)
            .attr('transform', `translate(0,0)`)
          this.questionMark
            .transition()
            .duration(500)
            .delay(800)
            .attr('opacity', 1)
            .attr('transform', `translate(0,0)`)
          this.airQuality
            .transition()
            .duration(500)
            .delay(800)
            .attr('opacity', 1)
            .attr('transform', `translate(0,0)`)
        } else if (subChapter > 2) {
          this.questionMark
            .transition()
            .duration(500)
            .attr('opacity', 0)
            .attr('transform', `translate(${this.width},0)`)
          this.whatIs
            .transition()
            .duration(500)
            .attr('opacity', 0)
            .attr('transform', `translate(${this.width},0)`)
          this.airQuality
            .transition()
            .duration(500)
            .attr('opacity', 0)
            .attr('transform', `translate(${this.width},0)`)
        } else if (subChapter > 3) {
          this.questionMark
            .attr('opacity', 0)
            .attr('transform', `translate(${this.width},0)`)
          this.whatIs
            .attr('opacity', 0)
            .attr('transform', `translate(${this.width},0)`)
          this.airQuality
            .attr('opacity', 0)
            .attr('transform', `translate(${this.width},0)`)
        }
      }
    } else {
      this.questionMark
        .attr('opacity', 0)
        .attr('transform', `translate(${this.width},0)`)
      this.whatIs
        .attr('opacity', 0)
        .attr('transform', `translate(${this.width},0)`)
      this.airQuality
        .attr('opacity', 0)
        .attr('transform', `translate(${this.width},0)`)
    }
  }
  animateQuestion(storyObj) {
    const { story, chapter, subChapter } = storyObj
    if (story === 0) {
      if (chapter === 0) {
        if (subChapter === 0) {
          this.question
            .attr('opacity', 1)
        } else if (subChapter === 1) {
          this.question
            .transition()
            .duration(500)
            .delay(800)
            .attr('opacity', 1)
            .attr('transform', `translate(0,0)`)
        } else if (subChapter === 2) {
          this.question
            .transition()
            .delay(800)
            .duration(500)
            .attr('opacity', 0)
            .ease(d3.easeQuadOut)
            .attr('transform', `translate(0,${this.height})`)
        } else if (subChapter > 2) {
          this.question
            .attr('opacity', 0)
            .attr('transform', `translate(0,${this.height})`)
        }
      }
    } else {
      this.question
        .attr('opacity', 0)
        .attr('transform', `translate(0,${this.height})`)
    }
  }
  componentWillReceiveProps(nextProps) {
    if (!nextProps.story) return;
    const { story, chapter, subChapter } = nextProps.story

    if (story === this.props.story && subChapter === this.props.subChapter) return

    this.animateBrussels(nextProps.story)
    this.animateHealth(nextProps.story)
    this.animateAirQuality(nextProps.story)
    this.animateQuestion(nextProps.story)

    if (story === 0 && chapter === 0 && subChapter === 3) {
      d3.select(this.imgElement.current)
        .transition()
        .style("opacity", 1)
        .duration(500)
    } else if (story === 1 && subChapter === 0) {
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
        <Influencair
          alt="influencair"
          className="background_img"
          ref={this.imgElement}
        />
      </div>
    );
  }
}

export default Text;
