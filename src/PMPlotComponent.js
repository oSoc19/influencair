import React, { Component } from "react";
import "./App.css";
import "../node_modules/react-vis/dist/style.css";
import {
    XAxis,
    YAxis,
    XYPlot,
    LineSeries,
    Hint,
    Highlight,
    ChartLabel
  } from "react-vis";
import {YearlyAverageDataPM25} from "./YearlyAverageData.js";
import {DailyAverageDataPM25} from "./dailyAverageData.js";

class PMPlotComponent extends Component{
    constructor() {
        super();
        let lineGraphData = [];
        
          YearlyAverageDataPM25.yearlyAverages.map((element, index) =>
          lineGraphData.push({
            x: element["year"],
            y: element["value"]
          })
        );  
        this.state = {
          hoverValue: null,
          rangeY: {top:25, bottom:0},
          graphData: {
            Data: lineGraphData,
            TickValues: [
              "2005","2006","2007",
              "2008","2009","2010","2011","2012","2013","2014","2015","2016","2017","2018"
            ],
            WHOGuideline: 10,
            XText: "Years",
            YText: "PM2.5"
          }
        };
    }

    

    componentWillReceiveProps(nextProps) {
      
      const differentStory = this.props.story.story !== nextProps.story.story;
      const differentChapter = this.props.story.chapter !== nextProps.story.chapter;
      const differentSubChapter = this.props.story.subChapter !== nextProps.story.subChapter;
      if(differentStory || differentChapter || differentSubChapter)
      {
         console.log("receivedProps");
         this.prepareDataLineGraph(nextProps);
      }
    }

    shouldComponentUpdate(nextProps)
    {
      const differentStory = this.props.story.story !== nextProps.story.story;
      const differentChapter = this.props.story.chapter !== nextProps.story.chapter;
      const differentSubChapter = this.props.story.subChapter !== nextProps.story.subChapter;
      return differentStory || differentChapter || differentSubChapter;
    }
    
    prepareDataLineGraph(nextProps) {
      const {story} = nextProps;
      console.log("PrepareDataLineGraph - story: ", story.story);
      if(story && story.story === 3  && story.chapter === 0 && story.subChapter === 1)
      {
        console.log("Change to yearly");
        let lineGraphData = [];
        
          YearlyAverageDataPM25.yearlyAverages.map((element, index) =>
          lineGraphData.push({
            x: element["year"],
            y: element["value"]
          })
        );  
    
        this.setState({
          rangeY: {top:25, bottom:0},
          graphData: {
            Data: lineGraphData,
            TickValues: [
              "2005","2006","2007",
              "2008","2009","2010","2011","2012","2013","2014","2015","2016","2017","2018"
            ],
            WHOGuideline: 10,
            XText: "Years",
            YText: "PM2.5"
          }
        });
      }
      else if (story && story.story === 3 && story.chapter === 0 && story.subChapter === 2)
      {
        console.log("Change to daily");
        let lineGraphData = [];
        
          DailyAverageDataPM25.dailyAverages.map((element, index) =>
          lineGraphData.push({
            x: element["Date"],
            y: element["Value"]
          })
        );  
    
        this.setState({
          rangeY: {top:40, bottom:0},
          graphData: {
            Data: lineGraphData,
            TickValues: [
              "01-01-2018","01-02-2018","01-03-2018","01-04-2018","01-05-2018","01-06-2018","01-07-2018","01-08-2018","01-09-2018","01-10-2018",
              "01-11-2018","01-12-2018","01-01-2019","01-02-2019","01-03-2019","01-04-2019","01-05-2019","01-06-2019","01-07-2019"
            ],
            WHOGuideline: 25,
            XText: "Days",
            YText: "PM2.5"
          }
        });
      }
    }

    render(){
        const { rangeY} = this.state;
        console.log("Render");
        console.log(this.state);
        if(this.props.story && this.props.story.story === 3 && this.props.story.chapter === 0 && (this.props.story.subChapter === 1 || this.props.story.subChapter === 2))
        {

        return (
          <div className="plot">
            <XYPlot
            xType="ordinal"
            animation={'noWobble'}
            /* xDomain={
              rangeRect && [
                rangeRect.left,
                rangeRect.right
              ]
            } */
            yDomain={
              rangeY && [
                rangeY.bottom,
                rangeY.top
              ]
            }
            height={250}
            width={1200}
            margin={{ bottom: 80, left: 50, right: 10, top: 20 }}
          >
            <LineSeries
              animation={'noWobble'}
              className="series"
              data={this.state.graphData.Data}
              // onNearestX={(value, { index }) =>
              //   this.setState({ hoverValue: value, index })
              // }
              // onSeriesMouseOut={() => this.setState({ hoverValue: null })}
            />
            {console.log(this.state.graphData.Data.length)}
            {console.log(this.state.graphData.Data[this.state.graphData.Data.length - 1])}
            
            <LineSeries
              animation={'noWobble'}
              className="WHO guideline"
              color="red"
              data={[{x: this.state.graphData.Data[0].x, y: this.state.graphData.WHOGuideline}, {x: this.state.graphData.Data[this.state.graphData.Data.length - 1].x, y:  this.state.graphData.WHOGuideline}]}
            />

            {/* {this.state.hoverValue && (
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
            )} */}
            <YAxis
              style={{
                line: { stroke: "#ADDDE1" },
                ticks: { stroke: "#ADDDE1" },
                text: { stroke: "none", fill: "#6b6b76", fontWeight: 600 }
              }}
            />
            <XAxis
              tickValues={this.state.graphData.TickValues}
              tickLabelAngle={-45}
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
              yPercent={1.6}
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
              onBrushEnd={area => this.setState({ rangeRectPM25: area })}
              onDrag={area => {
                this.setState({
                  rangeRectPM25: {
                    bottom:
                      rangeRectPM25.bottom + (area.top - area.bottom),
                    left: rangeRectPM25.left - (area.right - area.left),
                    right:
                      rangeRectPM25.right - (area.right - area.left),
                    top: rangeRectPM25.top + (area.top - area.bottom)
                  }
                });
              }}
            /> */}
          </XYPlot>
          </div>
        
        );
          }
          else 
          {
            return null;
          }
    }
}

export {PMPlotComponent};