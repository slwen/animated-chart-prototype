import * as React from "react";
import { Data, animate, Override, Animatable, Curve } from "framer";
const bezierCurve = [0.645, 0.045, 0.355, 1] as Curve; // https://easings.net/#easeInOutCubic
const duration = 0.8;
const bezierOptions = { curve: bezierCurve, duration };
import { sortBy } from "lodash";

const data = Data({}); // Filled dynamically

let chartLabels = [];
let chartLines = [];
let columns = [];

export const AnimateChart: Override = () => {
  return {
    onTap() {
      // Ensure the columns are sorted from left to right in the array
      let sortedColumns = sortBy(columns, [col => col.props.left]);

      // Animate in each of the chart labels
      chartLabels.forEach((child, index) => {
        data[child.props.id] = Animatable(0);

        // Stagger the animation with a timeout
        setTimeout(() => {
          animate.bezier(data[child.props.id], 1, bezierOptions);
        }, index * (300 / chartLabels.length));
      });

      // Start chart label and data animations after short delay
      setTimeout(() => {
        sortedColumns.forEach((child, index) => {
          data[child.props.id] = Animatable(0);
          setTimeout(() => {
            animate.bezier(data[child.props.id], 1, bezierOptions);
          }, index * (700 / sortedColumns.length));
        });

        // Animate in chart lines
        chartLines.reverse().forEach((child, index) => {
          data[child.props.id] = Animatable(0);
          animate.bezier(data[child.props.id], 1, bezierOptions);
        });
      }, 300);
    }
  };
};

export const ChartLabels: Override = props => {
  chartLabels = props.children.map(child => child);
};

export const ChartLines: Override = props => {
  chartLines = props.children.map(child => child);
};

export const ChartLabel: Override = props => {
  return {
    opacity: data[props.id] || 0
  };
};

export const ChartLine: Override = props => {
  return {
    originX: 0,
    scaleX: data[props.id] || 0
  };
};

export const Columns: Override = props => {
  columns = props.children.map(child => child);
};

export const Column: Override = props => {
  return {
    scaleY: data[props.id] || 0,
    originY: 1
  };
};
