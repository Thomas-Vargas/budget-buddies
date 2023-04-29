import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Chart } from "chart.js/auto";
import { Paper } from "@mui/material";

const RadarChart = () => {
  const [firstUserExpenses, setFirstUserExpenses] = useState({});
  const [secondUserExpenses, setSecondUserExpenses] = useState({});
  const [chartCategories, setChartCategories] = useState([]);
  const [radarChart, setRadarChart] = useState(null);

  const allExpenses = useSelector((store) => store.expenses);
  const categories = useSelector((store) => store.categories);
  const members = useSelector((store) => store.currentGroup.members);
  const theme = useSelector((store) => store.theme);

  useEffect(() => {
    if (allExpenses[0] && members[0]) {
      let user1Expenses = [];
      let user2Expenses = [];
      for (let expense of allExpenses) {
        if (expense.username === members[0]) {
          // CHECK FOR KEY IN USEREXPENSES ARRAY, IF IT EXISTS UPDATE THE AMOUNT WITH CURRENT EXPENSE AMOUNT, OTHERWISE CREAT NEW KEY/VALUE PAIR
          if (
            user1Expenses.some((obj) =>
              Object.keys(obj).includes(expense.categoryName)
            )
          ) {
            // find the object with the matching category name and update its amount
            const updatedExpenses = user1Expenses.map((obj) => {
              if (obj[expense.categoryName]) {
                obj[expense.categoryName] += Number(expense.amount);
              }
              return obj;
            });

            setFirstUserExpenses(updatedExpenses);
          } else {
            // add a new object with the category name and amount
            user1Expenses.push({
              [expense.categoryName]: Number(expense.amount),
            });
            setFirstUserExpenses(user1Expenses);
          }
        }

        if (expense.username === members[1]) {
          if (
            user2Expenses.some((obj) =>
              Object.keys(obj).includes(expense.categoryName)
            )
          ) {
            // find the object with the matching category name and update its amount
            const updatedExpenses = user2Expenses.map((obj) => {
              if (obj[expense.categoryName]) {
                obj[expense.categoryName] += Number(expense.amount);
              }
              return obj;
            });
            setSecondUserExpenses(updatedExpenses);
          } else {
            // add a new object with the category name and amount
            user2Expenses.push({
              [expense.categoryName]: Number(expense.amount),
            });
            setSecondUserExpenses(user2Expenses);
          }
        }
      }
      // setFirstUserExpenses(user1Expenses);
      // setSecondUserExpenses(user2Expenses);
    }

    if (categories[0]) {
      let categoryNames = [];
      for (let category of categories) {
        categoryNames.push(category.name);
      }

      const sortedCategoryNames = categoryNames.slice().sort();
      setChartCategories(sortedCategoryNames);
    }
  }, [allExpenses, members, categories]);

  useEffect(() => {
    let newRadarChart;
    if (firstUserExpenses[0] && secondUserExpenses[0] && chartCategories[0]) {
      if (newRadarChart) {
        newRadarChart.destroy();
      }
      newRadarChart = makeRadarChart();
    }
  }, [firstUserExpenses, secondUserExpenses, chartCategories]);

  const makeRadarChart = () => {
    if (radarChart) {
      radarChart.destroy();
    }

    (async function () {
      const data = {
        labels: chartCategories,
        datasets: [
          {
            label: `${members[0]}`,
            data: chartCategories.map((category) => {
              const expense = firstUserExpenses.find(
                (e) => Object.keys(e)[0] === category
              );
              return expense ? expense[Object.keys(expense)[0]] : 0;
            }),
            fill: true,
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            borderColor: "rgb(255, 99, 132)",
            pointBackgroundColor: "rgb(255, 99, 132)",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "rgb(255, 99, 132)",
          },
          {
            label: `${members[1]}`,
            data: chartCategories.map((category) => {
              const expense = secondUserExpenses.find(
                (e) => Object.keys(e)[0] === category
              );
              return expense ? expense[Object.keys(expense)[0]] : 0;
            }),
            fill: true,
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            borderColor: "rgb(54, 162, 235)",
            pointBackgroundColor: "rgb(54, 162, 235)",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "rgb(54, 162, 235)",
          },
        ],
      };

      const config = {
        type: "radar",
        data: data,
        options: {
          elements: {
            line: {
              borderWidth: 3,
            },
          },
        },
      };

      theme === "dark" ? Chart.defaults.borderColor = "#ffffff" : Chart.defaults.borderColor = "black"
      const newRadarChart = new Chart(document.getElementById("radar"), config);
      setRadarChart(newRadarChart);
    })();
  };

  console.log("first user expenses:", firstUserExpenses);
  console.log("second user expenses:", secondUserExpenses);
  console.log("category names:", chartCategories);

  return (
    <div>
        <canvas id="radar"></canvas>
    </div>
  );
};

export default RadarChart;
