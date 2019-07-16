import React, { Component } from "react";
import * as d3 from "d3";
import "d3-force";

const compositionTypes = [
  {
    name: 'Elementary carbon',
    amount: 4,
    color: '#OOOOOO'
  },
  {
    name: 'Organic matter',
    amount: 20,
    color: '#68ad0e'
  },
  {
    name: 'Sea salt',
    amount: 8,
    color: '#e3deba'
  },
  {
    name: 'Nitrate',
    amount: 21,
    color: '#e8cd1a'
  },
  {
    name: 'Ammonium',
    amount: 7,
    color: '#39e69e'
  },
  {
    name: 'Sulphate',
    amount: 12,
    color: '#1791e8'
  },
  {
    name: 'Soil dust',
    amount: 14,
    color: '#9e6b28'
  },
  {
    name: 'Others',
    amount: 14,
    color: '#de2170'
  },
]

for (let index = 0, prev = 0; index < compositionTypes.length; index++) {
  compositionTypes[index].barChart = {
    start: prev,
    mid: prev + (compositionTypes[index].amount / 2),
    end: prev + compositionTypes[index].amount
  }
  prev = prev + compositionTypes[index].amount
}


class FloatingParticles extends Component {
  constructor() {
    super();
    this.svgElement = React.createRef();
    this.compositionTypes = compositionTypes.map(a => a.name)

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
    const { margin, causes } = this;
    const width = this.props.width - margin.left - margin.right;
    const height = this.props.height - margin.top - margin.bottom;
    const particles = this.generateParticles(width, height);

    // Simulation forces
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

    // simulation
    this.simulation = d3
      .forceSimulation()
      .force("charge", this.chargeForce)
      .force("collide", this.forceCollide)
      .force("x", this.xForce)
      .force("y", this.yForce)

    this.svg = d3
      .select(this.svgElement.current)
      .attr("width", this.props.width)
      .attr("height", this.props.height)
      .append("g")
      .attr("transform", "translate(" + [margin.left, margin.top] + ")");

    this.node = this.svg
      .selectAll("circle")
      .data(particles)
      .enter()
      .append("circle")
      .attr("r", d => d.r)
      .attr("fill", d => d.compositionColor)
      .style("opacity", 0)

    // this.hair = this.svg
    //   .append("circle")
    //   .attr('r')

    this.compositionTypeScale = d3
      .scalePoint()
      .range([margin.left * 3, width - margin.right * 4])
      .domain(compositionTypes.map(a => a.name))
      .padding(0.5);

    this.barChartTypeScale = d3
      .scaleLinear()
      .domain([0, 100])
      .range([this.margin.left * 3, width - this.margin.right * 4])

    this.barchart = this.svg.append("g").attr('opacity', 0)
    for (let index = 0; index < compositionTypes.length; index++) {
      const pos = compositionTypes[index].barChart
      const composition = compositionTypes[index]
      this.barchart
        .append('rect')
        .attr('y', (height / 3) - 10)
        .attr('x', this.barChartTypeScale(pos.start))
        .attr('height', 20)
        .attr('width', this.barChartTypeScale(pos.end) - this.barChartTypeScale(pos.start))
        .attr('rx', '5px')
        .attr('fill', composition.color)

    }

    this.compositionTypesLabels = this.svg
      .selectAll("text.typeLabels")
      .data(this.compositionTypeScale.domain())
      .enter()
      .append("text")
      .attr("class", "typeLabels")
      .text(d => d)
      .attr("text-anchor", "middle")
      .attr("fill", "transparent")
      .attr('dominant-baseline', "central")
      .attr('transform', d => `translate(${this.compositionTypeScale(d)}, ${this.margin.top * 2}) rotate(0)`)


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
      this.node
        .attr("cx", d => isNaN(d.x) ? 0 : d.x)
        .attr("cy", d => isNaN(d.y) ? 0 : d.y);
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

    let xForce, yForce, forceCollide, chargeForce

    if (story.chapter === 0) {
      xForce = d3.forceX(d => d.posX)
      yForce = d3.forceY(d => d.posY)
      forceCollide = this.forceCollide
      chargeForce = this.chargeForce

      this.compositionTypesLabels
        .attr("text-anchor", "middle")
        .transition()
        .attr("fill", "transparent")

      this.node
        .transition()
        .duration(200)
        .ease(d3.easeLinear)
        .style("opacity", 1)
        .attr('fill', d => d.compositionColor)

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
      forceCollide = this.forceCollide
      chargeForce = this.chargeForce

      this.node.attr('fill', d => {
        if (d.compositionTypeIndex === story.subChapter) {
          return d.compositionColor
        } else {
          return '#bfbfbf'
        }
      }).attr("r", d => d.r)

      this.compositionTypesLabels
        .attr("text-anchor", "middle")
        .transition()
        .attr('transform', d => `translate(${this.compositionTypeScale(d)}, ${this.margin.top * 2}) rotate(0)`)
        .attr("fill", "#777")
        .style("font-weight", d => d === this.compositionTypes[story.subChapter] ? 'bold' : 'normal')

      if (!isBackwardScroll) {

      } else {
        this.causesLabels
          .transition()
          .attr("y", height - height / 2)
          .attr("fill", "transparent")

        this.barchart.transition().duration(100).ease(d3.easeLinear).attr("opacity", 0)
      }
    } else if (story.chapter === 2) {

      // Particle manipulation
      xForce = d3.forceX(d => {
        const barPos = compositionTypes[d.compositionTypeIndex].barChart
        const rawPosX = this.barChartTypeScale(this.generateRandomInteger(barPos.start, barPos.end))
        const minmaxedPosX = Math.min(Math.max(rawPosX, this.barChartTypeScale(barPos.start) + 10), this.barChartTypeScale(barPos.end) - 10)
        return minmaxedPosX
      })
      yForce = d3.forceY(d => height / 3)
      forceCollide = null
      chargeForce = null

      // Particle styling
      this.node
        .attr('fill', d => d.compositionColor)
        .transition().duration(300).ease(d3.easeLinear).attr("r", d => 10)

      // Bar chart Animation & Styling
      this.barchart.transition().delay(300).duration(500).ease(d3.easeLinear).attr("opacity", 1)

      // Label styling
      this.compositionTypesLabels
        .attr("text-anchor", "start")
        .transition()
        .style("font-weight", 'bold')
        .attr('transform', d => {
          const pos = compositionTypes.find(c => c.name === d).barChart
          console.log(pos)
          return `translate(${this.barChartTypeScale(pos.mid)}, ${(height / 3) - 30}) rotate(-45)`
        })


    } else if (story.chapter === 3) {
      yForce = this.yCausesForce
      xForce = this.xCompositionTypeForce
      forceCollide = this.forceCollide
      chargeForce = this.chargeForce

      this.node
        .attr('fill', d => d.compositionColor)
        .attr("r", d => d.r)

      this.barchart.transition().duration(300).ease(d3.easeLinear).attr("opacity", 0)

      this.compositionTypesLabels
        .attr("text-anchor", "middle")
        .transition()
        .attr('transform', d => `translate(${this.compositionTypeScale(d)}, ${this.margin.top * 2}) rotate(0)`)
        .attr("fill", "#777")
        .style("font-weight", 'normal')

      this.causesLabels
        .transition()
        .attr("y", d => this.causesScale(d))
        .attr("fill", "#777")

    } else if (story.chapter === 4) {
      yForce = d3.forceY(d => height / 2)
      xForce = d3.forceX(d => d.size === 2.5 ? (width / 2) + 12.5 : (width / 2))
      forceCollide = null
      chargeForce = null
    }
    this.simulation
      .force("x", xForce)
      .force("y", yForce)
      .force("charge", chargeForce)
      .force("collide", forceCollide)
    this.simulation.alpha(1).restart();
  }

  generateRandomInteger(min, max) {
    return Math.floor(min + Math.random() * (max + 1 - min));
  }

  generateRandomFloat(min, max) {
    return min + Math.random() * (max + 1 - min)
  }
  generateParticles(width, height) {
    const particles = [];
    for (let index = 0; index < 200; index++) {
      const x = Math.random() * width
      const y = Math.random() * height
      const size = Math.ceil(Math.random() * 2) === 1 ? 2.5 : 10
      particles[index] = {
        x,
        y,
        cause: this.causes[Math.floor(Math.random() * this.causes.length)],
        size,
        r: size === 2.5 ? this.generateRandomFloat(1, 2.5) : this.generateRandomFloat(2.5, 10),
        posX: x,
        posY: y
      };
    }

    // generate composition distribution
    for (let index = 0, type = 0, prev = 0; index < particles.length; index++) {
      const particle = particles[index]
      const composition = compositionTypes[type]
      particle.compositionType = composition.name
      particle.compositionTypeIndex = type
      particle.compositionColor = composition.color
      if (index === prev + ((particles.length / 100) * composition.amount)) {
        type++
        prev = index
      }
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
