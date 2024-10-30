<template>
    <div ref="chartContainer" class="chart-container"></div>
  </template>
  
  <script lang="ts" setup>
  import * as d3 from "d3";
  import { onMounted, ref } from "vue";
  
  // 股票数据示例
  const data = [
    { date: "2024-10-27", open: 100, close: 110, high: 115, low: 95 },
    { date: "2024-10-28", open: 110, close: 108, high: 118, low: 105 },
    { date: "2024-10-29", open: 108, close: 120, high: 125, low: 107 },
    { date: "2024-10-30", open: 120, close: 115, high: 130, low: 112 },
    { date: "2024-10-31", open: 115, close: 118, high: 122, low: 114 },
    // 添加更多数据点
  ];
  
  const chartContainer = ref<HTMLDivElement | null>(null);
  
  onMounted(() => {
    if (!chartContainer.value) return;
  
    const margin = { top: 20, right: 20, bottom: 40, left: 40 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
  
    // 创建 SVG 容器
    const svg = d3
      .select(chartContainer.value)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
  
    // X 轴 - 日期轴
    const x = d3
      .scaleBand()
      .domain(data.map(d => d.date.toString())) // 确保使用字符串格式化的日期
      .range([0, width])
      .padding(0.2);
  
    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).tickFormat(d => d)); // 使用默认格式化
  
    // Y 轴 - 价格轴
    const y = d3
      .scaleLinear()
      .domain([
        d3.min(data, d => d.low)! * 0.95,
        d3.max(data, d => d.high)! * 1.05,
      ])
      .nice()
      .range([height, 0]);
  
    svg.append("g").call(d3.axisLeft(y));
  
    // 绘制 K 线图
    svg
      .selectAll(".candle")
      .data(data)
      .join("g")
      .attr("class", "candle")
      .each(function (d) {
        const candle = d3.select(this);
  
        // 绘制蜡烛的高低线
        candle
          .append("line")
          .attr("x1", x(d.date.toString())! + x.bandwidth() / 2)
          .attr("x2", x(d.date.toString())! + x.bandwidth() / 2)
          .attr("y1", y(d.high))
          .attr("y2", y(d.low))
          .attr("stroke", "black");
  
        // 绘制蜡烛矩形（开盘价到收盘价）
        candle
          .append("rect")
          .attr("x", x(d.date.toString())!)
          .attr("y", y(Math.max(d.open, d.close)))
          .attr("width", x.bandwidth())
          .attr("height", Math.abs(y(d.open) - y(d.close)))
          .attr("fill", d.open > d.close ? "red" : "green");
      });
  });
  </script>
  
  <style scoped>
  .chart-container {
    display: flex;
    justify-content: center;
  }
  </style>
  