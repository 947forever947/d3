<template>
    <div ref="chartContainer" class="chart-container"></div>
  </template>
  
  <script lang="ts" setup>
  import * as d3 from "d3";
  import { onMounted, ref } from "vue";
  
  // 柱状图数据
  const data = [
    { name: "A", value: 100 },
    { name: "B", value: 80 },
    { name: "C", value: 45 },
    { name: "D", value: 60 },
    { name: "E", value: 20 },
    { name: "F", value: 90 },
    { name: "G", value: 55 },
  ];
  
  // 引用图表容器
  const chartContainer = ref<HTMLDivElement | null>(null);
  
  onMounted(() => {
    if (!chartContainer.value) return;
  
    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const width = 500 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;
  
    const svg = d3
      .select(chartContainer.value)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
  
    // X 轴
    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.name))
      .range([0, width])
      .padding(0.1);
  
    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));
  
    // Y 轴
    const y = d3.scaleLinear().domain([0, 100]).nice().range([height, 0]);
  
    svg.append("g").call(d3.axisLeft(y));
  
    // 绘制柱状图
    svg
      .selectAll(".bar")
      .data(data)
      .join("rect")
      .attr("class", "bar")
      .attr("x", (d) => x(d.name)!)
      .attr("y", (d) => y(d.value))
      .attr("width", x.bandwidth())
      .attr("height", (d) => height - y(d.value))
      .attr("fill", "#4acbd6");

    svg.selectAll(".bar")
       .on("mouseover",function(){
        d3.select(this)
            .transition()
            .duration(200)
            .attr("fill", "red");
            d3.select(this)
            .style("cursor", "pointer")
       })
       .on("mouseout", function() {
        d3.select(this)
            .transition()
            .duration(200)
            .attr("fill", "#4acbd6"); // 恢复原始颜色
    });

  });
  </script>
  
  <style scoped>
  .chart-container {
    display: flex;
    justify-content: center;
  }
  </style>
  