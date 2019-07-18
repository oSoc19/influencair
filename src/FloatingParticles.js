import React, { Component } from "react";
import * as d3 from "d3";
import "d3-force";
import compositionTypes from './resources/data/particleComposition'
import causes from './resources/data/particleCause'

class FloatingParticles extends Component {
  constructor() {
    super();
    this.svgElement = React.createRef();
    this.compositionTypes = compositionTypes.map(a => a.name)
    this.causes = causes.map(a => a.name)
    this.margin = { left: 60, top: 20, right: 20, bottom: 20 };
  }
  componentDidMount() {
    const { margin, causes } = this;
    const width = this.props.width - margin.left - margin.right;
    const height = this.props.height - margin.top - margin.bottom;
    const particles = this.generateParticles(this.props.width, this.props.height);

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
      .forceX(d => d.posX)
      .strength(0);
    this.yForce = d3
      .forceY(d => d.posY)
      .strength(0);

    // simulation
    this.simulation = d3
      .forceSimulation()
      .force("charge", this.chargeForce)
      .force("collide", this.forceCollide)
      .force("x", this.xForce)
      .force("y", this.yForce)
    this.simulation.nodes(particles).on("tick", () => {
      this.node
        .attr("cx", d => isNaN(d.x) ? 0 : d.x)
        .attr("cy", d => isNaN(d.y) ? 0 : d.y);
    })

    // scalers
    this.yCompositionScale = d3
      .scaleLinear()
      .domain([height, 0])
      .range([margin.top * 4, height - margin.bottom])

    this.yCausesScale = d3
      .scalePoint()
      .domain(causes)
      .range([height - margin.bottom, margin.top * 4])
      .padding(0.5)

    this.xScaleForCauses = d3
      .scaleLinear()
      .domain([0, this.props.width])
      .range([margin.left * 5, width - margin.right * 4])

    this.yScaleForCauses = d3
      .scaleLinear()
      .domain([0, this.props.height])
      .range([margin.top * 4, height - margin.bottom])

    this.compositionTypeScale = d3
      .scalePoint()
      .range([margin.left * 3, width - margin.right * 4])
      .domain(compositionTypes.map(a => a.name))
      .padding(0.5);

    this.barChartTypeScale = d3
      .scaleLinear()
      .domain([0, 100])
      .range([margin.left * 3, width - margin.right * 4])

    // SVG
    this.svg = d3
      .select(this.svgElement.current)
      .attr("width", this.props.width)
      .attr("height", this.props.height)
      .append("g")
      .attr("transform", "translate(" + [margin.left, margin.top] + ")")


    this.node = this.svg
      .selectAll("circle")
      .data(particles)
      .enter()
      .append("circle")
      .attr("r", d => d.r)
      .attr("fill", d => d.compositionColor)
      .attr("opacity", 0)

    this.barchart = this.svg.append("g").attr('opacity', 0)
    for (let index = 0; index < compositionTypes.length; index++) {
      const composition = compositionTypes[index]
      const pos = composition.barChart

      this.barchart
        .append('rect')
        .attr('transform', d => `translate(${this.barChartTypeScale(pos.start)}, ${(height / 3) - 10})`)
        .attr('height', 20)
        .attr('width', this.barChartTypeScale(pos.end) - this.barChartTypeScale(pos.start))
        .attr('rx', '5px')
        .attr('fill', composition.color)
      this.barchart.append('text')
        .text(d => `${composition.amount}%`)
        .attr("text-anchor", "middle")
        .attr('transform', d => `translate(${this.barChartTypeScale(pos.mid)}, ${(height / 3) + 5})`)
        .attr('fill', d => this.invertColor(composition.color, true))
    }

    this.compositionTypesLabels = this.svg
      .selectAll("text.typeLabels")
      .data(this.compositionTypeScale.domain())
      .enter()
      .append("text")
      .attr("class", "typeLabels")
      .text(d => d)
      .attr("text-anchor", "middle")
      .attr("fill", "#777")
      .attr('opacity', 0)
      .attr('dominant-baseline', "central")
      .attr('transform', d => `translate(${this.compositionTypeScale(d)}, ${this.margin.top * 2}) rotate(0)`)


    this.xCompositionTypeForce = d3.forceX(d =>
      this.compositionTypeScale(d.compositionType)
    )

    this.causesLabels = this.svg
      .selectAll("text.causesLabels")
      .data(this.yCausesScale.domain())
      .enter()
      .append("text")
      .attr("class", "causesLabels")
      .text(d => d)
      .attr("x", margin.left * 2)
      .attr("y", height - height / 2)
      .attr("text-anchor", "middle")
      .attr("fill", "#777")
      .attr('opacity', 0)

    this.causesBars = this.svg
      .selectAll("bar.causesbar")
      .data(this.yCausesScale.domain())
      .enter()
      .append('rect')
      .attr('transform', d => `translate(${(margin.left * 5) - 10}, ${this.yCausesScale(d) - 10})`)
      .attr("fill", "#777")
      .attr('height', 20)
      .attr('width', 0)
      .attr('rx', '5px')
      .attr('opacity', 0)

    this.hair = this.svg
      .append('g')
      .attr('opacity', 0)
      .attr('transform', d => `translate(0, ${- height})`)

    this.hair.append("circle")
      .attr('r', 70)
      .attr('fill', '#34df23')
    this.hair.append('circle')
      .attr('r', 10)
      .attr('fill', '#34df23')
      .attr('transform', d => `translate(80, 0)`)
    this.hair.append('circle')
      .attr('r', 2.5)
      .attr('fill', '#34df23')
      .attr('transform', d => `translate(92.5, 0)`)

    this.hairMeasurements = this.hair
      .append('g')
      .attr('class', 'hairMeasurements')
      .attr('opacity', 0)

    this.hairMeasurements
      .append('line')
      .attr('x1', -70)
      .attr('x2', -70)
      .attr('y1', 0)
      .attr('y2', 90)
      .attr('stroke', 'black')
    this.hairMeasurements
      .append('line')
      .attr('x1', 70)
      .attr('x2', 70)
      .attr('y1', 0)
      .attr('y2', 90)
      .attr('stroke', 'black')
    this.hairMeasurements
      .append('line')
      .attr('x1', 90)
      .attr('x2', 90)
      .attr('y1', 0)
      .attr('y2', 30)
      .attr('stroke', 'black')
    this.hairMeasurements
      .append('line')
      .attr('x1', 95)
      .attr('x2', 95)
      .attr('y1', 0)
      .attr('y2', 22.5)
      .attr('stroke', 'black')
    this.hairMeasurements
      .append('text')
      .text('Human hair')
      .attr("text-anchor", "middle")
    this.hairMeasurements
      .append('text')
      .text('PM10')
      .attr("text-anchor", "middle")
      .attr('transform', 'translate(80,0) scale(0.14)')
    this.hairMeasurements
      .append('text')
      .text('PM25')
      .attr("text-anchor", "middle")
      .attr('transform', 'translate(92.5,0) scale(0.035)')

  }

  componentWillReceiveProps(nextProps) {
    const { story } = nextProps;
    const { isBackwardScroll } = this.props
    let useForce = true

    // this is when we go back to previous story
    if (story && story.story === 0 && isBackwardScroll) {
      this.node
        .transition()
        .duration(100)
        .ease(d3.easeLinear)
        .attr("opacity", 0)
    }

    // only run this part in story 1
    if (!story || story.story !== 1) return

    // Don't run anything if we still in the same chapter or subchapter
    if (story.chapter === this.props.story.chapter && story.subChapter === this.props.story.subChapter) return

    const width = this.props.width - this.margin.left - this.margin.right;
    const height = this.props.height - this.margin.top - this.margin.bottom;

    let xForce, yForce, forceCollide, chargeForce

    if (story.chapter === 0) {

      // Particle manipulation
      xForce = d3.forceX(d => d.posX)
      yForce = d3.forceY(d => d.posY)
      forceCollide = this.forceCollide
      chargeForce = this.chargeForce


      this.compositionTypesLabels
        .attr("text-anchor", "middle")
        .transition()
        .attr("opacity", 0)

      this.node
        .transition()
        .duration(200)
        .ease(d3.easeLinear)
        .attr("opacity", 1)
        .attr('fill', d => d.compositionColor)

    } else if (story.chapter === 1) {

      // Particle manipulation
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

      // Node styling
      this.node
        .transition()
        .attr('fill', d => {
          if (d.compositionTypeIndex === story.subChapter) {
            return d.compositionColor
          }
          return '#bfbfbf'
        })
        .attr("r", d => d.r)
        .attr('opacity', 1)


      this.compositionTypesLabels
        .attr("text-anchor", "middle")
        .transition()
        .attr('transform', d => `translate(${this.compositionTypeScale(d)}, ${this.margin.top * 2}) rotate(0)`)
        .attr("opacity", 1)
        .style("font-weight", d => d === this.compositionTypes[story.subChapter] ? 'bold' : 'normal')

      this.causesLabels
        .transition()
        .attr("y", height - height / 2)
        .attr("opacity", 0)

      // Bar chart Animation & Styling
      this.barchart
        .transition()
        .duration(100)
        .ease(d3.easeLinear)
        .attr("opacity", 0)

    } else if (story.chapter === 2) {
      // Chapter 2:
      // Show all the particles into the barchart

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
        .transition()
        .duration(500)
        .ease(d3.easeLinear)
        .attr("r", d => 10)
        .attr('opacity', 1)
        .on('start', () => { this.props.blockScroll(true) })

      // Bar chart Animation & Styling
      this.barchart
        .transition()
        .delay(500)
        .duration(200)
        .ease(d3.easeLinear)
        .attr("opacity", 1)
        .on('end', () => { this.props.blockScroll(false) })

      // Label styling
      this.compositionTypesLabels
        .attr("text-anchor", "start")
        .transition()
        .style("font-weight", 'bold')
        .attr('transform', d => {
          const pos = compositionTypes.find(c => c.name === d).barChart
          return `translate(${this.barChartTypeScale(pos.mid)}, ${(height / 3) - 30}) rotate(-45)`
        })
        .attr('opacity', 1)

      this.causesLabels
        .transition()
        .attr("y", d => this.yCausesScale(d))
        .attr('opacity', 0)

    } else if (story.chapter === 3) {
      if (story.subChapter === 0) {
        // Chapter 3:
        // Show all the particles into the air
        yForce = d3.forceY(d => this.yScaleForCauses(d.posY))
        xForce = d3.forceX(d => this.xScaleForCauses(d.posX))
        forceCollide = this.forceCollide
        chargeForce = this.chargeForce

        this.node
          .attr('fill', d => d.compositionColor)
          .attr("r", d => d.r)
          .attr('opacity', 1)

        this.barchart
          .transition()
          .duration(100)
          .ease(d3.easeLinear)
          .attr("opacity", 0)

        this.compositionTypesLabels
          .attr("text-anchor", "middle")
          .transition()
          .attr('transform', d => `translate(${this.compositionTypeScale(d)}, ${this.margin.top * 2}) rotate(0)`)
          .style("font-weight", 'normal')
          .attr('opacity', 0)

        this.causesLabels
          .transition()
          .attr("y", d => this.yCausesScale(d))
          .attr('opacity', 1)

        this.hair
          .transition()
          .duration(100)
          .attr('opacity', 0)
          .attr('transform', d => `translate(0, ${- height})`)

        this.causesBars
          .attr('opacity', 0)
          .transition()
          .duration(20)
          .attr('width', 0)

      } else if (story.subChapter === 1) {

        const scaler = d3.scaleLinear().domain([0, 1]).range([0.01, 0.05])
        yForce = d3.forceY(d => this.yCausesScale(d.cause)).strength(0.08)
        xForce = d3.forceX(d => this.xScaleForCauses(0)).strength(d => scaler(d.causeNumber))
        forceCollide = null
        chargeForce = d3.forceManyBody().strength(-0.001)

        this.node
          .transition()
          .duration(600)
          .attr('fill', '#bfbfbf')

        this.causesBars
          .attr('opacity', 1)
          .transition()
          .ease(d3.easeSinIn)
          .duration(2000)
          .attr('width', d => causes.find(c => c.name === d).amount * 10)
          .on('start', d => this.props.blockScroll(true))
          .on('end', d => this.props.blockScroll(false))

      } else if (story.subChapter === 2) {
        yForce = d3.forceY(d => this.yScaleForCauses(d.posY))
        xForce = d3.forceX(d => this.xScaleForCauses(d.posX))
        forceCollide = this.forceCollide
        chargeForce = this.chargeForce

        this.causesBars
          .transition()
          .duration(300)
          .attr('opacity', 1)
          .attr('width', 0)
      }

    } else if (story.chapter === 4) {
      // Particle manipulation
      yForce = d3.forceY(d => height / 2)
      xForce = d3.forceX(d => d.size === 2.5 ? (width / 2) + 12.5 : (width / 2))
      forceCollide = null
      chargeForce = null

      if (story.subChapter === 0) {
        // Particle styling
        this.node
          .transition()
          .duration(300)
          .attr('fill', '#bfbfbf')
          .attr("r", d => d.size)
          .attr('opacity', 1)

        // Hair animation + styling
        this.hair
          .transition()
          .delay(300)
          .duration(500)
          .attr('opacity', 1)
          .ease(d3.easeQuadIn)
          .attr('transform', d => `translate(${(width / 2) - 70 - 10}, ${height / 2}) scale(1)`)

        // Remove causesLabels
        this.causesLabels
          .transition()
          .attr('opacity', 0)

      } else if (story.subChapter === 1) {
        // Particle styling
        this.node
          .transition()
          .attr('opacity', 0)

        // Hair animation + styling
        this.hair
          .transition()
          .duration(300)
          .ease(d3.easeSinIn)
          .attr('transform', `translate(${(width / 2) - 70 - 10}, ${height / 2}) scale(2)`)

        this.hairMeasurements
          .transition()
          .attr('opacity', 0)
      } else if (story.subChapter === 2) {

        // Hair animation + styling
        this.hairMeasurements
          .transition()
          .attr('opacity', 1)
      } else if (story.subChapter === 6) {
        this.hair
          .transition()
          .attr('opacity', 0)
      }
    }

    if (useForce) {
      // Simulate forces on the Particles
      this.simulation
        .force("x", xForce)
        .force("y", yForce)
        .force("charge", chargeForce)
        .force("collide", forceCollide).alphaDecay(0.001)
      this.simulation.alpha(1).restart()
    }
  }

  generateRandomInteger(min, max) {
    return Math.floor(min + Math.random() * (max + 1 - min));
  }
  generateRandomFloat(min, max) {
    return min + Math.random() * (max + 1 - min)
  }
  invertColor(hex, bw) {
    // https://stackoverflow.com/questions/35969656/how-can-i-generate-the-opposite-color-according-to-current-color
    const padZero = (str, len) => {
      len = len || 2;
      var zeros = new Array(len).join('0');
      return (zeros + str).slice(-len);
    }
    if (hex.indexOf('#') === 0) {
      hex = hex.slice(1);
    }
    // convert 3-digit hex to 6-digits.
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length !== 6) {
      throw new Error('Invalid HEX color.');
    }
    var r = parseInt(hex.slice(0, 2), 16),
      g = parseInt(hex.slice(2, 4), 16),
      b = parseInt(hex.slice(4, 6), 16);
    if (bw) {
      // http://stackoverflow.com/a/3943023/112731
      return (r * 0.299 + g * 0.587 + b * 0.114) > 186
        ? '#000000'
        : '#FFFFFF';
    }
    // invert color components
    r = (255 - r).toString(16);
    g = (255 - g).toString(16);
    b = (255 - b).toString(16);
    // pad each with zeros and return
    return "#" + padZero(r) + padZero(g) + padZero(b);
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

    particles.sort(() => Math.random() - 0.5)

    // generate cause distribution
    for (let index = 0, type = 0, prev = 0, number = 1; index < particles.length; index++) {
      const particle = particles[index]
      const cause = causes[type]
      particle.cause = cause.name
      particle.causeIndex = type
      particle.causeNumber = number * (1 / ((particles.length / 100) * cause.amount))
      number++
      if (index === prev + ((particles.length / 100) * cause.amount)) {
        type++
        prev = index
        number = 1
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
