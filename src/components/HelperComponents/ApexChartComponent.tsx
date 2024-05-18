import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import React, { useContext, useMemo } from "react";
import { AppContext } from "../Context/AppContext";

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
      type: "datetime",
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
          return value.toLocaleString("en-US", {
            maximumFractionDigits: 9,
          });
        },
      },
      marker: {
        show: false,
      },
    },
  } as ApexOptions,
};

function ApexChartComponent({ tokenAddress }: { tokenAddress: string }) {
  const { tokensPriceHistory } = useContext(AppContext);

  const tokenPriceHistory = useMemo(() => {
    const data = tokensPriceHistory.find(
      (token) => token.address === tokenAddress
    );
    if (!data) return { address: "", data: [] };
    return data;
  }, [tokensPriceHistory, tokenAddress]);

  if (!tokenPriceHistory) return null;

  const yAxis = tokenPriceHistory.data.map((price) => price.value);
  const xAxis = tokenPriceHistory.data.map((price) => price.unixTime);

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
        width={"250px"}
      />
    </div>
  );
}
export default ApexChartComponent;
