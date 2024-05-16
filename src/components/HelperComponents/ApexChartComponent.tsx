import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import React from "react";

const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const chart = {
  options: {
    chart: {
      type: "line",
      width: 100,
      height: 35,
      sparkline: {
        enabled: true,
      },
    },
    xaxis: {
      labels: {
        show: true,
      },
    },
    yaxis: {
      labels: {
        show: false,
      },
    },

    colors: ["#87cefa"],
    stroke: {
      curve: "smooth",
      width: 2,
    },
    tooltip: {
      theme: "dark",
      style: {
        fontSize: "12px",
      },
      fixed: {
        enabled: false,
      },
      x: {
        show: false,
      },
      y: {
        title: {
          formatter: function (seriesName) {
            return "";
          },
        },
        formatter: function (value) {
          return value.toLocaleString();
        },
      },
      marker: {
        show: false,
      },
    },
  } as ApexOptions,
};

function ApexChartComponent() {
  const yAxis = [5, 2, 10, 20, 3, 2, 5, 3, 1, 6];
  const xAxis = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  if (!yAxis || yAxis?.length === 0) {
    return null;
  }
  const series: ApexAxisChartSeries = [
    {
      name: "series-1",
      data: yAxis.map((y, i) => {
        return {
          x: xAxis[i],
          y,
        };
      }),
    },
  ];

  return (
    <div>
      <ApexChart
        height={"80px"}
        options={chart.options}
        series={series}
        type="area"
        width={"150px"}
      />
    </div>
  );
}
export default ApexChartComponent;
