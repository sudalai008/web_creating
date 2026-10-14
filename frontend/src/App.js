import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
  const [message, setMessage] = useState();
  const [error, setError] = useState();

  useEffect(() => {
    let isActive = true;

    fetch("/api/")
      .then(response => {
        if (!response.ok) {
          throw new Error("API request failed");
        }
        return response.json();
      })
      .then(response => {
        if (isActive) {
          setMessage(response.message);
        }
      })
      .catch(() => {
        if (isActive) {
          setError("Could not connect to the API or database.");
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {error ? (
          <p role="alert">{error}</p>
        ) : (
          <p role="status">{message || "Loading..."}</p>
        )}
        <p>
          React 17.0.2, Express 4.17.1 and MariaDB on Docker
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <a
          className="App-link"
          href="https://expressjs.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn Express
        </a>
      </header>
      <footer className="App-footer">
        <p>©Impesud 2023</p>
      </footer>
    </div>
  );
}

export default App;
