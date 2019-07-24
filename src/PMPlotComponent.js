import React, { Component } from "react";
import "./App.css";
import "../node_modules/react-vis/dist/style.css";
import {
  XAxis,
  YAxis,
  XYPlot,
  LineSeries,
  ChartLabel,
  GradientDefs,
  AreaSeries,
  VerticalRectSeries
} from "react-vis";
import { YearlyAverageDataPM25 } from "./YearlyAverageData.js";
import { DailyAverageDataPM25 } from "./dailyAverageData.js";
import colors from "./colors";

class PMPlotComponent extends Component {
  constructor() {
    super();
    this.state = {};
  }

  componentWillMount() {
    this.populateYearlyData();
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

  populateYearlyData() {
    let lineGraphData = [];
    YearlyAverageDataPM25.yearlyAverages.map((element, index) =>
      lineGraphData.push({
        x: new Date(element["year"]).getTime(),
        y: element["value"]
      })
    );

    this.setState({
      rangeY: { top: 25, bottom: 0 },
      XType: "linear",
      graphData: {
        Data: lineGraphData,
        TickValues: [
          new Date("2005").getTime(),
          new Date("2006").getTime(),
          new Date("2007").getTime(),
          new Date("2008").getTime(),
          new Date("2009").getTime(),
          new Date("2010").getTime(),
          new Date("2011").getTime(),
          new Date("2012").getTime(),
          new Date("2013").getTime(),
          new Date("2014").getTime(),
          new Date("2015").getTime(),
          new Date("2016").getTime(),
          new Date("2017").getTime(),
          new Date("2018").getTime()
        ],
        TickFormat: "year",
        WHOGuideline: 10,
        XText: "Years",
        YText: "PM2.5"
      }
    });
  }

  populateDailyData() {
    let lineGraphData = [];

    DailyAverageDataPM25.dailyAverages.map((element, index) =>
      lineGraphData.push({
        x: this.toDate(element["Date"]).getTime(),
        y: element["Value"]
      })
    );

    this.setState({
      rangeY: { top: 40, bottom: 0 },
      XType: "linear",
      graphData: {
        Data: lineGraphData,
        TickValues: [
          this.toDate("01-01-2018").getTime(),
          this.toDate("01-02-2018").getTime(),
          this.toDate("01-03-2018").getTime(),
          this.toDate("01-04-2018").getTime(),
          this.toDate("01-05-2018").getTime(),
          this.toDate("01-06-2018").getTime(),
          this.toDate("01-07-2018").getTime(),
          this.toDate("01-08-2018").getTime(),
          this.toDate("01-09-2018").getTime(),
          this.toDate("01-10-2018").getTime(),
          this.toDate("01-11-2018").getTime(),
          this.toDate("01-12-2018").getTime(),
          this.toDate("01-01-2019").getTime(),
          this.toDate("01-02-2019").getTime(),
          this.toDate("01-03-2019").getTime(),
          this.toDate("01-04-2019").getTime(),
          this.toDate("01-05-2019").getTime(),
          this.toDate("01-06-2019").getTime(),
          this.toDate("01-07-2019").getTime()
        ],
        TickFormat: "day",
        WHOGuideline: 25,
        XText: "Days",
        YText: "PM2.5"
      }
    });
  }

  prepareDataLineGraph(nextProps) {
    const { story } = nextProps;
    if (
      story &&
      story.story === 3 &&
      story.chapter === 0 &&
      story.subChapter === 1
    ) {
      this.populateYearlyData();
    } else if (story && story.story === 3 && story.chapter === 1) {
      this.populateDailyData();
    }
  }

  toDate(dateStr) {
    var parts = dateStr.split("-");
    return new Date(parts[2], parts[1] - 1, parts[0]);
  }

  formatTick(timeStamp, format) {
    if (format === "year") {
      return new Date(timeStamp).getFullYear();
    } else if (format === "day") {
      var date = new Date(timeStamp);
      var month = date.getMonth() + 1;
      var day = date.getDate();
      var year = date.getFullYear();
      return day + "-" + month + "-" + year;
    }
  }

  zoomToTime(story) {
    if (story.chapter === 1) {
      if (story.subChapter === 1) {
        return [
          this.toDate("01-02-2018").getTime(),
          this.toDate("01-04-2018").getTime()
        ];
      } else if (story.subChapter === 2) {
        return [
          this.toDate("01-04-2018").getTime(),
          this.toDate("01-05-2018").getTime()
        ];
      } else if (story.subChapter === 3) {
        return [
          this.toDate("01-01-2019").getTime(),
          this.toDate("22-03-2019").getTime()
        ];
      } else if (story.subChapter === 4) {
        return [
          this.toDate("01-03-2019").getTime(),
          this.toDate("01-05-2019").getTime()
        ];
      }
    }
    return [
      this.state.graphData.Data[0].x,
      this.state.graphData.Data[this.state.graphData.Data.length - 1].x
    ];
  }

  getGridLines()
  {
    return (
      [ {
          x0 : this.toDate("03-03-2018").getTime(),
          x : this.toDate("03-03-2018").getTime() + 1,
          y : 50
        },
        {
          x0: this.toDate("21-04-2018").getTime(),
          x : this.toDate("21-04-2018").getTime() + 1,
          y : 50
        },
        {
          x0: this.toDate("28-02-2019").getTime(),
          x : this.toDate("28-02-2019").getTime() + 1,
          y : 50
        },
        {
          x0: this.toDate("23-03-2019").getTime(),
          x : this.toDate("23-03-2019").getTime() + 1,
          y : 50
        }
      ]
    )
  }

  getInfoboxText(story)
  {
    if (story.chapter === 0) {
      if (story.subChapter === 1) {
        return (
          <p className="info-box">
            Irceline or Ircel-Celine is a Belgian Interregional Environment Agency informing citizens on ambient air quality in the Belgian regions.
          </p>
        );
      }
    }
    if (story.chapter === 1) {
      if (story.subChapter === 0) {
        return (
          <p className="info-box">
            Influencair is a group of citizens who are concerned about the air quality in Brussels. 
            They wants to raise awareness by measuring and mapping local pollution levels.
            The aim is to build a comprehensive sensor network covering the whole Brussels region.
          </p>
        );
      }
    }
  }

  render() {
    const { rangeY, XType } = this.state;
    let { story } = this.props;
    if (
      !story ||
      story.story !== 3 ||
      (story.chapter === 0 && story.subChapter === 0)
    )
      return null;
    return (
      <div className="plot">
        <div className="info-box-wrapper">
          {this.getInfoboxText(story)}
        </div>


        <XYPlot
          className={"xy-plot"}
          xType={XType}
          animation={"noWobble"}
          xDomain={this.zoomToTime(story)}
          yDomain={rangeY && [rangeY.bottom, rangeY.top]}
          height={250}
          width={1200}
          margin={{ bottom: 80, left: 50, right: 10, top: 20 }}
        >
          <GradientDefs>
            <linearGradient id="BelowGradient" x1="0" x2="0" y1="0" y2="1">
              <stop
                offset="0%"
                stopColor={colors.primaryMid}
                stopOpacity={0.3}
              />
              <stop
                offset="100%"
                stopColor={colors.primaryMid}
                stopOpacity={0.3}
              />
            </linearGradient>
          </GradientDefs>

          <GradientDefs>
            <linearGradient id="TopGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={colors.accent} stopOpacity={0.3} />
              <stop offset="100%" stopColor={colors.accent} stopOpacity={0.3} />
            </linearGradient>
          </GradientDefs>

          <AreaSeries
            color={"url(#BelowGradient)"}
            data={[
              {
                x: this.state.graphData.Data[0].x,
                y0: 0,
                y: this.state.graphData.WHOGuideline
              },
              {
                x: this.state.graphData.Data[
                  this.state.graphData.Data.length - 1
                ].x,
                y0: 0,
                y: this.state.graphData.WHOGuideline
              }
            ]}
          />
          <AreaSeries
            color={"url(#TopGradient)"}
            data={[
              {
                x: this.state.graphData.Data[0].x,
                y0: this.state.graphData.WHOGuideline,
                y: rangeY.top
              },
              {
                x: this.state.graphData.Data[
                  this.state.graphData.Data.length - 1
                ].x,
                y0: this.state.graphData.WHOGuideline,
                y: rangeY.top
              }
            ]}
          />

          <YAxis
            style={{
              line: { stroke: "#ADDDE1" },
              ticks: { stroke: "#ADDDE1" },
              text: { stroke: "none", fill: "#6b6b76", fontWeight: 600 }
            }}
          />
          <XAxis
            tickValues={this.state.graphData.TickValues}
            tickFormat={v =>
              this.formatTick(v, this.state.graphData.TickFormat)
            }
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

          {/* {story.subChapter > 2 &&
              Object.entries(this.state.sensorData).map(([key, value]) => {
                let sensorLine = [];
                value.map(element => {
                  sensorLine.push({
                    x: this.toDate(element.Date).getTime(),
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
              })} */}

          <LineSeries
            animation={"noWobble"}
            className="series"
            color={colors.primary}
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
          <VerticalRectSeries data={this.getGridLines()} style={{stroke: colors.accent}} />
        </XYPlot>
      </div>
    );
  }
}

export { PMPlotComponent };
