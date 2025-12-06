<div align="center">
<h1 align="center">Robonics</h1>
</div>

## Description

A full-stack MERN-inspired platform made with React, Node.js, Express, MySQL, Google API. Comprehensive client portal for Robonics, a tech startup specializing in CAD design, 3D printing, and robotic innovation. This platform enables clients to seamlessly consult with engineers, manage their projects, book services, and track order.



### Built With
<a href="https://nodejs.org" target="_blank" rel="noreferrer"> <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Node.js_logo.svg/2560px-Node.js_logo.svg.png" alt="nodejs" height="40"/> </a>
<a href="https://www.mysql.com/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/mysql/mysql-original-wordmark.svg" alt="mysql" width="40" height="40"/> </a>
<a href="https://reactjs.org/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original-wordmark.svg" alt="react" width="40" height="40"/> </a>
<img src="https://www.svgrepo.com/show/349330/css3.svg" alt="CSS3" width="40" />

## Installation

Before running the project, ensure all required dependencies are installed in the appropriate directories.

### Steps to SetUp:
1. **Install Root Dependencies (your-path-to-project-location/Robonics)**:
    ```bash
    cd  your-path-to-saved-location/Robonics
    npm install
    ```
2. **Install BackEnd Dependencies**:
    Navigate to the `BackEnd` directory and install dependencies:
    ```bash
    cd BackEnd
    npm install
    cd ..
    ```
3. **Install FrontEnd Dependencies**:
    Navigate to the `FrontEnd` directory and install dependencies:
    ```bash
    cd Frontend
    npm install
    cd ..
    ```

4. **Set up `.env` environment**:
    <br>(1) Navigate to the `Frontend/` directory and create an `.env` like `.env.example` (which is just a template) and enter your FrontEnd domain URL here eg: VITE_API_URL='http://localhost:5000'
    If cloud hosted, enter those details.

    <br>(2) Navigate to the `BackEnd/` directory and create an `.env` like `.env.example`(which is just a template) and enter your Database credentials, jwt secret and google drive credential.

    <br>(3) Navigate to the `BackEnd/googleDrive` directory and create an `oauth_client.json` like in `.oath_client.example.json` and enter your Google Drive Credentials here.


    <br>(4) Create Database schema (MYSQL) from the .sql codes given in `Databasefiles/` folder.

## Running the Application

### FrontEnd
To start the React frontend server on `localhost:3000`, use the following command from the root directory:
```bash
cd Frontend
npm run dev
```


### Backend
To start the backend server on `localhost:5000`, use the following command from the root directory:
```bash
cd BackEnd
npm run dev
```

### All
To start the all servers concurrently at once, from the root directory:
```bash
From Project root (cd .. ) 
        -if you are in BackEnd/Frontend
npm run dev
```

### Features to be implemented:
1) Forgot password option at login.
2) Payment Slip upload option for User similar to project description ZIP upload feature.
3) Terms & Conditions, Privacy Policy JSX pages.
4) UI upgrades, UI Changes and Changing already written generic content that suits to your requirements.
5) Cloud Hosting (replace Backend localhost:5000/ routes and Frontend localhost:3000/ with domain of Cloud Hosting service or use a reverse Proxy)
6) MYSQL Database cloud Hosting (Change `BackEnd/.env` database credentials accordingly).








## Contributors
- [Dinura Ginige](https://github.com/Dinurang)
- [Harshana Gunawardena](https://github.com/Harshana1004)
