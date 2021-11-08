import React from "react";
import { useState, useEffect } from "react";
import { Doughnut, Line, Bar } from "react-chartjs-2";
import getAnalyticsRating from "../pages/api/GET/GetAnalysisRating";
import HashLoader from "react-spinners/HashLoader";
import getOrderAnalytics from "../pages/api/GET/GetOrderAnalysis";
import getMonthlyAnalytics from "../pages/api/GET/GetMonthlyAnalysis";
import getYearlyAnalysis from "../pages/api/GET/GetYearlyAnalysis";
import { useRef } from "react";
import { Select, MenuItem } from "@material-ui/core";
import { FormControl } from "@material-ui/core";
import { getToken } from "../pages/api/apiRequests";
import { baseUrl } from "../constants";

const DashboardCharts = () => {
  const [loading, setLoading] = useState(false);
  const [selectStore, setSelectStore] = useState("all");
  const [allStores, setAllStores] = useState([]);
  const [yearlyAna, setYearlyAnalysis] = useState({
    years: [],
    orders: [],
  });
  const [orderAna, setOrderAnalytics] = useState({
    orders: [],
    category: [],
  });
  const [monthlyAna, setMonthlyAnalysis] = useState({
    months: [],
    orders: [],
  });
  const [rating, setRating] = useState({
    ratings: [],
    category: [],
  });
  useEffect(() => {
    let { user } = getToken();
    let { access_token } = JSON.parse(user);
    const getAllStores = async () => {
      fetch(baseUrl + "/stores", {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => setAllStores(data));
    };
    getAllStores();
  }, []);
  useEffect(() => {
    setLoading(true);
    getAnalyticsRating(
      baseUrl +
        "/analytics/category/rating" +
        (selectStore !== "all" ? "?store_id=" + selectStore : "")
    ).then((data) => {
      if (data) {
        if (data.error || data.detail) {
          console.log("Error", data.err);
          setLoading(false);
        } else {
          console.log("Success", data);
          setRating(data);
          setLoading(false);
        }
      } else {
        console.log("No DATA");
        setLoading(false);
      }
    });
    setLoading(true);
    getOrderAnalytics(
      baseUrl +
        "/analytics/category/order" +
        (selectStore !== "all" ? "?store_id=" + selectStore : "")
    ).then((data) => {
      if (data) {
        if (data.error || data.detail) {
          console.log("Error", data.err);
          setLoading(false);
        } else {
          console.log("Success", data);
          setOrderAnalytics(data);
          setLoading(false);
        }
      } else {
        console.log("No DATA");
        setLoading(false);
      }
    });
    setLoading(true);
    getMonthlyAnalytics(
      baseUrl +
        "/analytics/orders/month" +
        (selectStore !== "all" ? "?store_id=" + selectStore : "")
    ).then((data) => {
      if (data) {
        if (data.error || data.detail) {
          console.log("Error", data.err);
          setLoading(false);
        } else {
          console.log("Success", data);
          setMonthlyAnalysis(data);
          setLoading(false);
        }
      } else {
        console.log("No DATA");
        setLoading(false);
      }
    });
    setLoading(true);
    getYearlyAnalysis(
      baseUrl +
        "/analytics/orders/year" +
        (selectStore !== "all" ? "?store_id=" + selectStore : "")
    ).then((data) => {
      if (data) {
        if (data.error || data.detail) {
          console.log("Error", data.err);
          setLoading(false);
        } else {
          console.log("Success", data);
          setYearlyAnalysis(data);
          setLoading(false);
        }
      } else {
        console.log("No DATA");
        setLoading(false);
      }
    });
  }, [selectStore]);
  return (
    <div>
      <div className="md:flex md:justify-end pb-2">
        <FormControl className="w-72" variant="outlined">
          <Select
            labelId="gender-err"
            id="gender"
            name="gender"
            value={selectStore}
            onChange={({ target }) => setSelectStore(target.value)}
          >
            <MenuItem value="all">All stores</MenuItem>
            {allStores.map((store, index) => (
              <MenuItem key={index} value={store.id}>
                {store.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <HashLoader color={"FF0000"} loading={loading} size={150} />
        </div>
      ) : (
        <div className="flex flex-col md:flex-row">
          <div className="flex-auto overflow-x-hidden bg-white shadow-lg rounded-lg p-2">
            {!orderAna ? (
              <div className="flex items-center justify-center h-screen">
                <HashLoader color={"FF0000"} loading={loading} size={150} />
              </div>
            ) : (
              <div>
                <div>
                  <Doughnut
                    width={350}
                    height={350}
                    options={{
                      maintainAspectRatio: false,
                    }}
                    data={{
                      labels: orderAna.category,
                      datasets: [
                        {
                          label: "Number of Orders",
                          data: orderAna.orders,
                          backgroundColor: [
                            "rgb(255, 99, 132)",
                            "rgb(54, 162, 235)",
                            "rgb(255, 205, 86)",
                            "rgb(255, 205, 16)",
                          ],
                          hoverOffset: 4,
                        },
                      ],
                    }}
                  />
                </div>
                <span className="block text-center font-bold text-2xl">
                  Percentage Of Orders In Each Category
                </span>
              </div>
            )}
          </div>
          <div className="flex-auto overflow-x-hidden bg-white shadow-lg rounded-lg p-2 mx-4">
            {!monthlyAna && !yearlyAna ? (
              <div className="flex items-center justify-center h-screen">
                <HashLoader color="FF0000" loading={loading} size={150} />
              </div>
            ) : (
              <div>
                <div>
                  <Line
                    options={{
                      maintainAspectRatio: false,
                    }}
                    data={{
                      labels: monthlyAna.months,
                      datasets: [
                        {
                          label: "Monthly Orders",
                          data: monthlyAna.orders,
                          fill: false,
                          borderColor: "rgb(75, 192, 192)",
                          tension: 0.1,
                        },
                        {
                          label: "Yearly Orders",
                          data: yearlyAna.orders,
                          borderColor: "red",
                        },
                      ],
                      options: {
                        scales: {
                          y: {
                            stacked: true,
                          },
                        },
                      },
                    }}
                    height={350}
                  />
                </div>
                <span className="block text-center font-bold text-2xl">
                  Monthly and Yearly Orders
                </span>
              </div>
            )}
          </div>
          <div className="flex-auto overflow-x-hidden bg-white shadow-lg rounded-lg p-2">
            {!rating ? (
              <div className="flex items-center justify-center h-screen">
                <HashLoader color="FF0000" loading={loading} size={150} />
              </div>
            ) : (
              <div>
                <div>
                  <Bar
                    options={{
                      maintainAspectRatio: false,
                    }}
                    data={{
                      labels: rating.category,
                      datasets: [
                        {
                          label: "Categories Average Rating",
                          data: rating.ratings,
                          fill: true,
                          borderColor: "red",
                          tension: 0.1,
                        },
                      ],
                      options: {
                        scales: {
                          y: {
                            stacked: true,
                          },
                        },
                      },
                    }}
                    height={350}
                  />
                </div>
                <span className="block text-center font-bold text-2xl">
                  Categories Average Rating
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardCharts;
