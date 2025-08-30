import { Chart } from "chart.js/auto";
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
        },
      },
    });
  }, [labels, data]);

  return (
    <div className="flex flex-col">
      <div className="px-14 pb-5 md:px-10">
        <canvas className="!h-full !w-full" ref={chartRef} />
      </div>
      <div className="flex h-full flex-1 flex-wrap justify-start gap-4">
        {labels.map((label, i) => (
          <div key={i} className="flex items-center gap-2 text-xs xl:text-sm">
            <span
              className="inline-block size-3 rounded-full"
              style={{ backgroundColor: generateColors(labels.length)[i] }}
            />
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PieChart;
