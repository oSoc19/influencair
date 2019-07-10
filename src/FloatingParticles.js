import React, { Component } from "react";
import * as d3 from "d3";
import "d3-force";

class FloatingParticles extends Component {
  constructor() {
    super();
    this.state = {};
    this.svgElement = React.createRef();
  }

  componentDidMount() {
    this.drawParticles();
  }

  generateRandomInteger(min, max) {
    return Math.floor(min + Math.random() * (max + 1 - min));
  }

  drawParticles() {
    const compositionTypes = [
      "elementary carbon",
      "organic matter",
      "sea salt",
      "nitrate",
      "ammonium",
      "sulphate",
      "soil dust",
      "others"
    ];

    const particles = [];
    for (let index = 0; index < 200; index++) {
      particles[index] = {
        x: Math.floor(Math.random() * width),
        y: Math.floor(Math.random() * height),
        compositionType:
          compositionTypes[Math.floor(Math.random() * compositionTypes.length)],
        r: Math.floor(Math.random() * 3) * 5
      };
    }

    var margin = { left: 40, top: 20, right: 20, bottom: 20 },
      width = window.innerWidth - margin.left - margin.right,
      height = window.innerHeight - margin.top - margin.bottom;
    var svg = d3
      .select(this.svgElement.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + [margin.left, margin.top] + ")");

    var compositionTypeScale = d3
      .scalePoint()
      .range([margin.left, width - margin.right * 6])
      .domain(compositionTypes)
      .padding(0.5);

    var compositionTypesLabels = svg
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
    document.getElementById("compositionTypes").onclick = function() {
      if (!compostionTypeSplit) {
        simulation.force("x", xCompositionTypeForce);
        compositionTypesLabels
          .transition()
          .attr("x", d => compositionTypeScale(d))
          .attr("fill", "#777");
      } else {
        simulation.force("x", centerXForce);
        compositionTypesLabels
          .transition()
          .attr("x", width / 2)
          .attr("fill", "#fff");
      }
      compostionTypeSplit = !compostionTypeSplit;
      simulation.alpha(1).restart();
    };

    var chargeForce = d3.forceManyBody().strength(-20);
    var centerXForce = d3.forceX(width / 2);
    var centerYForce = d3.forceY(height / 2);
    var forceCollide = d3
      .forceCollide()
      .strength(1)
      .radius(d => d.r)
      .iterations(2);
    var simulation = d3
      .forceSimulation()
      .force("charge", chargeForce)
      .force("collide", forceCollide)
      .force("x", centerXForce)
      .force("y", centerYForce);

    var node = svg
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

    simulation.nodes(particles).on("tick", () => {
      node.attr("cx", d => d.x).attr("cy", d => d.y);
    });
  }

  render() {
    return (
      <div>
        <svg ref={this.svgElement} />
        <button id="compositionTypes" className="button">
          Composition Types
        </button>
      </div>
    );
  }
}

export default FloatingParticles;
