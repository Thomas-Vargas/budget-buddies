# Budget Buddies

Budget Buddies is a full-stack web application that allows groups of any size to track their expenses, set budgets, and generate reports. The application is built using React on the front-end and Node.js on the back-end, with a PostgreSQL database for data storage.

Budget Buddies allows users to create multiple groups, each with its own set of users and budgets. Group types include couples, families, and friend groups, and users can specify the budget for each group and track expenses accordingly.

In addition to tracking expenses, Budget Buddies provides several other features to help users manage their finances. These include:

- Customizable categories: Users can create their own expense categories and subcategories to help organize their spending.
- Bill splitting: Users can split bills and expenses among group members, making it easier to track shared expenses.
- Transaction history: Users can view a history of their transactions and filter by date, category, or group.
- Reports: Budget Buddies generates reports that provide insights into spending habits, including a breakdown of expenses by category and a comparison of actual spending to budgeted amounts.

With its user-friendly interface and robust feature set, Budget Buddies is an ideal tool for anyone looking to improve their financial management skills and stay on top of their expenses.

To visit the fully functional site, visit <https://quiet-taiga-38974.herokuapp.com/#/home>.
<br>
To access all of the sites features:

- Create an account and/or login.
- Create a budget group by inviting any user and filling out all required fields.
- Update budget with customizable category tables and expenses.

## Development

Budget Buddies was developed in a two-week sprint.

## Screenshots

![Alt text](./documentation/images/screenshot1.png?raw=true "Home Dashboard")
![Alt text](./documentation/images/screenshot2.png?raw=true "Group Dashboard")
![Alt text](./documentation/images/screenshot3.png?raw=true "All Expenses Page")

## Technologies

<a href="https://www.w3.org/html/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/html5/html5-original-wordmark.svg" alt="html5" width="40" height="40"/> </a> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg" alt="javascript" width="40" height="40"/>
<a href="https://www.w3schools.com/css/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/css3/css3-original-wordmark.svg" alt="css3" width="40" height="40"/> </a>
<a href="https://expressjs.com" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/express/express-original-wordmark.svg" alt="express" width="40" height="40"/> </a> </a> <a href="https://nodejs.org" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original-wordmark.svg" alt="nodejs" width="40" height="40"/> </a> <a href="https://www.postgresql.org" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/postgresql/postgresql-original-wordmark.svg" alt="postgresql" width="40" height="40"/> </a> <a href="https://reactjs.org/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original-wordmark.svg" alt="react" width="40" height="40"/> </a> <a href="https://redux.js.org" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/redux/redux-original.svg" alt="redux" width="40" height="40"/> </a><a href="https://redux-saga.js.org/" target="_blank" rel="noreferrer"> <img src="https://cdn.worldvectorlogo.com/logos/redux-saga.svg" alt="redux-saga" width="40" height="40"/> </a> <a href="https://mui.com/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/materialui/materialui-original.svg" alt="Material UI" width="40" height="40"/> </a>
</a> <a href="https://www.chartjs.org/" target="_blank" rel="noreferrer"> <img src="https://www.chartjs.org/img/chartjs-logo.svg" alt="Chart.js" width="40" height="40"/> </a>

## Prerequisites

- Node.js (version 14.16.0 or higher)
- PostgreSQL (version 13.2 or higher)
- Postico

## Installation

1. Clone the repository.
2. Navigate to the project directory and install all dependencies: `npm install`.
3. Create a database named: `budget_app`.
4. Run all `create table ...` queries in the `database.sql` file, there are also optional queries for inserting data to avoid populating the application through the client.
5. Create a `.env` file and set "SERVER_SESSION_SECRET" to any string longer than 8 characters.
6. In your terminal, run `npm run server` to start the server.
7. In your terminal, run `npm run client` to start the client.
8. The client will open a new tab in your browser with the running application.

## Contributing

If you would like to contribute to Budget Buddies, please follow these steps:

- Fork the repository.
- Create a new branch for your feature or bug fix.
- Make your changes and commit them to your branch.
- Push your changes to your forked repository.
- Submit a pull request.

## License

Budget Buddies is licensed under the [MIT](https://choosealicense.com/licenses/mit/) License.

## Contact

If you have any questions or issues with Budget Buddies, please contact the project owner at <thomasvargas202@gmail.com>.
