import React, { Component } from "react";
import "./App.css";
import {
    XAxis,
    YAxis,
    XYPlot,
    LineSeries,
    Hint,
    Highlight,
    ChartLabel
  } from "react-vis";

class PMPlotComponent extends Component{
    constructor() {
        super();
        this.state = {
          lastDrawLocation: null,
          hoverValue: null,
          graphData: {
            Data: [],
            TickValues: [],
            WHOGuideline: 0,
            XText: "XText",
            YText: "YText"
          }
        };
    }

    componentWillMount() {
        this.prepareDataLineGraph();
    }
    
    prepareDataLineGraph() {
        let lineGraphData = [];
             
        this.props.Data.map((element, index) =>
          lineGraphData.push({
            x: element["Date"],
            y: element["Value"]
          })
        );
    
        this.setState({
          graphData: {
            Data: lineGraphData,
            TickValues: this.props.TickValues,
            WHOGuideline: this.props.WHOGuideline,
            XText: this.props.XText,
            YText: this.props.YText
          }
        });
    }

    render(){
        const { lastDrawLocation} = this.state;
        /* if (this.state.graphData.Data.length === 0) {
          console.log('state is undefined')
          return null;
        } */
        return (
    <XYPlot
            xType="ordinal"
            animation
            xDomain={
              lastDrawLocation && [
                lastDrawLocation.left,
                lastDrawLocation.right
              ]
            }
            yDomain={
              lastDrawLocation && [
                lastDrawLocation.bottom,
                lastDrawLocation.top
              ]
            }
            height={250}
            width={1200}
            margin={{ bottom: 80, left: 50, right: 10, top: 20 }}
          >
            <LineSeries
              className="series"
              data={this.state.graphData.Data}
              onNearestX={(value, { index }) =>
                this.setState({ hoverValue: value, index })
              }
              onSeriesMouseOut={() => this.setState({ hoverValue: null })}
            />
            {console.log(this.state.graphData.Data.length)}
            {console.log(this.state.graphData.Data[this.state.graphData.Data.length - 1])}
            <LineSeries
              className="WHO guideline"
              color="red"
              data={[{x: this.state.graphData.Data[0].x, y: this.state.graphData.WHOGuideline}, {x: this.state.graphData.Data[this.state.graphData.Data.length - 1].x, y:  this.state.graphData.WHOGuideline}]}
            />

            {this.state.hoverValue && (
              <Hint
                value={this.state.hoverValue}
                style={{
                  fontSize: 14,
                  padding: 14,
                  margin: 10,
                  text: {
                    display: "none"
                  },
                  value: {
                    color: "red"
                  }
                }}
              >
                <div
                  style={{
                    background: " #96b9c2",
                    padding: "10px",
                    color: "white"
                  }}
                >
                  <div>PM25:</div>
                  <div>{this.state.hoverValue.y}</div>
                </div>
              </Hint>
            )}
            <YAxis
              style={{
                line: { stroke: "#ADDDE1" },
                ticks: { stroke: "#ADDDE1" },
                text: { stroke: "none", fill: "#6b6b76", fontWeight: 600 }
              }}
            />
            <XAxis
              tickValues={this.state.graphData.TickValues}
              style={{
                title: { fontSize: "18px" },
                line: { stroke: "#ADDDE1" },
                ticks: { stroke: "#ADDDE1" },
                text: { stroke: "none", fill: "#6b6b76", fontWeight: 600 }
              }}
            />
            <ChartLabel
              text={this.state.graphData.XText}
              includeMargin={false}
              xPercent={0.5}
              yPercent={1.4}
              style={{
                className: "axis-label"
              }}
            />
            <ChartLabel
              text={this.state.graphData.YText}
              includeMargin={false}
              xPercent={-0.03}
              yPercent={0.5}
              style={{
                transform: "rotate(-90)",
                textAnchor: "end",
                className: "axis-label"
              }}
            />
            <ChartLabel
              text="WHO guideline"
              includeMargin={false}
              xPercent={0.9}
              yPercent={0.3}
              style={{
                className: "axis-label"
              }}
            />

            {/* <Highlight
              onBrushEnd={area => this.setState({ lastDrawLocationPM25: area })}
              onDrag={area => {
                this.setState({
                  lastDrawLocationPM25: {
                    bottom:
                      lastDrawLocationPM25.bottom + (area.top - area.bottom),
                    left: lastDrawLocationPM25.left - (area.right - area.left),
                    right:
                      lastDrawLocationPM25.right - (area.right - area.left),
                    top: lastDrawLocationPM25.top + (area.top - area.bottom)
                  }
                });
              }}
            /> */}
          </XYPlot>
        );
    }
}

export {PMPlotComponent};