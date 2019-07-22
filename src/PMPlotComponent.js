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
import { YearlyAverageDataPM25 } from "./YearlyAverageData.js";
import { DailyAverageDataPM25 } from "./dailyAverageData.js";
import dailyAverages from "./resources/data/dailyAveragesPerSensor.json";

class PMPlotComponent extends Component {
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
      sensorData: dailyAverages,
      hoverValue: null,
      rangeY: { top: 25, bottom: 0 },
      graphData: {
        Data: lineGraphData,
        TickValues: [
          "2005",
          "2006",
          "2007",
          "2008",
          "2009",
          "2010",
          "2011",
          "2012",
          "2013",
          "2014",
          "2015",
          "2016",
          "2017",
          "2018"
        ],
        WHOGuideline: 10,
        XText: "Years",
        YText: "PM2.5"
      }
    };
  }

  componentWillReceiveProps(nextProps) {
    const { story } = this.props;
    const differentStory = story.story !== nextProps.story.story;
    const differentChapter = story.chapter !== nextProps.story.chapter;
    const differentSubChapter = story.subChapter !== nextProps.story.subChapter;
    if (differentStory || differentChapter || differentSubChapter) {
      this.prepareDataLineGraph(nextProps);
    }
  }

  shouldComponentUpdate(nextProps) {
    const { story } = this.props;
    const differentStory = story.story !== nextProps.story.story;
    const differentChapter = story.chapter !== nextProps.story.chapter;
    const differentSubChapter = story.subChapter !== nextProps.story.subChapter;
    return differentStory || differentChapter || differentSubChapter;
  }

  prepareDataLineGraph(nextProps) {
    const { story } = nextProps;
    if (
      story &&
      story.story === 3 &&
      story.chapter === 0 &&
      story.subChapter === 1
    ) {
      let lineGraphData = [];

      YearlyAverageDataPM25.yearlyAverages.map((element, index) =>
        lineGraphData.push({
          x: element["year"],
          y: element["value"]
        })
      );

      this.setState({
        rangeY: { top: 25, bottom: 0 },
        graphData: {
          Data: lineGraphData,
          TickValues: [
            "2005",
            "2006",
            "2007",
            "2008",
            "2009",
            "2010",
            "2011",
            "2012",
            "2013",
            "2014",
            "2015",
            "2016",
            "2017",
            "2018"
          ],
          WHOGuideline: 10,
          XText: "Years",
          YText: "PM2.5"
        }
      });
    } else if (story && story.story === 3 && story.chapter === 0) {
      let lineGraphData = [];

      DailyAverageDataPM25.dailyAverages.map((element, index) =>
        lineGraphData.push({
          x: element["Date"],
          y: element["Value"]
        })
      );

      this.setState({
        rangeY: { top: 40, bottom: 0 },
        graphData: {
          Data: lineGraphData,
          TickValues: [
            "01-01-2018",
            "01-02-2018",
            "01-03-2018",
            "01-04-2018",
            "01-05-2018",
            "01-06-2018",
            "01-07-2018",
            "01-08-2018",
            "01-09-2018",
            "01-10-2018",
            "01-11-2018",
            "01-12-2018",
            "01-01-2019",
            "01-02-2019",
            "01-03-2019",
            "01-04-2019",
            "01-05-2019",
            "01-06-2019",
            "01-07-2019"
          ],
          WHOGuideline: 25,
          XText: "Days",
          YText: "PM2.5"
        }
      });
    }
  }

  render() {
    const { rangeY } = this.state;
    let { story } = this.props;
    if (
      story &&
      story.story === 3 &&
      story.chapter === 0 &&
      story.subChapter !== 0
    ) {
      return (
        <div className="plot">
          <XYPlot
            xType="ordinal"
            animation={"noWobble"}
            yDomain={rangeY && [rangeY.bottom, rangeY.top]}
            height={250}
            width={1200}
            margin={{ bottom: 80, left: 50, right: 10, top: 20 }}
          >
            <LineSeries
              animation={"noWobble"}
              className="series"
              data={this.state.graphData.Data}
            />
            <LineSeries
              animation={"noWobble"}
              className="WHO guideline"
              color="red"
              data={[
                {
                  x: this.state.graphData.Data[0].x,
                  y: this.state.graphData.WHOGuideline
                },
                {
                  x: this.state.graphData.Data[
                    this.state.graphData.Data.length - 1
                  ].x,
                  y: this.state.graphData.WHOGuideline
                }
              ]}
            />
            {story.subChapter === 3 &&
              Object.entries(this.state.sensorData).map(([key, value]) => {
                let sensorLine = [];
                value.map(element => {
                  sensorLine.push({
                    x: element.Date,
                    y: element.Value
                  });
                });
                return (
                  <LineSeries
                    key={key}
                    animation={"noWobble"}
                    color="gray"
                    data={sensorLine}
                    strokeWidth="0.1px"
                  />
                );
              })}

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
          </XYPlot>
        </div>
      );
    } else {
      return null;
    }
  }
}

export { PMPlotComponent };
