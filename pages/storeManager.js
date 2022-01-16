import { useState, useEffect } from "react";
import Head from "next/head";
import StoreManagerContent from "../components/StoreManagerContent";
import DashBoardContainer from "../components/DashBoardContainer";
import addStoreManager from "../pages/api/POST/AddStoreManager";
import HashLoader from "react-spinners/HashLoader";
import { requiresAuthentication } from "../functions";
import updateManager from "../pages/api/PATCH/updateManager";
import swal from "sweetalert";
import getAllStores from "./api/GET/GetAllStores";
import { FormControl, MenuItem, TextField } from "@material-ui/core";
import { baseUrl } from "../constants";
import { Modal } from "@material-ui/core";
import getStoreManager from "./api/GET/GetStoreManager";

const StoreManager = () => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [itemID, setItemID] = useState(1);
  const [stores, setStores] = useState([]);
  const [isUpdate, setIsUpdate] = useState(false);
  const [userData, setUserData] = useState([]);
  const [apiError, setApiError] = useState("");
  const [data, setData] = useState({
    name: "",
    mobile: "",
    username: "",
    email: "",
    store_id: "",
    password: "",
    other_mobiles: "",
    success: false,
  });
  const InitAddItem = () => {
    setIsUpdate(false);
    setData({
      ...data,
      name: "",
      mobile: "",
      email: "",
      store_id: "",
      username: "",
      password: "",
      other_mobiles: "",
    });
    setShowModal(true);
  };
  const handleUpdate = ({
    name,
    mobile,
    username,
    email,
    store_id,
    password,
    other_mobiles,
  }) => {
    setData({
      ...data,
      name,
      mobile,
      username,
      email,
      store_id,
      password,
      other_mobiles,
    });
    setShowModal(true);
    setIsUpdate(true);
  };
  const [error, setError] = useState({
    ERRname: false,
    ERRmobile: false,
    ERRusername: false,
    ERRemail: false,
    ERRstore_id: false,
    ERRpassword: false,
    ERRother_mobiles: false,
  });
  const {
    ERRname,
    ERRmobile,
    ERRusername,
    ERRemail,
    ERRstore_id,
    ERRpassword,
    ERRother_mobiles,
  } = error;
  const handleBlur = (name) => (event) => {
    let simplifiedName = name.replace("ERR", "");
    console.log(simplifiedName, data[simplifiedName]);
    setError({ ...error, [name]: data[simplifiedName] ? true : false });
  };
  const {
    name,
    mobile,
    username,
    email,
    store_id,
    password,
    other_mobiles,
    success,
  } = data;
  const handleChange = (name) => (event) => {
    setError({ ...error, ["ERR" + name]: "" });
    setData({ ...data, [name]: event.target.value });
  };
  const handleSubmit = (ev) => {
    ev.preventDefault();
    setLoading(true);
    if (!name || !mobile || !username || !password || !email || !store_id) {
      setApiError("Please Fill All The Required Fields");
      setLoading(false);
      return;
    }
    addStoreManager(data, baseUrl + "/admin/storemanager/").then((data) => {
      if (data) {
        if (data.error || data.detail) {
          console.log("Error", data.err);
          setLoading(false);
          setApiError(data.error || data.detail);
        } else {
          swal({
            title: "Store Manager Added Successfully!!",
            button: "OK",
            icon: "success",
            timer: 2000,
          });
          setLoading(false);
          setShowModal(false);
          getAllStoreManagers();
        }
      } else {
        setApiError("We are experiencing some problems, please try again");
        console.log("No DATA");
        setLoading(false);
      }
    });
  };
  const updateItem = (ev) => {
    setLoading(true);
    ev.preventDefault();
    let query = "";
    //Send query parameters instead of request body
    Object.entries(data).map(
      (item) => (query = query + `${item[0]}=${item[1]}&`)
    );
    updateManager(baseUrl + "/admin/storemanager/" + itemID, data).then(
      (res) => {
        if (res) {
          if (res.error || res.detail) {
            console.log("Error", res.err);
            setLoading(false);
            setApiError(res.error || res.detail);
          } else {
            swal({
              title: "Store Manager Updated Successfully!!",
              button: "OK",
              icon: "success",
              timer: 2000,
            });
            setLoading(false);
            console.log(showModal);
            setShowModal(false);
            getAllStoreManagers();
          }
        } else {
          swal({
            title: "We are experiencing some problems, please try again",
            button: "OK",
            icon: "error",
            timer: 2000,
          });
          setShowModal(false);
          setApiError("We are experiencing some problems, please try again");
          console.log("No DATA");
          setLoading(false);
        }
      }
    );
  };
  const getAllStoreManagers = () => {
    getStoreManager(baseUrl + "/admin/storemanager/").then((data) => {
      if (data) {
        if (data.error || data.detail) {
          console.log("Error", data.err);
          setLoading(false);
        } else {
          console.log("Success", data);
          data.reverse();
          setUserData(data);
          setLoading(false);
        }
      } else {
        console.log("No DATA");
        setLoading(false);
      }
    });
  };
  useEffect(() => {
    getAllStores(baseUrl + "/stores/").then((data) => {
      if (data) {
        if (data.error || data.detail) {
          console.log("Error", data.err);
          setLoading(false);
        } else {
          console.log("Success", data);
          data.reverse();
          setStores(data);
        }
      } else {
        console.log("No DATA");
        setLoading(false);
      }
    });
    getAllStoreManagers();
  }, []);
  return (
    <>
      <div>
        <Head>
          <title>Store Manager</title>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
        </Head>
        <DashBoardContainer>
          <Modal open={loading} className="flex justify-center items-center">
            <HashLoader color={"FF0000"} loading={loading} size={150} />
          </Modal>
          <main className="md:flex-1 md:max-h-full md:pl-10 md:pr-10 md:pb-10 md:overflow-hidden md:overflow-y-auto">
            <div className="md:flex md:flex-row md:items-start md:justify-between md:pb-6 md:pt-10 md:space-y-4 md:space-y-0 md:m-5">
              <h1 className="md:text-2xl md:font-semibold md:whitespace-nowrap">
                Store Managers
              </h1>
              <button
                className="md:bg-red-700 md:text-white active:bg-red-600 md:font-bold md:uppercase md:text-sm md:px-6 md:py-3 md:rounded md:shadow hover:shadow-lg md:outline-none focus:outline-none md:mr-1 md:mb-1 md:ease-linear md:transition-all md:duration-150"
                type="button"
                onClick={InitAddItem}
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
                        <div className="md:flex md:items-start md:justify-between md:p-10 md:py-2  md:border-solid md:border-red-200 md:rounded-t">
                          <h3 className="md:text-3xl md:font-semibold">
                            {isUpdate
                              ? "Update Store Manager"
                              : "Add Store Manager"}
                          </h3>
                        </div>
                        {/*body*/}
                        <p className="text-center text-red-600">{apiError}</p>

                        <form>
                          <div className="md:relative md:p-5 md:flex-auto">
                            <div className="md:mb-3 md:pt-0">
                              <label>Name</label>
                              <input
                                name="name"
                                value={data.name}
                                onBlur={({ target }) =>
                                  !target.value.length &&
                                  setError({
                                    ...error,
                                    ERRname: "Name should not be empty",
                                  })
                                }
                                onChange={handleChange("name")}
                                type="text"
                                placeholder="Name"
                                className="md:px-5 md:py-5 md:placeholder-black md:text-black md:relative md:bg-white md:rounded md:text-sm md:shadow md:outline-none focus:outline-none focus:shadow-outline md:w-full"
                              />
                            </div>
                            <span className="text-red-600">{ERRname}</span>
                            <div className="md:mb-3 md:pt-0">
                              <label>Mobile</label>
                              <input
                                name="mobile"
                                value={data.mobile}
                                onBlur={({ target }) =>
                                  target.value.toString().length !== 10 &&
                                  setError({
                                    ...error,
                                    ERRmobile:
                                      "Mobile Number should be 10 digits",
                                  })
                                }
                                onChange={handleChange("mobile")}
                                type="number"
                                placeholder="Mobile Number"
                                className="md:px-5 md:py-5 md:placeholder-black md:text-black md:relative md:bg-white md:rounded md:text-sm md:shadow md:outline-none focus:outline-none focus:shadow-outline md:w-full"
                              />
                            </div>
                            <span className="text-red-600">{ERRmobile}</span>
                            <div className="md:mb-3 md:pt-0">
                              <label>Username</label>
                              <input
                                name="username"
                                value={data.username}
                                onBlur={({ target }) =>
                                  target.value.length < 3 &&
                                  setError({
                                    ...error,
                                    ERRusername:
                                      "Username should be more than 3 Characters",
                                  })
                                }
                                onChange={handleChange("username")}
                                type="text"
                                placeholder="Username"
                                className="md:px-5 md:py-5 md:placeholder-black md:text-black md:relative bg-white md:rounded md:text-sm md:shadow md:outline-none focus:outline-none focus:shadow-outline md:w-full"
                              />
                            </div>
                            <span className="text-red-600">{ERRusername}</span>
                            <div className="md:mb-5 md:pt-0">
                              <label>Email</label>
                              <input
                                name="email"
                                value={data.email}
                                onBlur={({ target }) =>
                                  target.value.length < 3 &&
                                  target.includes("@freshchoice.com") &&
                                  setError({
                                    ...error,
                                    ERRemail:
                                      "Email should be entered correctly.",
                                  })
                                }
                                onChange={handleChange("email")}
                                type="email"
                                placeholder="Email"
                                className="md:px-5 md:py-5 md:placeholder-black md:text-black md:relative md:bg-white bg-white md:rounded md:text-sm md:shadow md:outline-none focus:outline-none focus:shadow-outline md:w-full"
                              />
                            </div>
                            <span className="text-red-600">{ERRemail}</span>
                            {
                              <div className="md:mb-3 md:pt-0">
                                <label>Password</label>
                                <input
                                  name="password"
                                  value={data.password || ""}
                                  onBlur={({ target }) =>
                                    !target.value &&
                                    setError({
                                      ...error,
                                      ERRpassword:
                                        "Password should not be empty",
                                    })
                                  }
                                  onChange={handleChange("password")}
                                  type="password"
                                  placeholder="Password"
                                  className="md:px-5 md:py-5 md:placeholder-black md:text-black md:relative md:bg-white md:rounded md:text-sm md:shadow md:outline-none focus:outline-none focus:shadow-outline md:w-full"
                                />
                              </div>
                            }
                            <span className="text-red-600">{ERRpassword}</span>
                            <div className="md:mb-3 md:pt-1">
                              <label>Store Name</label>
                              <FormControl
                                size="small"
                                fullWidth
                                className="w-full"
                                variant="outlined"
                              >
                                <TextField
                                  size="small"
                                  name="store_id"
                                  value={
                                    stores.find(
                                      (item) =>
                                        item.title == data.store_id ||
                                        item.id == data.store_id
                                    )?.id || ""
                                  }
                                  onBlur={({ target }) =>
                                    !target.value &&
                                    setError({
                                      ...error,
                                      ERRstore_id:
                                        "Store Name should not be empty",
                                    })
                                  }
                                  onChange={handleChange("store_id")}
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
                            <span className="text-red-600">{ERRstore_id}</span>
                            <div className="md:mb-3 md:pt-0">
                              <label>Other Mobile Number</label>
                              <input
                                name="other_mobiles"
                                value={data.other_mobiles}
                                onBlur={({ target }) =>
                                  target.value != 10 &&
                                  setError({
                                    ...error,
                                    ERRother_mobile:
                                      "Mobile Number should be 10 digits",
                                  })
                                }
                                onChange={handleChange("other_mobiles")}
                                type="number"
                                placeholder="Other Mobiles"
                                className="md:px-5 md:py-5 md:placeholder-black md:text-black md:relative md:bg-white md:rounded md:text-sm md:shadow md:outline-none focus:outline-none focus:shadow-outline md:w-full"
                              />
                            </div>
                          </div>
                        </form>
                        {/*footer*/}
                        <div className="md:flex md:items-center md:justify-end md:p-3 md:border-t md:border-solid md:border-red-200 md:rounded-b">
                          <button
                            className="md:text-red-500 md:background-transparent md:font-bold md:uppercase md:px-6 md:py-2 md:text-sm md:outline-none focus:outline-none md:mr-1 md:mb-1 md:ease-linear md:transition-all md:duration-150"
                            type="button"
                            onClick={() => setShowModal(false)}
                          >
                            Close
                          </button>
                          {!isUpdate ? (
                            <button
                              className="md:button md:bg-red-700 disabled:opacity-50 md:text-white active:bg-red-600 md:font-bold md:uppercase md:text-sm md:px-6 md:py-3 md:rounded md:shadow hover:shadow-lg md:outline-none focus:outline-none md:mr-1 md:mb-1 md:ease-linear md:transition-all md:duration-150"
                              type="submit"
                              onClick={handleSubmit}
                              disabled={
                                ERRname ||
                                ERRmobile ||
                                ERRpassword ||
                                ERRusername ||
                                ERRstore_id
                                  ? true
                                  : false
                              }
                            >
                              Add
                            </button>
                          ) : (
                            <button
                              className="md:button md:bg-red-700 md:text-white active:bg-red-600 md:font-bold md:uppercase md:text-sm md:px-6 md:py-3 md:rounded md:shadow hover:shadow-lg md:outline-none focus:outline-none md:mr-1 md:mb-1 md:ease-linear md:transition-all md:duration-150"
                              type="submit"
                              onClick={updateItem}
                            >
                              Update
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="md:opacity-25 md:fixed md:inset-0 md:z-40 md:bg-black"></div>
                </>
              ) : null}
            </div>
            <StoreManagerContent
              getItem={(id) => setItemID(id)}
              managers={userData}
              handler={(
                name,
                mobile,
                username,
                email,
                password,
                other_mobiles,
                store_id
              ) =>
                handleUpdate(name, mobile, username, password, other_mobiles)
              }
            />
          </main>
        </DashBoardContainer>
      </div>
    </>
  );
};

export default StoreManager;
