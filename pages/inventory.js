import Head from "next/head";
import DashBoardContainer from "../components/DashBoardContainer";
import InventoryContent from "../components/InventoryContent";
import { useState, useEffect } from "react";
import addItems from "../pages/api/POST/AddItems";
import { FormControl, MenuItem, TextField } from "@material-ui/core";
import getAllCategories from "../pages/api/GET/GetAllCategories";
import HashLoader from "react-spinners/HashLoader";
import updateItems from "../pages/api/PATCH/updateItems";
import { requiresAuthentication } from "../functions";
import swal from "sweetalert";
import { Select } from "@material-ui/core";
import { getToken } from "../pages/api/apiRequests";

const Inventory = () => {
  const [baseUrl] = useState("https://immense-castle-52645.herokuapp.com");
  const [showModal, setShowModal] = useState(false);
  const [catData, setCatData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectStore, setSelectStore] = useState();
  const [allStores, setAllStores] = useState([]);
  const [itemID, setItemID] = useState(1);
  const [isUpdate, setIsUpdate] = useState(false);
  const [apiError, setApiError] = useState("");
  const [storeItems, setStoreItems] = useState([]);
  const [data, setData] = useState({
    item_id: "",
    store_id: "",
    quantity: "",
    offer_price: "",
  });

  const [error, setError] = useState({
    ERRitem_id: true,
    ERRquantity: false,
    ERRoffer_price: false,
    ERRstore_id: false,
  });

  const { ERRitem_id, ERRquantity, ERRoffer_price, ERRstore_id } = error;

  const InitAddItem = () => {
    setIsUpdate(false);
    setData({
      ...data,
      item_id: "",
      store_id: "",
      quantity: "",
      offer_price: "",
    });
    setShowModal(true);
  };

  const handleUpdate = (item) => {
    console.info(item);
    setData({
      ...data,
      item_id: parseInt(item.id),
      store_id: selectStore,
      quantity: parseInt(item.quantity),
      offer_price: parseFloat(item.offer_price),
    });
    setShowModal(true);
    setIsUpdate(true);
  };

  const handleBlur = (name) => (event) => {
    let simplifiedName = name.replace("ERR", "");
    setError({ ...error, [name]: data[simplifiedName] ? true : false });
  };

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
        .then((data) => {
          setSelectStore(data[0].id);
          setAllStores(data);
        });
    };
    getAllStores();
  }, []);

  useEffect(() => {
    let { user } = getToken();
    let { access_token } = JSON.parse(user);
    setLoading(true);
    const getAllStoresItems = async () => {
      console.log(typeof selectStore == "number", 157);
      !isNaN(selectStore) &&
        fetch(baseUrl + "/item/store/" + selectStore, {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        })
          .then((res) => {
            setLoading(false);
            return res.json();
          })
          .then((data) => {
            setStoreItems(data);
            // getFirstStore();
          })

          .catch((err) => console.info(err, selectStore));
    };
    getAllStoresItems();
  }, [selectStore]);

  useEffect(() => {
    getAllCategories(baseUrl + "/category/").then((data) => {
      if (data) {
        if (data.error || data.detail) {
          console.log("Error", data.err);
          setLoading(false);
        } else {
          console.log("Success", data);
          setCatData(data);
        }
      } else {
        console.log("No DATA");
        setLoading(false);
      }
    });
  }, []);
  const { item_id, store_id, quantity, offer_price } = data;

  const handleChange = (name) => (event) => {
    setError({ ...error, ["ERR" + name]: "" });
    console.info(name, event.target.value);
    setData({ ...data, [name]: event.target.value });
  };
  const handleSubmit = (ev) => {
    ev.preventDefault();
    setLoading(true);
    if ((!item_id, !store_id, !quantity, !offer_price)) {
      setApiError("Please Fill All The Required Fields");
      setLoading(false);
      return;
    }
    addItems(data, baseUrl + "/item/store/" + store_id).then((data) => {
      if (data) {
        if (data.error || data.detail) {
          console.log("Error", data.err);
          setLoading(false);
          setApiError(data.detail[0].msg);
        } else {
          swal({
            title: "Item Added Successfully!!",
            confirmButtonText: "OK",
            animation: true,
            icon: "success",
            timer: 2000,
          });
          setLoading(false);
          setShowModal(false);
          setSelectStore(store_id);
          window.location.reload();
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
    let { user } = getToken();
    let { access_token } = JSON.parse(user);
    setLoading(true);
    fetch(baseUrl + `/item/store/${selectStore}`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify({ item_id, offer_price }),
    }).then((data) => {
      if (data) {
        if (data.error || data.detail) {
          console.log("Error", data.err);
          setLoading(false);
          setApiError(data.error || data.detail);
        } else {
          swal({
            title: "Item Updated Successfully!!",
            confirmButtonText: "OK",
            animation: true,
            icon: "success",
            timer: 2000,
          });
          setLoading(false);
          window.location.reload();
          setShowModal(false);
        }
      } else {
        setApiError("We are experiencing some problems, please try again");
        console.log("No DATA");
        setLoading(false);
      }
    });
  };
  return (
    <>
      {loading ? (
        <div className="md:flex md:items-center md:justify-center md:h-screen">
          <HashLoader color={"FF0000"} loading={loading} size={150} />
        </div>
      ) : (
        <div>
          <Head>
            <title>Inventory</title>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1.0"
            />
          </Head>
          <DashBoardContainer>
            <main className="md:flex-1 md:max-h-full md:pl-10 md:pr-10 md:pb-10 md:overflow-hidden md:overflow-y-auto">
              <div className="md:flex md:flex-row md:items-start md:justify-between md:pb-6 md:pt-10 md:space-y-4 md:space-y-0  md:m-5">
                <h1 className="md:text-2xl md:font-semibold md:whitespace-nowrap md:text-black">
                  Inventory
                </h1>
                <div className="md:flex md:justify-end pb-2">
                  <FormControl className="w-72" variant="outlined">
                    <Select
                      value={selectStore}
                      onChange={({ target }) => setSelectStore(target.value)}
                    >
                      {allStores.map((store, key) => (
                        <MenuItem key={key} value={store.id}>
                          {store.title}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
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
                      <div className="md:relative md:w-auto md:my-6 md:mx-auto md:max-w-sm">
                        {/*content*/}
                        <div
                          className={`md:border-0 md:rounded-lg md:shadow-lg md:relative md:flex md:flex-col md:w-full md:bg-white md:outline-none focus:outline-none ${
                            apiError && "border-2 border-red-600"
                          }`}
                        >
                          {/*header*/}
                          <div className="md:flex md:items-start md:justify-between md:px-5 md:py-2  md:border-solid md:border-red-200 md:rounded-t">
                            <h3 className="md:text-2xl md:text-black md:font-semibold">
                              {isUpdate ? "Update Item" : "Add Item"}
                            </h3>
                          </div>
                          {/*body*/}
                          <p className="text-center text-red-600">{apiError}</p>
                          <form>
                            <div className="md:relative md:p-6 md:flex-auto">
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
                                      allStores.find(
                                        (item) => item.id == data.store_id
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
                                    label="Store Name"
                                    variant="outlined"
                                    select
                                  >
                                    {!allStores ? (
                                      <div className="md:flex md:items-center md:justify-center md:h-screen">
                                        <HashLoader
                                          color={"FF0000"}
                                          loading={loading}
                                          size={150}
                                        />
                                      </div>
                                    ) : (
                                      allStores.map((items,key) => (
                                        <MenuItem key={key} value={items.id}>
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
                              <div className="flex flex-row items-center">
                                <div className="flex flex-col mr-2">
                                  <div className="md:mb-3 md:pt-0">
                                    <input
                                      name="item_id"
                                      value={item_id}
                                      onBlur={({ target }) =>
                                        !target.value &&
                                        setError({
                                          ...error,
                                          ERRitem_id:
                                            "ItemID should not be empty",
                                        })
                                      }
                                      onChange={handleChange("item_id")}
                                      type="text"
                                      placeholder="Item ID"
                                      className="md:px-3 md:py-3 md:placeholder-black md:text-black md:relative md:bg-white md:rounded md:text-sm md:shadow md:outline-none focus:outline-none focus:shadow-outline md:w-full"
                                    />
                                  </div>
                                </div>
                                <div className="flex flex-col flex-1">
                                  <div className="md:mb-3 md:pt-0">
                                    <input
                                      name="quantity"
                                      value={data.quantity}
                                      onBlur={({ target }) =>
                                        (target.value <= 0 || !target.value) &&
                                        setError({
                                          ...error,
                                          ERRquantity:
                                            "Quantity should be greater than 0",
                                        })
                                      }
                                      onChange={handleChange("quantity")}
                                      type="number"
                                      placeholder="Quantity"
                                      className="md:px-3 md:py-3 md:placeholder-black md:text-black md:relative md:bg-white md:rounded md:text-sm md:shadow md:outline-none focus:outline-none focus:shadow-outline md:w-full"
                                    />
                                  </div>
                                </div>
                              </div>

                              <span className="text-red-600">{ERRitem_id}</span>
                              <div className="flex flex-col flex-1">
                                <div className="md:mb-3 md:pt-0">
                                  <input
                                    name="offer_price"
                                    value={data.offer_price}
                                    onBlur={({ target }) =>
                                      (target.value <= 0 || !target.value) &&
                                      setError({
                                        ...error,
                                        ERRoffer_price:
                                          "Price should be greater than 0",
                                      })
                                    }
                                    onChange={handleChange("offer_price")}
                                    type="number"
                                    placeholder="Offer Price"
                                    className="md:px-3 md:py-3 md:placeholder-black md:text-black md:relative md:bg-white md:rounded md:text-sm md:shadow md:outline-none focus:outline-none focus:shadow-outline md:w-full"
                                  />
                                </div>
                              </div>
                            </div>
                          </form>
                          {/*footer*/}
                          <div className="md:flex md:items-center md:justify-end md:px-6 md:py-2 md:border-t md:border-solid md:border-red-200 md:rounded-b">
                            <button
                              className="md:text-red-500 md:background-transparent md:font-bold md:uppercase md:px-6 md:py-2 md:text-sm md:outline-none focus:outline-none md:mr-1 md:mb-1 md:ease-linear md:transition-all md:duration-150"
                              type="button"
                              onClick={() => setShowModal(false)}
                            >
                              Close
                            </button>
                            {!isUpdate ? (
                              <button
                                className="md:button disabled:opacity-50 md:bg-red-700 md:text-white active:bg-red-600 md:font-bold md:uppercase md:text-sm md:px-6 md:py-3 md:rounded md:shadow hover:shadow-lg md:outline-none focus:outline-none md:mr-1 md:mb-1 md:ease-linear md:transition-all md:duration-150"
                                type="submit"
                                onClick={handleSubmit}
                                disabled={
                                  !(
                                    !ERRitem_id &&
                                    !ERRquantity &&
                                    !ERRoffer_price &&
                                    !ERRstore_id
                                  )
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
              <InventoryContent
                items={storeItems}
                getItem={(id) => setItemID(id)}
                handler={(item) => handleUpdate(item)}
                selectedStore={selectStore}
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

export default Inventory;
