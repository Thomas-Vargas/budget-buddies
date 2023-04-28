import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Chart } from "chart.js/auto";

const RadarChart = () => {
  const [firstUserExpenses, setFirstUserExpenses] = useState([]);
  const [secondUserExpenses, setSecondUserExpenses] = useState([]);
  const [chartCategories, setChartCategories] = useState([]);

  const allExpenses = useSelector((store) => store.expenses);
  const categories = useSelector((store) => store.categories);
  const members = useSelector((store) => store.currentGroup.members);

  useEffect(() => {
    if (allExpenses[0] && members[0]) {
      let user1Expenses = [];
      let user2Expenses = [];
      for (let expense of allExpenses) {
        // console.log(expense.username);
        // console.log(members[0]);
        if (expense.username === members[0]) {
          // let newArr = [...firstUserExpenses, expense];
          // setFirstUserExpenses(newArr);

          // CHECK FOR KEY IN USEREXPENSES ARRAY, IF IT EXISTS UPDATE THE AMOUNT WITH CURRENT EXPENSE AMOUNT, OTHERWISE CREAT NEW KEY/VALUE PAIR
          user1Expenses.includes()
          user1Expenses.push({[expense.categoryName]: Number(expense.amount)});
        }
        if (expense.username === members[1]) {
          // let newArr = [...secondUserExpenses, expense];
          // setSecondUserExpenses(newArr);
          user2Expenses.push({[expense.categoryName]: Number(expense.amount)});
        }
      }
      setFirstUserExpenses(user1Expenses);
      setSecondUserExpenses(user2Expenses);
    }

    if (categories[0]) {
      let categoryNames = [];
      for (let category of categories) {
        categoryNames.push(category.name);
      }
      setChartCategories(categoryNames);
    }
  }, [allExpenses, members, categories]);

  useEffect(() => {
    if (firstUserExpenses[0] && secondUserExpenses[0] && chartCategories[0]) {
      makeRadarChart();
    }
  }, [firstUserExpenses, secondUserExpenses, chartCategories]);

  const makeRadarChart = () => {
    (async function () {
      const data = {
        labels: chartCategories,
        datasets: [
          {
            label: `${members[0]}`,
            data: firstUserExpenses,
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
            data: secondUserExpenses,
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

      new Chart(document.getElementById("radar"), config);
    })();
  };

  console.log("first user expenses:", firstUserExpenses);
  console.log("second user expenses:", secondUserExpenses);
  console.log("category names:", chartCategories);

  return (
    <div>
      <h1>Radar Chart</h1>
      <canvas id="radar"></canvas>
    </div>
  );
};

export default RadarChart;
