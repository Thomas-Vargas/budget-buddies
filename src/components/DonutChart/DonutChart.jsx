import { Chart } from "chart.js/auto";
import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";

const DonutChart = ({}) => {
  const groupId = useParams();
  //should probably change this variable to something else
  const [chartGenerated, setChartGenerated] = useState(false);

  const dispatch = useDispatch();

  const currentGroup = useSelector((store) => store.currentGroup);
  const categoryTotals = useSelector((store) => store.categoryTotals);

  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  const createDonutChart = () => {
    const categoriesArray = categoryTotals.map((category) => category.name);
    const categoriesTotalArray = categoryTotals.map(
      (category) => category.expenseTotal
    );
    const randomColors = categoriesArray.map(getColorForCategory);

    if (!chartRef.current) {
      chartRef.current = new Chart(canvasRef.current, {
        type: "doughnut",
        data: {
          labels: categoriesArray,
          datasets: [
            {
              label: "Amount",
              data: categoriesTotalArray,
              backgroundColor: randomColors,
              hoverOffset: 4,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
          },
        },
      });
    } else {
      chartRef.current.data.labels = categoriesArray;
      chartRef.current.data.datasets[0].data = categoriesTotalArray;
      chartRef.current.data.datasets[0].backgroundColor = randomColors;
      chartRef.current.update();
    }
  };

  useEffect(() => {
    if (!chartGenerated && currentGroup.id) {
      dispatch({ type: "FETCH_CATEGORY_TOTALS", payload: currentGroup.id });
      dispatch({ type: "FETCH_CURRENT_GROUP", payload: groupId });
      setChartGenerated(true);
    }
  }, [chartGenerated, currentGroup.id]);

  useEffect(() => {
    if (categoryTotals.length && currentGroup.id && chartGenerated) {
      createDonutChart();
    }
  }, [categoryTotals, currentGroup.id, chartGenerated]);

  /**
   * Generate a color for a given category name.
   * The color is based on a fixed algorithm that uses the category name to generate a unique hash value,
   * which is then used to calculate a hue value between 0 and 360 degrees.
   * The saturation and lightness values are fixed at 70% and 50%, respectively.
   * acc << 5 shifts the binary representation of acc to the left by 5 bits. This is equivalent to multiplying acc by 2^5 (which is 32).
   * - acc subtracts the original value of acc from the shifted value.
   * + val.charCodeAt(0) adds the Unicode code point of the current character to the result. This means that each character in the string contributes to the final hash value.
   * |0 is a bitwise OR operator that converts the result to a 32-bit integer. This ensures that the hash value is always a positive integer.
   */
  function getColorForCategory(categoryName) {
    // Generate a hash value for the category name
    const hash = categoryName
      .split("")
      .reduce((acc, val) => ((acc << 5) - acc + val.charCodeAt(0)) | 0, 0);
    console.log("hash", hash);
    // Calculate a hue value between 0 and 360 degrees based on the hash value
    const hue = hash % 360;
    console.log("hue", hue);
    // Return a CSS color string in the HSL format with fixed saturation and lightness values
    return `hsl(${hue}, 70%, 50%)`;
  }

  return (
      <canvas id="donut" ref={canvasRef}></canvas>
  )
};

export default DonutChart;
