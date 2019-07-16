import React, { Component } from "react";
import * as d3 from "d3";
import "d3-force";

class FloatingParticles extends Component {
  constructor() {
    super();
    this.svgElement = React.createRef();
    this.compositionTypes = [
      "Elementary carbon",
      "Organic matter",
      "Sea salt",
      "Nitrate",
      "Ammonium",
      "Sulphate",
      "Soil dust",
      "Others"
    ];
    this.causes = [
      "Others",
      "Waste",
      "Product use",
      "Road transport",
      "Non-road transport",
      "Industrial",
      "Industrial energy use",
      "Energy production + distribution",
      "Commercial",
      "Agriculture"
    ];
    this.margin = { left: 60, top: 20, right: 20, bottom: 20 };
  }
  componentDidMount() {
    const { margin, compositionTypes, causes } = this;
    const width = this.props.width - margin.left - margin.right;
    const height = this.props.height - margin.top - margin.bottom;
    const particles = this.generateParticles(width, height);

    this.svg = d3
      .select(this.svgElement.current)
      .attr("width", this.props.width)
      .attr("height", this.props.height)
      .append("g")
      .attr("transform", "translate(" + [margin.left, margin.top] + ")");

    this.chargeForce = d3
      .forceManyBody()
      .strength(-2)
    this.forceCollide = d3
      .forceCollide()
      .strength(1)
      .radius(d => d.r)
      .iterations(2)
    this.xForce = d3
      .forceX(d => d.x)
      .strength(0);
    this.yForce = d3
      .forceY(d => d.y)
      .strength(0);

    this.simulation = d3
      .forceSimulation()
      .force("charge", this.chargeForce)
      .force("collide", this.forceCollide)
      .force("x", this.xForce)
      .force("y", this.yForce);

    this.node = this.svg
      .selectAll("circle")
      .data(particles)
      .enter()
      .append("circle")
      .attr("r", d => d.r)
      .attr("fill", this.compositionColor)
      .style("opacity", 0)

    this.compositionColor = d => {
      switch (d.compositionType) {
        case compositionTypes[0]:
          return "#52744D";
        case compositionTypes[1]:
          return "#AFCE6D";
        case compositionTypes[2]:
          return "#F2F0B5";
        case compositionTypes[3]:
          return "#D97C51";
        case compositionTypes[4]:
          return "#C12D4E";
        case compositionTypes[5]:
          return "#2d66c1";
        case compositionTypes[6]:
          return "#972dc1";
        case compositionTypes[7]:
          return "#c12d83";
        default:
          break;
      }
    }

    this.compositionTypeScale = d3
      .scalePoint()
      .range([margin.left * 3, width - margin.right * 4])
      .domain(this.compositionTypes)
      .padding(0.5);

    this.compositionTypesLabels = this.svg
      .selectAll("text.typeLabels")
      .data(this.compositionTypeScale.domain())
      .enter()
      .append("text")
      .attr("class", "typeLabels")
      .text(d => d)
      .attr("x", width / 2)
      .attr("y", margin.top * 2)
      .attr("text-anchor", "middle")
      .attr("fill", "transparent");

    this.xCompositionTypeForce = d3.forceX(d =>
      this.compositionTypeScale(d.compositionType)
    )
    this.yCompositionScale = d3.scaleLinear()
      .domain([0, height])
      .range([height - margin.bottom, margin.top * 4])

    this.causesScale = d3
      .scalePoint()
      .range([height - margin.bottom, margin.top * 4])
      .domain(causes)
      .padding(0.5);

    this.causesLabels = this.svg
      .selectAll("text.causesLabels")
      .data(this.causesScale.domain())
      .enter()
      .append("text")
      .attr("class", "causesLabels")
      .text(d => d)
      .attr("x", margin.left * 2)
      .attr("y", height - height / 2)
      .attr("text-anchor", "middle")
      .attr("fill", "transparent");


    this.yCausesForce = d3.forceY(d => this.causesScale(d.cause));

    this.simulation.nodes(particles).on("tick", () => {
      this.node.attr("cx", d => d.x).attr("cy", d => d.y);
    });
  }

  componentWillReceiveProps(nextProps) {
    const { story } = nextProps;
    const { isBackwardScroll } = this.props

    // this is when we go back to previous story
    if (story && story.story === 0 && isBackwardScroll) {
      this.node.transition().duration(100).ease(d3.easeLinear).style("opacity", 0)
    }

    // only run this part in story 1
    if (!story || story.story !== 1) return

    // Don't run anything if we still in the same chapter or subchapter
    if (story.chapter === this.props.story.chapter && story.subChapter === this.props.story.subChapter) return

    const width = this.props.width - this.margin.left - this.margin.right;
    const height = this.props.height - this.margin.top - this.margin.bottom;


    let xForce, yForce, centerForce

    if (story.chapter === 0) {
      xForce = d3.forceX(d => d.posX);
      yForce = d3.forceY(d => d.posY);
      centerForce = null

      this.compositionTypesLabels
        .transition()
        .attr("x", width / 2)
        .attr("fill", "transparent")

      this.node.transition().duration(200).ease(d3.easeLinear).style("opacity", 1).attr('fill', this.compositionColor)
    } else if (story.chapter === 1) {
      xForce = d3.forceX(d => {
        // step by step we go through the story 
        if (d.compositionTypeIndex > story.subChapter) {
          // Make sure all particles are on the right side of the sorting line
          if (d.posX < this.compositionTypeScale(this.compositionTypes[story.subChapter + 1])) {
            return this.compositionTypeScale(this.compositionTypes[story.subChapter + 1]) + (Math.random() * (width - this.compositionTypeScale(this.compositionTypes[story.subChapter + 1])))
          } else {
            return d.posX
          }
        } else {
          return this.compositionTypeScale(d.compositionType)
        }

      })
      yForce = d3.forceY(d => this.yCompositionScale(d.posY))
      centerForce = null
      this.node.attr('fill', d => {
        if (d.compositionTypeIndex === story.subChapter) {
          return this.compositionColor(d)
        } else {
          return '#bfbfbf'
        }
      })

      if (!isBackwardScroll) {
        this.compositionTypesLabels
          .transition()
          .attr("x", d => this.compositionTypeScale(d))
          .attr("fill", "#777")
          .style("font-weight", d => d === this.compositionTypes[story.subChapter] ? 'bold' : 'normal')
      } else {
        this.causesLabels
          .transition()
          .attr("y", height - height / 2)
          .attr("fill", "transparent");
      }
    } else if (story.chapter === 2) {
      yForce = this.yCausesForce
      xForce = this.xCompositionTypeForce
      centerForce = null
      if (!isBackwardScroll) {
        this.causesLabels
          .transition()
          .attr("y", d => this.causesScale(d))
          .attr("fill", "#777");
      } else {

      }

    }
    this.simulation
      .force("x", xForce)
      .force("y", yForce)
      .force("center", centerForce)
    this.simulation.alpha(1).restart();
  }

  generateRandomInteger(min, max) {
    return Math.floor(min + Math.random() * (max + 1 - min));
  }

  generateParticles(width, height) {
    const particles = [];
    for (let index = 0; index < 200; index++) {
      const compositionTypeIndex = Math.floor(Math.random() * this.compositionTypes.length)
      particles[index] = {
        x: Math.random() * width,
        y: Math.random() * height,
        compositionType: this.compositionTypes[
          compositionTypeIndex
        ],
        compositionTypeIndex,
        cause: this.causes[Math.floor(Math.random() * this.causes.length)],
        r: Math.floor(Math.random() * 3) * 5,
        posX: Math.random() * width,
        posY: Math.random() * height
      };
    }
    return particles;
  }

  render() {
    return (
      <div>
        <svg ref={this.svgElement} />
      </div>
    );
  }
}

export default FloatingParticles;
