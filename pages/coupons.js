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

const Coupons = () => {
  const [baseUrl] = useState("https://immense-castle-52645.herokuapp.com");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [itemID, setItemID] = useState(1);
  const [isUpdate, setIsUpdate] = useState(false);
  const [apiError, setApiError] = useState("");
  const [stores, setStores] = useState([]);

  const [data, setData] = useState({
    store_id: "",
    description: "",
    min_eligible_amount:"",
    max_discount:"",
    code: "",
    deduction: "",
    success: false,
  });
  const [error, setError] = useState({
    ERRstore_id: false,
    ERRdescription:false,
    ERRcode: false,
    ERRdeduction: false,
    ERRmin_eligible_amount: false,
    ERRmax_discount: false,
  });
  const { ERRcode, ERRdeduction,ERRstore_id,ERRdescription,ERRmin_eligible_amount,ERRmax_discount  } = error;

  const handleBlur = (name) => (event) => {
    let simplifiedName = name.replace("ERR", "");
    console.log(simplifiedName, data[simplifiedName]);
    setError({ ...error, [name]: data[simplifiedName] ? true : false });
  };
  const { store_id,code, deduction,description,min_eligible_amount,max_discount, success } = data;

  const InitAddItem = () => {
    setIsUpdate(false);
    setData({ ...data,store_id:"",description:"",min_eligible_amount:"",max_discount:"",code: "", deduction: "" });
    setShowModal(true);
  };

  const handleUpdate = (store_id,description,min_eligible_amount,max_discount,code, deduction) => {
    setData({ ...data,store_id,description,min_eligible_amount,max_discount,code, deduction: parseFloat(deduction) });
    setShowModal(true);
    setIsUpdate(true);
  };

  const handleChange = (name) => (event) => {
    setError({ ...error, ["ERR" + name]: "" });
    setData({ ...data, [name]: event.target.value });
  };
  const handleSubmit = (ev) => {
    ev.preventDefault();
    setLoading(true);
    if ( !store_id || !description||!min_eligible_amount || !max_discount || !code || !deduction) {
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

  const updateItem = (ev) => {
    ev.preventDefault();
    setLoading(true);
    updateCoupons(
      { store_id, description,min_eligible_amount,max_discount,code, deduction: parseFloat(deduction) },
      baseUrl + "/coupon/" + itemID
    ).then((data) => {
      if (data) {
        if (data.error || data.detail) {
          console.log("Error", data.err);
          setLoading(false);
          setApiError(data.error || data.detail);
        } else {
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
          <HashLoader color={"FF0000"} loading={loading} size={150} />
        </div>
      ) : (
        <div>
          <Head>
            <title>Coupons</title>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1.0"
            />
          </Head>
          <DashBoardContainer>
            <main className="md:flex-1 md:max-h-full md:pl-10 md:pr-10 md:pb-10 md:overflow-hidden md:overflow-y-auto">
              <div className="md:flex md:flex-row md:items-start md:justify-between md:pb-6 md:pt-10 md:space-y-4  md:items-center md:space-y-0 md:flex-row md:m-5">
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
                          <div className="md:flex md:items-start md:justify-between md:p-4  md:border-solid md:border-red-200 md:rounded-t">
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
                              <span className="text-red-600">
                                {ERRstore_id}
                              </span>
                              <div class="md:mb-2 md:pt-0">
                                <input
                                  name="code"
                                  value={data.code}
                                  onBlur={({ target }) =>
                                    !target.value.length &&
                                    setError({
                                      ...error,
                                      ERRcode:
                                        "Coupon Code should not be empty",
                                    })
                                  }
                                  onChange={handleChange("code")}
                                  type="text"
                                  placeholder="Coupon Code"
                                  class="md:px-5 md:py-5 md:placeholder-black md:text-black md:relative md:bg-white md:rounded md:text-sm md:shadow md:outline-none focus:outline-none focus:shadow-outline md:w-full"
                                />
                              </div>
                              <span className="text-red-600">{ERRcode}</span>
                              <div class="md:mb-2 md:pt-0">
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
                                  class="md:px-5 md:py-5 md:placeholder-black md:text-black md:relative md:bg-white md:rounded md:text-sm md:shadow md:outline-none focus:outline-none focus:shadow-outline md:w-full"
                                />
                              </div>
                              <span className="text-red-600">{ERRdescription}</span>
                              <div class="md:mb-5 md:pt-0">
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
                                  placeholder="Deduction Price"
                                  class="md:px-5 md:py-5 md:placeholder-black md:text-black md:relative md:bg-white md:rounded md:text-sm md:shadow md:outline-none focus:outline-none focus:shadow-outline md:w-full"
                                />
                              </div>
                              <span className="text-red-600">
                                {ERRdeduction}
                              </span>
                              <div class="md:mb-2 md:pt-0">
                                <input
                                  name="min_eligible_amount"
                                  value={data.min_eligible_amount}
                                  onBlur={({ target }) =>
                                    !target.value.length &&
                                    setError({
                                      ...error,
                                      ERRmin_eligible_amount:
                                        "Min. Eligible Amt. should not be empty",
                                    })
                                  }
                                  onChange={handleChange("min_eligible_amount")}
                                  type="number"
                                  placeholder="Minimum Eligible Amount"
                                  class="md:px-5 md:py-5 md:placeholder-black md:text-black md:relative md:bg-white md:rounded md:text-sm md:shadow md:outline-none focus:outline-none focus:shadow-outline md:w-full"
                                />
                              </div>
                              <span className="text-red-600">{ERRmin_eligible_amount}</span>
                              <div class="md:mb-2 md:pt-0">
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
                                  placeholder="Maximum Discount"
                                  class="md:px-5 md:py-5 md:placeholder-black md:text-black md:relative md:bg-white md:rounded md:text-sm md:shadow md:outline-none focus:outline-none focus:shadow-outline md:w-full"
                                />
                              </div>
                              <span className="text-red-600">{ERRmax_discount}</span>
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
                                  ERRdescription || ERRmax_discount || ERRmin_eligible_amount || ERRstore_id || ERRcode || ERRdeduction ? true : false
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
                getItem={(id) => setItemID(id)}
                handler={(description,min_eligible_amount,max_discount,store_id ,code, deduction) => handleUpdate(code, deduction)}
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

export default Coupons;
