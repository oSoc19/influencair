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
    const particles = this.generateParticles();

    this.svg = d3
      .select(this.svgElement.current)
      .attr("width", this.props.width)
      .attr("height", this.props.height)
      .append("g")
      .attr("transform", "translate(" + [margin.left, margin.top] + ")");

    this.chargeForce = d3.forceManyBody().strength(-2);
    this.centerXForce = d3.forceX(width / 2).strength(0);
    this.centerYForce = d3.forceY(height / 2).strength(0);
    this.forceCollide = d3
      .forceCollide()
      .strength(1)
      .radius(d => d.r)
      .iterations(2);
    this.simulation = d3
      .forceSimulation()
      .force("charge", this.chargeForce)
      .force("collide", this.forceCollide)
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("x", this.centerXForce)
      .force("y", this.centerYForce);

    var node = this.svg
      .selectAll("circle")
      .data(particles)
      .enter()
      .append("circle")
      .attr("r", d => d.r)

      .attr("fill", d => {
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
      });

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
      .attr("y", margin.top * 3)
      .attr("text-anchor", "middle")
      .attr("fill", "transparent");

    this.xCompositionTypeForce = d3.forceX(d =>
      this.compositionTypeScale(d.compositionType)
    );

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

    this.yCausesFOrce = d3.forceY(d => this.causesScale(d.cause));
    this.simulation.nodes(particles).on("tick", () => {
      node.attr("cx", d => d.x).attr("cy", d => d.y);
    });
  }

  componentWillReceiveProps(nextProps) {
    const { story } = nextProps;
    if (!story) return;

    const width = this.props.width - this.margin.left - this.margin.right;
    const height = this.props.height - this.margin.top - this.margin.bottom;
    const { isBackwardScroll } = this.props;

    if (story.subChapter === 1) {
      if (!isBackwardScroll) {
        this.simulation.force("center", null);
        this.simulation.force("x", this.xCompositionTypeForce);
        this.compositionTypesLabels
          .transition()
          .attr("x", d => this.compositionTypeScale(d))
          .attr("fill", "#777");
      } else {
        this.centerXForce = d3.forceX(width / 2);
        this.centerYForce = d3.forceY(height / 2);
        this.simulation
          .force("x", this.centerXForce)
          .force("y", this.centerYForce);
        this.compositionTypesLabels
          .transition()
          .attr("x", width / 2)
          .attr("fill", "transparent");
      }
      this.simulation.alpha(1).restart();
    } else if (story.subChapter === 2) {
      if (!isBackwardScroll) {
        this.simulation.force("center", null);
        this.centerYForce = d3.forceY(height / 2);
        this.simulation.force("y", this.yCausesFOrce);
        this.causesLabels
          .transition()
          .attr("y", d => this.causesScale(d))
          .attr("fill", "#777");
      } else {
        this.centerYForce = d3.forceY(height / 2);
        this.simulation.force("y", this.centerYForce);
        this.causesLabels
          .transition()
          .attr("y", height - height / 2)
          .attr("fill", "transparent");
      }
      this.simulation.alpha(1).restart();
    }
  }

  generateRandomInteger(min, max) {
    return Math.floor(min + Math.random() * (max + 1 - min));
  }

  generateParticles() {
    const particles = [];
    for (let index = 0; index < 200; index++) {
      particles[index] = {
        compositionType: this.compositionTypes[
          Math.floor(Math.random() * this.compositionTypes.length)
        ],
        cause: this.causes[Math.floor(Math.random() * this.causes.length)],
        r: Math.floor(Math.random() * 3) * 5
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
