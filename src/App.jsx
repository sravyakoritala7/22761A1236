import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./App.css";

const API_SOURCES = {
  p: "http://20.244.56.144/test/primes",
  f: "http://20.244.56.144/test/fibo",
  e: "http://20.244.56.144/test/even",
  r: "http://20.244.56.144/test/rand",
};

const AUTH_URL = "http://20.244.56.144/test/auth";
const AUTH_BODY = {
  companyName: "AffordMed",
  clientID: "fa72555e-8723-484c-a39e-7af2fc66aeb1",
  clientSecret: "fysqbErqGumsxqOQ",
  ownerName: "Koritala Sravya",
  ownerEmail: "ammulusravya.12@gmail.com",
  rollNo: "22761A1236",
};

const App = () => {
  const { category } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (!API_SOURCES[category]) {
        setError("Invalid category. Choose from: /p, /f, /e, or /r.");
        return;
      }

      setLoading(true);
      setError("");
      setData([]);

      try {
        const authResponse = await axios.post(AUTH_URL, AUTH_BODY);
        const apiKey = authResponse.data?.access_token;

        if (!apiKey) throw new Error("Authorization failed.");

        const response = await axios.get(API_SOURCES[category], {
          headers: { Authorization: `Bearer ${apiKey}` },
          timeout: 3000,
        });

        setData(response.data?.numbers || []);
      } catch (err) {
        console.error("Error:", err);
        setError("Unable to retrieve data. Check network and API key.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [category]);

  return (
    <div className="container">
      <h1 className="title">Calculator</h1>
      <h2 className="category">Category: {category?.toUpperCase()}</h2>

      {loading && <div className="loader"></div>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && (
        <div className="data-box">
          <h3>Generated Numbers</h3>
          <p>{data.length ? data.join(", ") : "No data available"}</p>
        </div>
      )}
    </div>
  );
};

export default App;
