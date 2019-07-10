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
    var margin = { left: 20, top: 20, right: 20, bottom: 20 },
      width = window.innerWidth,
      height = window.innerHeight;

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
        component:
          compositionTypes[Math.floor(Math.random() * compositionTypes.length)],
        r: Math.floor(Math.random() * 3) * 5
      };
    }

    var svg = d3
      .select(this.svgElement.current)
      .attr("width", width)
      .attr("height", height);

    var compositionTypeScale = d3
      .scalePoint()
      .range([margin.left, width - margin.right * 6])
      .domain(compositionTypes)
      .padding(0.5);

    var compositionTypeLabels = svg
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

    var xTypeForce = d3.forceX(d => {
      console.log(d.component);
      compositionTypeScale(d.composition);
    });
    let locationBtnClicked = false;
    document.getElementById("locations").onclick = function() {
      if (!locationBtnClicked) {
        simulation.force("x", xTypeForce);
        compositionTypeLabels
          .transition()
          .attr("x", d => compositionTypeScale(d))
          .attr("fill", "#777");
      } else {
        simulation.force("x", centerXForce);
        compositionTypeLabels
          .transition()
          .attr("x", width / 2)
          .attr("fill", "#fff");
      }
      locationBtnClicked = !locationBtnClicked;
      simulation.alpha(1).restart();
    };

    var chargeForce = d3.forceManyBody().strength(-5);
    var centerXForce = d3.forceX(width / 2);
    // var centerYForce = d3.forceY(height / 2);
    var forceCollide = d3
      .forceCollide()
      .strength(1)
      .radius(2)
      .iterations(2);
    var simulation = d3
      .forceSimulation()
      .force("charge", chargeForce)
      .force("collide", forceCollide);
    //   .force("x", centerXForce)
    //   .force("y", centerYForce);

    var node = svg
      .selectAll("circle")
      .data(particles)
      .enter()
      .append("circle")
      .attr("r", d => d.r)
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
      .attr("fill", d => {
        switch (d.component) {
          case 1:
            return "#52744D";
          case 2:
            return "#AFCE6D";
          case 3:
            return "#F2F0B5";
          case 4:
            return "#D97C51";
          case 5:
            return "#C12D4E";
          default:
            break;
        }
      });

    console.log(particles[0].x);

    simulation.nodes(particles).on("tick", () => {
      node.attr("cx", d => d.x).attr("cy", d => d.y);
    });
  }

  render() {
    return (
      <div>
        <svg ref={this.svgElement} />
        <button id="locations" className="button">
          Locations
        </button>
      </div>
    );
  }
}

export default FloatingParticles;
