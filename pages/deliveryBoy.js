import { useState, useEffect } from "react";
import Head from "next/head";
import DeliveryBoyContent from "../components/DeliveryBoyContent";
import DashBoardContainer from "../components/DashBoardContainer";
import addDeliveryBoys from "../pages/api/POST/AddDeliveryBoy";
import { HashLoader } from "react-spinners/HashLoader";
import { requiresAuthentication } from "../functions";
import updateBoy from "./api/PATCH/updateBoy";
import swal from "sweetalert";
import getAllStores from "./api/GET/GetAllStores";
import { FormControl, MenuItem, TextField } from "@material-ui/core";

const DeliveryBoy = () => {
  const [baseUrl] = useState("https://immense-castle-52645.herokuapp.com");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [itemID, setItemID] = useState(1);
  const [isUpdate, setIsUpdate] = useState(false);
  const [apiError, setApiError] = useState("");
  const [stores, setStores] = useState([]);
  const [data, setData] = useState({
    id:"",
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
      id:"",
      name: "",
      mobile: "",
      username: "",
      email: "",
      store_id: "",
      password: "",
      other_mobiles: "",
    });
    setShowModal(true);
  };
  const handleUpdate = (
    data
  ) => {
    setData(data);
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
    setData({ ...data, [name]: event.target.value.toString() });
  };
  const handleSubmit = (ev) => {
    ev.preventDefault();
    setLoading(true);
    if (!name || !mobile || !username || !password || !email || !store_id) {
      setApiError("Please Fill All The Required Fields");
      setLoading(false);
      return;
    }
    addDeliveryBoys(data, baseUrl + "/admin/deliveryboy/").then((data) => {
      if (data) {
        if (data.error || data.detail) {
          console.log("Error", data.err);
          setLoading(false);
          setApiError(JSON.stringify(data.error) || JSON.stringify(data.detail));
        } else {
          swal({
            title: "Delivery Boy Added Successfully!!",
            button: "OK",
            icon: "success",
            timer: 2000,
          });
          setLoading(false);
          setShowModal(false);
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
    updateBoy(baseUrl + "/admin/deliveryboy/" + data.id,data).then(
      (data) => {
        if (data) {
          if (data.error || data.detail) {
            console.log("Error", data.err);
            setLoading(false);
            setApiError(data.error || data.detail);
          } else {
            swal({
              title: "Delivery Boy Updated Successfully!!",
              button: "OK",
              icon: "success",
              timer: 2000,
            });
            setLoading(false);
            setShowModal(false);
          }
        } else {
          setApiError("We are experiencing some problems, please try again");
          console.log("No DATA");
          setLoading(false);
        }
      }
    );
  };
  useEffect(() => {
    getAllStores(baseUrl + "/stores/").then((data) => {
      if (data) {
        if (data.error || data.detail) {
          console.log("Error", data.err);
          setLoading(false);
        } else {
          console.log("Success", data);
          setStores(data);
        }
      } else {
        console.log("No DATA");
        setLoading(false);
      }
    });
  }, []);
  return (
    <>
      {loading ? (
        <div className="md:flex md:items-center md:justify-center md:h-screen">
          {/* <HashLoader color={"FF0000"} loading={loading} size={150} /> */}
        </div>
      ) : (
        <div>
          <Head>
            <title>Delivery Boy</title>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1.0"
            />
          </Head>
          <DashBoardContainer>
            <main className="md:flex-1 md:max-h-full md:pl-10 md:pr-10 md:pb-10 md:overflow-hidden md:overflow-y-auto">
              <div className="md:flex md:flex-row md:items-start md:justify-between md:pb-6 md:pt-10 md:space-y-4 md:space-y-0 md:m-5">
                <h1 className="md:text-2xl md:font-semibold md:whitespace-nowrap">
                  Delivery Boys
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
                          <div className="md:flex md:items-start md:justify-between md:p-5 md:border-solid md:border-red-200 md:rounded-t">
                            <h3 className="md:text-3xl md:font-semibold">
                              {isUpdate
                                ? "Update Delivery Boy"
                                : "Add Delivery Boy"}
                            </h3>
                          </div>
                          {/*body*/}
                          <p className="text-center text-red-600">{apiError||""}</p>

                          <form>
                            <div className="md:relative md:p-5 md:flex-auto">
                              <div className="md:mb-3 md:pt-0">
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
                              <span className="text-red-600">
                                {ERRusername}
                              </span>
                              <div className="md:mb-5 md:pt-0">
                                <input
                                  name="email"
                                  value={data.email}
                                  onBlur={({ target }) =>
                                    target.value.length < 3 &&
                                    target.value.includes("@freshchoice.com") &&
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
                              <div className="md:mb-3 md:pt-0">
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
                              <span className="text-red-600">
                                {ERRpassword}
                              </span>
                              <div className="md:mb-3 md:pt-1">
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
                              <span className="text-red-600">
                                {ERRstore_id}
                              </span>
                              <div className="md:mb-3 md:pt-0">
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
                          <div className="md:flex md:items-center md:justify-end md:p-6 md:border-t md:border-solid md:border-red-200 md:rounded-b">
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
                                  ERRemail ||
                                  ERRstore_id ||
                                  ERRname ||
                                  ERRmobile ||
                                  ERRpassword ||
                                  ERRusername ||
                                  ERRother_mobiles
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
              <DeliveryBoyContent
                getItem={(id) => setItemID(id)}
                handler={(data) =>
                  handleUpdate(data)
                }
              />
            </main>
          </DashBoardContainer>
        </div>
      )}
    </>
  );
};

export const getServerSideProps = requiresAuthentication((ctx) => {
  return {
    props: {},
  };
});

export default DeliveryBoy;
