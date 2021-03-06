import { useEffect, useState } from "react";
import Head from "next/head";
import NotifsContent from "../components/NotifsContent";
import DashBoardContainer from "../components/DashBoardContainer";
import addNotifications from "../pages/api/POST/AddNotifs";
import HashLoader from "react-spinners/HashLoader";
import { requiresAuthentication } from "../functions";
import swal from "sweetalert";
import { baseUrl } from "../constants";
import getAllStores from "./api/GET/GetAllStores";
import { FormControl } from "@material-ui/core";
import { TextField } from "@material-ui/core";
import { MenuItem } from "@material-ui/core";
import { Modal } from "@material-ui/core";

const Notification = () => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [stores, setStores] = useState([]);
  const [data, setData] = useState({
    title: "",
    description: "",
    datetime: new Date(),
    to: `store_${0}`,
    type: "customer",
    success: false,
  });
  const [error, setError] = useState({
    ERRtitle: true,
    ERRdescription: false,
    ERRto: false,
    ERRtype: false,
  });
  const { ERRtitle, ERRdescription, ERRto, ERRtype } = error;
  useEffect(() => {
    getAllStores(baseUrl + "/stores/").then((res) => {
      if (res) {
        if (res.error || res.detail) {
          console.log("Error", res.err);
          setLoading(false);
        } else {
          console.log("Success", res);
          setData({ ...data, to: res[0].id });
          setStores(res);
        }
      } else {
        console.log("No DATA");
        setLoading(false);
      }
    });
  }, []);
  const handleBlur = (name) => (event) => {
    let simplifiedName = name.replace("ERR", "");
    console.log(simplifiedName, data[simplifiedName]);
    setError({ ...error, [name]: data[simplifiedName] ? true : false });
  };
  const { title, description, success, to, type, datetime } = data;

  const handleChange = (name) => (event) => {
    setError({ ...error, ["ERR" + name]: "" });
    setData({ ...data, [name]: event.target.value });
    console.log(data);
  };
  const handleSubmit = (ev) => {
    ev.preventDefault();
    setLoading(true);
    if (!title || !description) {
      setApiError("Please Fill All The Required Fields");
      setLoading(false);
      return;
    }
    addNotifications(
      { title, description, to: `store_${to}`, datetime },
      baseUrl + "/notifications/topic?app=" + type
    ).then((data) => {
      if ((data !== null && data?.error) || data?.detail) {
        console.log("Error", data.err);
        setLoading(false);
        setApiError(data.error || data.detail);
      } else {
        setShowModal(false);
        swal({
          title: "Notification Added Successfully!!",
          confirmButtonText: "OK",
          animation: true,
          icon: "success",
          timer: 2000,
        });
        setLoading(false);
      }
    });
  };

  return (
    <>
      <div>
        <Head>
          <title>Notifications</title>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
        </Head>
        <DashBoardContainer>
          <Modal open={loading} className=" flex justify-center items-center">
            <HashLoader color={"FF0000"} loading={loading} size={150} />
          </Modal>
          <main className="md:flex-1 md:max-h-full md:pl-10 md:pr-10 md:pb-10 md:overflow-hidden md:overflow-y-auto">
            <div className="md:flex md:justify-between md:pb-6 md:pt-10 md:space-y-4  md:items-start md:space-y-0 md:flex-col md:m-5">
              <h1 className="md:text-2xl md:font-semibold md:whitespace-nowrap">
                Notifications
              </h1>
              <p className="py-3">
                Notifications are sent to the customer only.
              </p>
              <button
                className="md:bg-red-700 md:text-white active:bg-red-600 md:font-bold md:uppercase md:text-sm md:px-6 md:py-3 md:rounded md:shadow hover:shadow-lg md:outline-none focus:outline-none md:mr-1 md:mb-1 md:ease-linear md:transition-all md:duration-150"
                type="button"
                onClick={() => setShowModal(true)}
              >
                Add
              </button>
              {showModal ? (
                <>
                  <div className="md:justify-center md:items-center md:flex md:overflow-x-hidden md:overflow-y-auto md:fixed md:inset-0 md:z-50 md:outline-none focus:outline-none">
                    <div className="md:relative md:w-auto md:my-3 md:mx-auto md:max-w-sm">
                      {/*content*/}
                      <div
                        className={`md:border-0 md:rounded-lg md:shadow-lg md:relative md:flex md:flex-col md:w-full md:bg-white md:outline-none focus:outline-none ${
                          apiError && "border-2 border-red-600"
                        }`}
                      >
                        {/*header*/}
                        <div className="md:flex md:items-start md:justify-between md:p-5  md:border-solid md:border-red-200 md:rounded-t">
                          <h3 className="md:text-3xl md:font-semibold">
                            Add Notification
                          </h3>
                        </div>
                        {/*body*/}
                        <p className="text-center text-red-600">{apiError}</p>

                        <form>
                          <div className="md:relative md:p-5 md:flex-auto">
                            <div className="md:mb-3 md:pt-0">
                              <input
                                name="title"
                                onBlur={({ target }) =>
                                  !target.value.length &&
                                  setError({
                                    ...error,
                                    ERRtitle:
                                      "Title should be greater than 3 Characters",
                                  })
                                }
                                onChange={handleChange("title")}
                                type="text"
                                placeholder="Title"
                                className="md:px-5 md:py-5 md:placeholder-black md:text-black md:relative md:bg-white bg-white md:rounded md:text-sm md:shadow md:outline-none focus:outline-none focus:shadow-outline md:w-full"
                              />
                            </div>
                            <span className="text-red-600">{ERRtitle}</span>
                            <div className="md:mb-3 md:pt-0">
                              <input
                                name="description"
                                onBlur={({ target }) =>
                                  target.value < 3 &&
                                  setError({
                                    ...error,
                                    ERRdescription:
                                      "Description should be greater than 3 Characters",
                                  })
                                }
                                onChange={handleChange("description")}
                                type="text"
                                placeholder="Description"
                                className="md:px-5 md:py-5 md:placeholder-black md:text-black md:relative md:bg-white bg-white md:rounded md:text-sm md:shadow md:outline-none focus:outline-none focus:shadow-outline md:w-full"
                              />
                            </div>
                            <span className="text-red-600">
                              {ERRdescription}
                            </span>

                            <div className="md:mb-3 md:pt-1">
                              <label>From Store</label>
                              <FormControl
                                size="small"
                                fullWidth
                                className="w-full"
                                variant="outlined"
                              >
                                <TextField
                                  size="small"
                                  name="to"
                                  value={
                                    stores.find((item) => item.id === data.to)
                                      ?.id || ""
                                  }
                                  onBlur={({ target }) =>
                                    !target.value &&
                                    setError({
                                      ...error,
                                      ERRto: "Store Name should not be empty",
                                    })
                                  }
                                  onChange={handleChange("to")}
                                  id="outlined-basic"
                                  label="Store"
                                  variant="outlined"
                                  select
                                >
                                  {!stores ? (
                                    <div className="md:flex md:items-center md:justify-center md:h-screen">
                                      <HashLoader
                                        color={"FF0000"}
                                        loading={loading}
                                        size={150}
                                      />
                                    </div>
                                  ) : (
                                    stores.map((items, key) => (
                                      <MenuItem value={items.id} key={key}>
                                        {items.title}
                                      </MenuItem>
                                    ))
                                  )}
                                </TextField>
                              </FormControl>
                            </div>
                            <span className="text-red-600">{ERRto}</span>

                            {/* <div className="md:mb-3 md:pt-1">
                                <label>Send the notification to:</label>
                                <FormControl
                                  size="small"
                                  fullWidth
                                  className="w-full"
                                  variant="outlined"
                                >
                                  <TextField
                                    size="small"
                                    name="type"
                                    value={type}
                                    onBlur={({ target }) =>
                                      !target.value &&
                                      setError({
                                        ...error,
                                        ERRtype:
                                          "Store Name should not be empty",
                                      })
                                    }
                                    onChange={handleChange("type")}
                                    id="outlined-basic"
                                    label="App"
                                    variant="outlined"
                                    select
                                  >
                                    <MenuItem value="customer">
                                      Customer
                                    </MenuItem>
                                    <MenuItem value="storemanager">
                                      Store Manager
                                    </MenuItem>
                                    <MenuItem value="deliveryboy">
                                      Delivery Boy
                                    </MenuItem>
                                  </TextField>
                                </FormControl>
                              </div> */}
                            <span className="text-red-600">{ERRto}</span>
                          </div>
                        </form>
                        {/*footer*/}
                        <div className="md:flex md:items-center md:justify-end md:p-6 md:border-t md:border-solid md:border-red-200 md:rounded-b">
                          <button
                            className="md:text-red-500 md:background-transparent md:font-bold md:uppercase md:px-6 md:py-2 md:text-sm md:outline-none focus:outline-none md:mr-1 md:mb-1 md:ease-linear md:transition-all md:duration-150"
                            type="button"
                            onClick={() => setShowModal(false)}
                          >
                            Close
                          </button>
                          <button
                            className="md:bg-red-700 disabled:opacity-50 md:text-white active:bg-red-600 md:font-bold md:uppercase md:text-sm md:px-6 md:py-3 md:rounded md:shadow hover:shadow-lg md:outline-none focus:outline-none md:mr-1 md:mb-1 md:ease-linear md:transition-all md:duration-150"
                            type="button"
                            onClick={handleSubmit}
                            disabled={
                              ERRtitle || ERRdescription || ERRto || ERRtype
                                ? true
                                : false
                            }
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="md:opacity-25 md:fixed md:inset-0 md:z-40 md:bg-black"></div>
                </>
              ) : null}
            </div>
            <NotifsContent />
          </main>
        </DashBoardContainer>
      </div>
    </>
  );
};

export default Notification;
