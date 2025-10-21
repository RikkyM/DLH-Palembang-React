import { Chart } from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { useEffect, useRef } from "react";

const tailwindColors = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
  "#14B8A6",
  "#6366F1",
  "#84CC16",
  "#06B6D4",
];

const generateColors = (count) => {
  const colors = [];
  for (let i = 0; i < count; i++) {
    colors.push(tailwindColors[i % tailwindColors.length]);
  }
  return colors;
};

const PieChart = ({ labels, data }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const colors = generateColors(labels.length);

    chartInstance.current = new Chart(chartRef.current, {
      type: "pie",
      data: {
        labels,
        datasets: [
          {
            data,
            backgroundColor: colors,
            borderColor: "#fff",
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          datalabels: {
            color: "#fff",
            font: {
              weight: "bold",
              size: 12,
            },
            anchor: "end",
            align: "start",
            offset: 20,
            clip: false,
            display: (ctx) => {
              let value = ctx.dataset.data[ctx.dataIndex];

              const dataArr = ctx.chart.data.datasets[0].data;
              const total = dataArr.reduce((a, b) => a + b, 0);
              const pct = (value / total) * 100;

              return pct > 0;
            },
            formatter: (value, ctx) => {
              const dataArr = ctx.chart.data.datasets[0].data;
              const total = dataArr.reduce((a, b) => a + b, 0);
              return ((value / total) * 100).toFixed(1) + "%";
            },
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                let value = context.raw;
                return new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                }).format(value);
              },
            },
          },
        },
      },
      plugins: [ChartDataLabels],
    });
  }, [labels, data]);

  return (
    <div className="flex flex-col">
      <div className="px-10 pb-5 lg:px-5">
        <canvas className="!h-full !w-full" ref={chartRef} />
      </div>
      <div className="grid h-full grid-cols-1 justify-start gap-0.5">
        {labels.map((label, i) => (
          <div key={i} className="flex items-center gap-2 text-xs xl:text-sm">
            <span
              className="inline-block size-3 rounded-full"
              style={{ backgroundColor: generateColors(labels.length)[i] }}
            />
            <span>
              {label} -{" "}
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
              }).format(data[i])}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PieChart;
