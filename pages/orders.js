import Head from "next/head";
import DashBoardContainer from "../components/DashBoardContainer";
import ManageOrdersContent from "../components/ManageOrdersContent";
import { useEffect, useState } from "react";
import {
  formatNumber,
  getCurrentMonth,
  requiresAuthentication,
} from "../functions";
import HashLoader from "react-spinners/HashLoader";
import {
  Box,
  FormControl,
  MenuItem,
  Select,
  Typography,
  Button,
} from "@material-ui/core";
import getAllOrders from "./api/GET/GetAllOrders";
import { InputLabel } from "@material-ui/core";
import { baseUrl } from "../constants";
import getAllStores from "./api/GET/GetAllStores";
import { Modal } from "@material-ui/core";

const Orders = () => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [stores, setStores] = useState([]);
  const [grandTotal, setGrandTotal] = useState("");
  const [filterTimeline, setFilterTimeline] = useState({
    date: "",
    month: "",
    year: "",
    store: "",
  });
  const [filterTypeCollection, setFilterTypeCollection] = useState({
    date: [],
    month: [],
    year: [],
    store: [],
  });
  useEffect(() => {
    fetchOrders();
    getAllStores(baseUrl + "/stores/").then((data) => {
      setStores(data);
    });
    sortByDate(new Date().getDate());
    getTotal(filtered);
  }, []);

  useEffect(() => getTotal(filtered), [filtered]);

  const fetchOrders = () => {
    getAllOrders(baseUrl + "/order/").then((data) => {
      if (data) {
        if (data.error || data.detail) {
          ``;
          console.log("Error", data.err);
          setLoading(false);
        } else {
          console.log("Success", data);
          const filteredData = data.filter((item) => {
            const date = new Date(item.time);
            return date.getDate() === new Date().getDate();
          });
          // alert(JSON.stringify(filteredData));
          setUserData(data);
          const finalTypes = {
            date: [],
            month: [],
            year: [],
          };
          data.map((item) => {
            const date = new Date(item.time);
            const filterTypeDate = {
              value: date.getDate(),
              label: date.toDateString(),
            };
            console.log("MONTH", getCurrentMonth(date.getMonth()));
            const filterTypeMonth = {
              value: date.getMonth(),
              label: getCurrentMonth(date.getMonth()),
            };
            const filterTypeYear = {
              value: date.getFullYear(),
              label: date.getFullYear(),
            };
            if (
              !finalTypes.date.find(
                (type) => type.label === filterTypeDate.label
              )
            ) {
              finalTypes.date.push(filterTypeDate);
            }
            if (
              !finalTypes.month.find(
                (type) => type.label === filterTypeMonth.label
              )
            ) {
              finalTypes.month.push(filterTypeMonth);
            }
            if (
              !finalTypes.year.find(
                (type) => type.label === filterTypeYear.label
              )
            ) {
              finalTypes.year.push(filterTypeYear);
            }
          });
          setFilterTypeCollection({
            ...filterTypeCollection,
            date: finalTypes.date,
            month: finalTypes.month,
            year: finalTypes.year,
          });
          setLoading(false);
        }
      } else {
        console.log("No DATA");
        setLoading(false);
      }
    });
  };
  const sortByDate = (currentDate) => {
    const filteredData = userData.filter((item) => {
      const date = new Date(item.time);
      console.log(date.getDate(), currentDate);
      return date.getDate() === currentDate;
    });
    setFiltered(filteredData);
    setFilterTimeline({
      ...filterTimeline,
      year: "",
      month: "",
      date: currentDate,
      store: "",
    });
    getTotal(filteredData);
  };
  const sortByMonth = (currentMonth) => {
    const filteredData = userData.filter((item) => {
      const date = new Date(item.time);
      return date.getMonth() === currentMonth;
    });
    setFiltered(filteredData);
    setFilterTimeline({
      ...filterTimeline,
      date: "",
      year: "",
      month: currentMonth,
      store: "",
    });
    getTotal(filteredData);
  };
  const sortByYear = (currentYear) => {
    const filteredData = userData.filter((item) => {
      const date = new Date(item.time);
      return date.getFullYear() === currentYear;
    });
    setFiltered(filteredData);
    setFilterTimeline({
      ...filterTimeline,
      date: "",
      month: "",
      year: currentYear,
      store: "",
    });
    getTotal(filteredData);
  };
  const sortByStore = (currentStore) => {
    const filteredData = userData.filter((item) => {
      return item.store_id === currentStore;
    });
    setFiltered(filteredData);
    setFilterTimeline({
      ...filterTimeline,
      date: "",
      month: "",
      year: "",
      store: currentStore,
    });
    getTotal(filteredData);
  };
  const getTotal = (filteredData) => {
    let total = 0;
    filteredData.map((item) => {
      total = total + item.total;
    });
    setGrandTotal(total);
  };
  const resetFilters = () => {
    setFilterTimeline({
      ...filterTimeline,
      date: "",
      month: "",
      year: "",
      store: "",
    });
    setFiltered(userData);
    getTotal(userData);
  };
  console.log(stores);
  return (
    <>
      <Head>
        <title>Orders</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <DashBoardContainer>
        <Modal open={loading} className=" flex justify-center items-center">
          <HashLoader color={"FF0000"} loading={loading} size={150} />
        </Modal>
        <main className="md:flex-1 md:max-h-full md:pl-10 md:pr-10 md:pb-10 md:overflow-hidden md:overflow-y-auto">
          <div className="md:flex md:flex-row md:items-start md:justify-between md:pb-6 md:pt-10 md:space-y-4  md:items-center md:space-y-0 md:flex-row md:m-5">
            <h1 className="md:text-2xl md:font-semibold md:whitespace-nowrap">
              Manage Orders
            </h1>
          </div>
          {(!!filterTimeline.month ||
            !!filterTimeline.year ||
            !!filterTimeline.store ||
            !!filterTimeline.date) && (
            <button
              className="bg-red-700 mb-4 text-white p-2 rounded-sm"
              variant="contained"
              onClick={resetFilters}
            >
              View All Orders
            </button>
          )}
          <div className="flex flex-row justify-between my-3" style={{position:'relative'}}>
            <div className="w-full mr-12" style={{position:'relative'}}>
              <FormControl fullWidth style={{position:'relative'}}>
                <InputLabel id="sortByDate-label">Filter By Date</InputLabel>
                <Select
                 style={{position:'relative'}}
                  labelId="sortByDate-label"
                  id="sortByDate"
                  onChange={(ev) => {
                    sortByDate(ev.target.value);
                  }}
                  value={filterTimeline.date}
                >
                  <MenuItem value={new Date().getDate()}>Today</MenuItem>
                  {filterTypeCollection.date.map(
                    (item, index) =>
                      item.value !== new Date().getDate() && (
                        <MenuItem key={index} value={item.value}>
                          {item.label}
                        </MenuItem>
                      )
                  )}
                </Select>
              </FormControl>
            </div>
            <div className="w-full mx-12" style={{height:'auto'}}>
              <FormControl fullWidth>
                <InputLabel id="sortByMonthLabel">Filter By Month</InputLabel>
                <Select
                  fullWidth
                  labelId="sortByMonthLabel"
                  onChange={(ev) => {
                    sortByMonth(ev.target.value);
                  }}
                  value={filterTimeline.month}
                >
                  <MenuItem value={new Date().getMonth()}>This Month</MenuItem>
                  {filterTypeCollection.month.map(
                    (item, index) =>
                      item.value !== new Date().getMonth() && (
                        <MenuItem key={index} value={item.value}>
                          {item.label}
                        </MenuItem>
                      )
                  )}
                </Select>
              </FormControl>
            </div>
            <div className="w-full mx-12" style={{height:'auto'}}>
              <FormControl fullWidth>
                <InputLabel id="sortByYearLabel">Filter By Year</InputLabel>
                <Select
                  fullWidth
                  labelId="sortByYearLabel"
                  onChange={(ev) => {
                    sortByYear(ev.target.value);
                  }}
                  value={filterTimeline.year}
                >
                  <MenuItem value={new Date().getFullYear()}>
                    This Year
                  </MenuItem>
                  {filterTypeCollection.year.map(
                    (item, index) =>
                      item.value !== new Date().getFullYear() && (
                        <MenuItem key={index} value={item.value}>
                          {item.label}
                        </MenuItem>
                      )
                  )}
                </Select>
              </FormControl>
            </div>
            <div className="w-full mx-12" style={{height:'auto'}}>
              <FormControl fullWidth>
                <InputLabel id="sortByStoresLabel">Filter By Stores</InputLabel>
                <Select
                  fullWidth
                  labelId="sortByStoresLabel"
                  onChange={(ev) => {
                    sortByStore(ev.target.value);
                  }}
                  value={filterTimeline.store}
                >
                  {stores.map((item, index) => (
                    <MenuItem key={index} value={item.id}>
                      {item.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </div>
          {!!grandTotal && typeof grandTotal === "number" && (
            <div className="my-4">
              <Typography variant="h5" component="span">
                Total:
                <Typography variant="h4" color="secondary" component="span">
                  {" "}
                  {formatNumber(grandTotal)}
                </Typography>
              </Typography>
            </div>
          )}
          {filtered && (
            <ManageOrdersContent
              data={filtered}
              fetchOrders={fetchOrders}
              isLoading={loading}
              resetFilters={resetFilters}
            />
          )}
        </main>
      </DashBoardContainer>
    </>
  );
};

export default Orders;
