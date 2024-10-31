<template>
    <div ref="chartContainer" class="chart-container"></div>
  </template>
  
  <script lang="ts" setup>
  import * as d3 from "d3";
  import { onMounted, ref } from "vue";
  
  // 饼图数据
  const data = [
    { name: "A", value: 30 },
    { name: "B", value: 70 },
    { name: "C", value: 45 },
    { name: "D", value: 60 },
    { name: "E", value: 20 },
  ];
  
  // 引用图表容器
  const chartContainer = ref<HTMLDivElement | null>(null);
  
  onMounted(() => {
    if (!chartContainer.value) return;
  
    const width = 400;
    const height = 400;
    const radius = Math.min(width, height) / 2;
  
    // 设置颜色比例尺
    const color = d3.scaleOrdinal()
      .domain(data.map((d) => d.name))
      .range(d3.schemeCategory10);
  
    // 创建 SVG 元素
    const svg = d3.select(chartContainer.value)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);
  
    // 饼图和弧生成器
    const pie = d3.pie<any>().value(d => d.value);
    const arc = d3.arc<d3.PieArcDatum<any>>()
      .innerRadius(0)
      .outerRadius(radius);

  
    // 绑定数据并绘制扇区
    svg.selectAll("path")
      .data(pie(data))
      .join("path")
      .attr("d", arc)
      .attr("fill", d => color(d.data.value) as string)
      .attr("stroke", "white")
      .style("stroke-width", "2px")
      .on("mouseover", function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("fill", "orange");  // 鼠标悬停时的颜色
        d3.select(this)
          .style("cursor", "pointer");
      })
      .on("mouseout", function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("fill", d => color(d.data.value) as string); // 恢复原始颜色
      });
      svg.selectAll("text")
  .data(pie(data))
  .join("text")
  .attr("transform", d => `translate(${arc.centroid(d)})`)  // 计算文本位置
  .attr("dy", "0.35em")  // 调整垂直位置
  .text(d => d.data.value)  // 设置文本内容为 value 值
  .style("text-anchor", "middle")  // 设置文本对齐方式
  .attr("fill", "white");  // 设置文本颜色
  });
  </script>
  
  <style scoped>
  .chart-container {
    display: flex;
    justify-content: center;
  }
  </style>
  