import React, { Component } from "react";
import * as d3 from "d3";
import "d3-force";

class FloatingParticles extends Component {
  svgElement = React.createRef();
  compositionTypes = [
    "Elementary carbon",
    "Organic matter",
    "Sea salt",
    "Nitrate",
    "Ammonium",
    "Sulphate",
    "Soil dust",
    "Others"
  ];
  causes = [
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
  particles = this.generateParticles();
  margin = { left: 60, top: 20, right: 20, bottom: 20 };
  width = window.innerWidth - this.margin.left - this.margin.right;
  height = window.innerHeight - this.margin.top - this.margin.bottom;

  componentDidMount() {
    let { width, height, margin } = this;
    this.svg = d3
      .select(this.svgElement.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
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
      .data(this.particles)
      .enter()
      .append("circle")
      .attr("r", d => d.r)

      .attr("fill", d => {
        switch (d.compositionType) {
          case this.compositionTypes[0]:
            return "#52744D";
          case this.compositionTypes[1]:
            return "#AFCE6D";
          case this.compositionTypes[2]:
            return "#F2F0B5";
          case this.compositionTypes[3]:
            return "#D97C51";
          case this.compositionTypes[4]:
            return "#C12D4E";
          case this.compositionTypes[5]:
            return "#2d66c1";
          case this.compositionTypes[6]:
            return "#972dc1";
          case this.compositionTypes[7]:
            return "#c12d83";
          default:
            break;
        }
      });

    this.simulation.nodes(this.particles).on("tick", () => {
      node.attr("cx", d => d.x).attr("cy", d => d.y);
    });
  }

  componentWillReceiveProps(nextProps) {
    const { subchapter } = nextProps;
    let { width, height, margin } = this;

    if (subchapter === 1) {
      var compositionTypeScale = d3
        .scalePoint()
        .range([margin.left * 3, width - margin.right * 4])
        .domain(this.compositionTypes)
        .padding(0.5);

      var compositionTypesLabels = this.svg
        .selectAll("text.typeLabels")
        .data(compositionTypeScale.domain())
        .enter()
        .append("text")
        .attr("class", "typeLabels")
        .text(d => d)
        .attr("x", width / 2)
        .attr("y", margin.top * 3)
        .attr("text-anchor", "middle")
        .attr("fill", "#fff");

      var xCompositionTypeForce = d3.forceX(d =>
        compositionTypeScale(d.compositionType)
      );

      var compostionTypeSplit = false;
      if (!compostionTypeSplit) {
        this.simulation.force("center", null);
        this.simulation.force("x", xCompositionTypeForce);
        compositionTypesLabels
          .transition()
          .attr("x", d => compositionTypeScale(d))
          .attr("fill", "#777");
      } else {
        this.centerXForce = d3.forceX(width / 2);
        this.centerYForce = d3.forceY(height / 2);
        this.simulation
          .force("x", this.centerXForce)
          .force("y", this.centerYForce);
        compositionTypesLabels
          .transition()
          .attr("x", width / 2)
          .attr("fill", "#fff");
      }
      compostionTypeSplit = !compostionTypeSplit;
      this.simulation.alpha(1).restart();
    } else if (subchapter === 2) {
      var causesScale = d3
        .scalePoint()
        .range([height - margin.bottom, margin.top * 4])
        .domain(this.causes)
        .padding(0.5);

      var causesLabels = this.svg
        .selectAll("text.causesLabels")
        .data(causesScale.domain())
        .enter()
        .append("text")
        .attr("class", "causesLabels")
        .text(d => d)
        .attr("x", margin.left * 2)
        .attr("y", height - height / 2)
        .attr("text-anchor", "middle")
        .attr("fill", "#fff");

      var yCausesFOrce = d3.forceY(d => causesScale(d.cause));

      var causeSplit = false;
      if (!causeSplit) {
        this.simulation.force("center", null);
        this.centerYForce = d3.forceY(height / 2);
        this.simulation.force("y", yCausesFOrce);
        causesLabels
          .transition()
          .attr("y", d => causesScale(d))
          .attr("fill", "#777");
      } else {
        this.centerXForce = d3.forceX(width / 2);
        this.centerYForce = d3.forceY(height / 2);
        this.simulation
          .force("x", this.centerXForce)
          .force("y", this.centerYForce);
        causesLabels
          .transition()
          .attr("y", height - height / 2)
          .attr("fill", "#fff");
      }
      causeSplit = !causeSplit;
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
        x: Math.floor(Math.random() * this.width),
        y: Math.floor(Math.random() * this.height),
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
