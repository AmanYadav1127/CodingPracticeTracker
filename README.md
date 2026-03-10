# Coding Practice Tracker

A full-stack web application to track coding practice across platforms like LeetCode, Codeforces, and others.
This project helps users record solved problems, track progress, and analyze their coding consistency.

## 🚀 Tech Stack

### Backend

* Java
* Spring Boot
* Spring Data JPA
* H2 Database

### Frontend

* React
* Vite
* Axios
* CSS

## 📌 Features

* Add coding problems you solved
* Track problem difficulty (Easy / Medium / Hard)
* Store platform name (LeetCode, Codeforces, etc.)
* View all solved problems
* Backend REST API with Spring Boot
* React frontend consuming APIs

## 📂 Project Structure

```
CodingPracticeTracker
│
├── backend
│   ├── controller
│   ├── service
│   ├── repository
│   ├── model
│   └── application.properties
│
└── frontend
    ├── public
    ├── src
    │   ├── services
    │   │   └── problemService.js
    │   ├── App.jsx
    │   └── main.jsx
    │
    ├── package.json
    └── vite.config.js
```

## ⚙️ Backend Setup

1. Navigate to backend folder

```
cd backend
```

2. Run Spring Boot application

```
./mvnw spring-boot:run
```

Server runs on:

```
http://localhost:8080
```

H2 Console:

```
http://localhost:8080/h2-console
```

## ⚙️ Frontend Setup

1. Navigate to frontend folder

```
cd frontend
```

2. Install dependencies

```
npm install
```

3. Start React app

```
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

## 🔗 API Endpoints

| Method | Endpoint       | Description        |
| ------ | -------------- | ------------------ |
| GET    | /problems      | Fetch all problems |
| POST   | /problems      | Add a new problem  |
| DELETE | /problems/{id} | Delete a problem   |

## 🧠 Future Improvements

* User authentication
* Progress statistics dashboard
* Platform filtering
* Daily streak tracking
* Integration with LeetCode API

## 👨‍💻 Author

Aman Yadav

## ⭐ Contribution

Feel free to fork the repository and submit pull requests.
