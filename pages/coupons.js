import { useState, useEffect } from "react";
import Head from "next/head";
import CouponContent from "../components/CouponContent";
import DashBoardContainer from "../components/DashBoardContainer";
import addCoupons from "../pages/api/POST/AddCoupons";
import HashLoader from "react-spinners/HashLoader";
import { requiresAuthentication } from "../functions";
import updateCoupons from "../pages/api/PATCH/updateCoupons";
import swal from "sweetalert";
import getAllStores from "./api/GET/GetAllStores";
import { FormControl, MenuItem, TextField } from "@material-ui/core";
import { baseUrl } from "../constants";
import { Modal } from "@material-ui/core";
import getAllCoupons from "./api/GET/GetCoupons";

const Coupons = () => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [itemID, setItemID] = useState(1);
  const [isUpdate, setIsUpdate] = useState(false);
  const [apiError, setApiError] = useState("");
  const [stores, setStores] = useState([]);
  const [userData, setUserData] = useState([]);

  const [data, setData] = useState({
    store_id: "",
    description: "",
    min_eligible_amount: "",
    max_discount: "",
    code: "",
    deduction: "",
    valid_from: "",
    valid_to: "",
    success: false,
    count: 0,
  });
  const [error, setError] = useState({
    ERRstore_id: false,
    ERRdescription: false,
    ERRcode: false,
    ERRdeduction: false,
    ERRmin_eligible_amount: false,
    ERRmax_discount: false,
    ERRvalid_from: false,
    ERRvalid_to: false,
    ERRcount: false,
  });
  const {
    ERRcode,
    ERRdeduction,
    ERRstore_id,
    ERRdescription,
    ERRmin_eligible_amount,
    ERRmax_discount,
    ERRvalid_from,
    ERRvalid_to,
  } = error;

  const handleBlur = (name) => (event) => {
    let simplifiedName = name.replace("ERR", "");
    console.log(simplifiedName, data[simplifiedName]);
    setError({ ...error, [name]: data[simplifiedName] ? true : false });
  };
  const {
    store_id,
    code,
    deduction,
    description,
    min_eligible_amount,
    max_discount,
    valid_from,
    valid_to,
    success,
    count,
  } = data;

  const InitAddItem = () => {
    setIsUpdate(false);
    setData({
      ...data,
      store_id: "",
      description: "",
      min_eligible_amount: "",
      max_discount: "",
      code: "",
      deduction: "",
      valid_from: "",
      valid_to: "",
      count: 0,
    });
    setShowModal(true);
  };

  const handleUpdate = ({
    store_id,
    description,
    min_eligible_amount,
    max_discount,
    code,
    deduction,
    valid_from,
    valid_to,
    count = 0,
    id,
  }) => {
    setData({
      ...data,
      store_id,
      description,
      min_eligible_amount,
      max_discount,
      code,
      valid_from,
      count: parseInt(count),
      valid_to,
      deduction: parseFloat(deduction),
      id,
    });
    setShowModal(true);
    setIsUpdate(true);
    console.log(data);
  };

  const handleChange = (name) => (event) => {
    if (name === "max_discount") {
      if (event.target.value > 0 && !(event.target.value < 100)) {
        setError({
          ...error,
          ERRmax_discount: "Max Discount should be less than 100",
        });
      } else {
        setError({ ...error, ERRmax_discount: "" });
      }
    }
    setData({ ...data, [name]: event.target.value });
    if (name !== "max_discount" && name !== "deduction") {
      setError({ ...error, ["ERR" + name]: "" });
    }
    console.log(name, event.target.value);
  };
  const handleSubmit = (ev) => {
    ev.preventDefault();
    setLoading(true);
    if (
      !store_id ||
      !description ||
      !min_eligible_amount ||
      !max_discount ||
      !code ||
      !deduction ||
      !valid_from ||
      !valid_to
    ) {
      setApiError("Please Fill All The Required Fields");
      setLoading(false);
      return;
    }

    addCoupons(data, baseUrl + "/coupon/").then((data) => {
      setLoading(true);
      if (data) {
        if (data.error || data.detail) {
          console.log("Error", data.err);
          setLoading(false);
          setApiError(data.error || data.detail);
        } else {
          getAllStoreCoupons();
          swal({
            title: "Coupon Code Added Successfully!!",
            confirmButtonText: "OK",
            animation: true,
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
  const getAllStoreCoupons = () => {
    getAllCoupons(baseUrl + "/coupon/").then((data) => {
      if (data) {
        if (data.error || data.detail) {
          console.log("Error", data.err);
          setLoading(false);
        } else {
          console.log("Success", data);
          setUserData(data);
          setLoading(false);
        }
      } else {
        console.log("No DATA");
        setLoading(false);
      }
    });
  };

  useEffect(() => getAllStoreCoupons(), []);

  const updateItem = (ev) => {
    ev.preventDefault();
    setLoading(true);
    setShowModal(false);
    updateCoupons(
      {
        store_id,
        description,
        min_eligible_amount,
        max_discount,
        code,
        valid_from,
        count: parseInt(count),
        valid_to,
        deduction: parseFloat(deduction),
      },
      baseUrl + "/coupon/" + data.id
    ).then((data) => {
      if (data) {
        if (data.error || data.detail) {
          console.log("Error", data.err);
          setLoading(false);
          setApiError(data.error || data.detail);
        } else {
          getAllStoreCoupons();
          swal({
            title: "Coupon Code Updated Successfully!!",
            confirmButtonText: "OK",
            animation: true,
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

  const getOffers = () => {
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
  };

  useEffect(() => {
    getOffers();
  }, []);

  return (
    <>
      <div>
        <Head>
          <title>Coupons</title>
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
            <div className="md:flex md:flex-row md:items-start md:justify-between md:pb-6 md:pt-10 md:space-y-4   md:space-y-0 md:m-5">
              <h1 className="md:text-2xl md:font-semibold md:whitespace-nowrap">
                Coupons
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
                        className={`md:border-0 md:rounded-lg md:shadow-lg md:relative md:flex md:flex-col md:w-full md:bg-white md:outline-none focus:outline-none${
                          apiError && "border-2 border-red-600"
                        }`}
                      >
                        {/*header*/}
                        <div className="md:flex md:items-start md:justify-between md:p-3  md:border-solid md:border-red-200 md:rounded-t">
                          <h3 className="md:text-3xl md:font-semibold">
                            {isUpdate ? "Update Coupon" : "Add Coupon"}
                          </h3>
                        </div>
                        {/*body*/}
                        <p className="text-center text-red-600">{apiError}</p>

                        <form>
                          <div className="md:relative md:p-3 md:flex-auto">
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
                            <span className="text-red-600">{ERRstore_id}</span>
                            <label className="block">Code</label>
                            <div className="md:mb-2 md:pt-0">
                              <input
                                name="code"
                                value={data.code}
                                onBlur={({ target }) =>
                                  !target.value.length &&
                                  setError({
                                    ...error,
                                    ERRcode: "Coupon Code should not be empty",
                                  })
                                }
                                onChange={handleChange("code")}
                                type="text"
                                placeholder="Coupon Code"
                                className="md:px-5 md:py-5 md:placeholder-black md:text-black md:relative md:bg-white md:rounded md:text-sm md:shadow md:outline-none focus:outline-none focus:shadow-outline md:w-full"
                              />
                            </div>
                            <span className="text-red-600">{ERRcode}</span>
                            <div className="md:mb-2 md:pt-0">
                              <label className="block">Description</label>
                              <input
                                name="description"
                                value={data.description}
                                onBlur={({ target }) =>
                                  !target.value.length &&
                                  setError({
                                    ...error,
                                    ERRdescription:
                                      "Coupon Description should not be empty",
                                  })
                                }
                                onChange={handleChange("description")}
                                type="text"
                                placeholder="Description"
                                className="md:px-5 md:py-5 md:placeholder-black md:text-black md:relative md:bg-white md:rounded md:text-sm md:shadow md:outline-none focus:outline-none focus:shadow-outline md:w-full"
                              />
                            </div>
                            <span className="text-red-600">
                              {ERRdescription}
                            </span>
                            <div className="md:mb-5 md:pt-0">
                              <label className="block">
                                Max Deduction Amount
                              </label>
                              <input
                                name="deduction"
                                value={data.deduction}
                                onBlur={({ target }) =>
                                  !target.value.length &&
                                  setError({
                                    ...error,
                                    ERRdeduction:
                                      "Deduction Cost should not be empty",
                                  })
                                }
                                onChange={handleChange("deduction")}
                                type="number"
                                placeholder="Deduction Amount"
                                className="md:px-5 md:py-5 md:placeholder-black md:text-black md:relative md:bg-white md:rounded md:text-sm md:shadow md:outline-none focus:outline-none focus:shadow-outline md:w-full"
                              />
                            </div>
                            <span className="text-red-600">{ERRdeduction}</span>
                            <div className="md:mb-2 md:pt-0">
                              <label className="block">
                                Min Eligible Amount
                              </label>
                              <input
                                name="min_eligible_amount"
                                value={data.min_eligible_amount}
                                onBlur={({ target }) =>
                                  !target.value.toString().length &&
                                  setError({
                                    ...error,
                                    ERRmin_eligible_amount:
                                      "Min. Eligible Amt. should not be empty",
                                  })
                                }
                                onChange={handleChange("min_eligible_amount")}
                                type="number"
                                placeholder="Minimum Eligible Amount"
                                className="md:px-5 md:py-5 md:placeholder-black md:text-black md:relative md:bg-white md:rounded md:text-sm md:shadow md:outline-none focus:outline-none focus:shadow-outline md:w-full"
                              />
                            </div>
                            <span className="text-red-600">
                              {ERRmin_eligible_amount}
                            </span>
                            <label className="block">
                              Discount in Percentage
                            </label>
                            <div className="md:mb-2 md:pt-0">
                              <input
                                name="max_discount"
                                value={data.max_discount}
                                onBlur={({ target }) =>
                                  !target.value.length &&
                                  setError({
                                    ...error,
                                    ERRmax_discount:
                                      "Maximum Discount should not be empty",
                                  })
                                }
                                onChange={handleChange("max_discount")}
                                type="number"
                                placeholder="Maximum Discount Percentage"
                                className="md:px-5 md:py-5 md:placeholder-black md:text-black md:relative md:bg-white md:rounded md:text-sm md:shadow md:outline-none focus:outline-none focus:shadow-outline md:w-full"
                              />
                            </div>
                            <span className="text-red-600">
                              {ERRmax_discount}
                            </span>
                            <label className="block">Valid From</label>
                            <div className="md:mb-2 md:pt-0">
                              <input
                                name="valid_from"
                                value={data.valid_from}
                                onBlur={({ target }) =>
                                  !target.value.length &&
                                  setError({
                                    ...error,
                                    ERRvalid_from:
                                      "Coupon Start Date should not be empty",
                                  })
                                }
                                onChange={handleChange("valid_from")}
                                type="datetime-local"
                                placeholder="Valid From"
                                className="md:px-5 md:py-5 md:placeholder-black md:text-black md:relative md:bg-white md:rounded md:text-sm md:shadow md:outline-none focus:outline-none focus:shadow-outline md:w-full"
                              />
                            </div>
                            <span className="text-red-600">
                              {ERRvalid_from}
                            </span>
                            <div className="md:mb-2 md:pt-0">
                              <label className="block">Valid To</label>
                              <input
                                name="valid_to"
                                value={data.valid_to}
                                onBlur={({ target }) =>
                                  !target.value.length &&
                                  setError({
                                    ...error,
                                    ERRvalid_to:
                                      "Coupon End Date should not be empty",
                                  })
                                }
                                onChange={handleChange("valid_to")}
                                type="datetime-local"
                                placeholder="Valid To"
                                className="md:px-5 md:py-5 md:placeholder-black md:text-black md:relative md:bg-white md:rounded md:text-sm md:shadow md:outline-none focus:outline-none focus:shadow-outline md:w-full"
                              />
                            </div>
                            <span className="text-red-600">{ERRvalid_to}</span>

                            <div className="md:mb-2 md:pt-0">
                              <label className="block">
                                Usage count per User
                              </label>
                              <input
                                name="min_eligible_amount"
                                value={data.count}
                                onChange={handleChange("count")}
                                type="number"
                                placeholder="Usage count per User"
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
                                ERRdescription ||
                                ERRmax_discount ||
                                ERRmin_eligible_amount ||
                                ERRstore_id ||
                                ERRcode ||
                                ERRdeduction
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
            <CouponContent
              coupons={userData}
              getItem={(id) => setItemID(id)}
              handler={({
                description,
                min_eligible_amount,
                max_discount,
                store_id,
                code,
                deduction,
                valid_from,
                valid_to,
                count,
                id,
              }) =>
                handleUpdate({
                  description,
                  min_eligible_amount,
                  max_discount,
                  store_id,
                  code,
                  deduction,
                  valid_from,
                  count,
                  valid_to,
                  id,
                })
              }
            />
          </main>
        </DashBoardContainer>
      </div>
    </>
  );
};

export default Coupons;
