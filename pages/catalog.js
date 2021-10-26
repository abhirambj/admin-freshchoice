import Head from "next/head";
import DashBoardContainer from "../components/DashBoardContainer";
import ItemsContent from "../components/ItemsContent";
import { useState, useEffect } from "react";
import addItems, { addCatalogueItems } from "./api/POST/AddItems";
import { FormControl, MenuItem, TextField } from "@material-ui/core";
import getAllCategories from "./api/GET/GetAllCategories";
import HashLoader from "react-spinners/HashLoader";
import updateItems from "./api/PATCH/updateItems";
import { requiresAuthentication } from "../functions";
import swal from "sweetalert";

const Items = () => {
  const [baseUrl] = useState("https://immense-castle-52645.herokuapp.com");
  const [showModal, setShowModal] = useState(false);
  const [catData, setCatData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [itemID, setItemID] = useState(1);
  const [isUpdate, setIsUpdate] = useState(false);
  const [apiError, setApiError] = useState("");
  const [data, setData] = useState({
    name: "",
    image: "",
    categoryId: "",
    description: "",
    quantity: "",
    weight: "",
    price: "",
    // offer_price: "",
    displayAtHomepage: true,
    displayAtOfferpage: true,
    available: false,
    formdata: "",
    success: false,
  });

  const [error, setError] = useState({
    ERRname: true,
    ERRimage: false,
    ERRcategoryId: false,
    ERRdescription: false,
    ERRquantity: false,
    ERRweight: false,
    ERRavailable: false,
    ERRprice: false,
    // ERRoffer_price: false,
    ERRdisplayAtHomepage: false,
    ERRdisplayAtOfferpage: false,
  });

  const {
    ERRname,
    ERRimage,
    ERRcategoryId,
    ERRdescription,
    ERRquantity,
    ERRweight,
    ERRprice,
    ERRavailable,
    // ERRoffer_price,
    ERRdisplayAtHomepage,
    ERRdisplayAtOfferpage,
  } = error;

  const InitAddItem = () => {
    setIsUpdate(false);
    setData({
      ...data,
      name: "",
      categoryId: "",
      description: "",
      quantity: "",
      weight: "",
      price: "",
      // offer_price: "",
      available: false,
      displayAtHomepage: true,
      displayAtOfferpage: true,
    });
    setShowModal(true);
  };

  const handleUpdate = (item) => {
    console.info(item);
    setData({
      ...data,
      name: item.name,
      categoryId: categories.find((ct) => ct.name == item.categoryId).id,
      description: item.description,
      quantity: parseInt(item.quantity),
      weight: item.weight,
      price: parseFloat(item.price),
      available: item.available,
      // offer_price: parseFloat(item.offer_price),
      displayAtHomepage: item.displayAtHomepage,
      displayAtOfferpage: item.displayAtOfferpage,
    });
    setShowModal(true);
    setIsUpdate(true);
  };

  const handleBlur = (name) => (event) => {
    let simplifiedName = name.replace("ERR", "");
    setError({ ...error, [name]: data[simplifiedName] ? true : false });
  };

  const getCategories = () =>
    getAllCategories(baseUrl + "/item/").then((data) => {
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

  useEffect(() => {
    setData({ ...data, formdata: new FormData() });
    getCategories();
    getAllCategories(baseUrl + "/category/").then((data) => {
      if (data) {
        if (data.error || data.detail) {
          console.log("Error", data.err);
          setLoading(false);
        } else {
          console.log("Success", data);
          setCategories(data);
        }
      } else {
        console.log("No DATA");
        setLoading(false);
      }
    });
  }, []);

  const {
    name,
    image,
    categoryId,
    description,
    quantity,
    weight,
    price,
    available,
    // offer_price,
    displayAtHomepage,
    displayAtOfferpage,
    success,
    formdata,
  } = data;

  const handleChange = (name) => (event) => {
    setError({ ...error, ["ERR" + name]: "" });
    console.info(error);
    if (name == "image") {
      setData({ ...data, [name]: event.target.files[0] });
    } else {
      console.info(parseInt(event.target.value));
      setData({ ...data, [name]: event.target.value });
    }
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    setLoading(true);
    console.info(data);
    if (
      !image ||
      !name ||
      !categoryId ||
      !description ||
      !price ||
      !quantity ||
      !weight ||
      !displayAtHomepage.toString() ||
      !displayAtOfferpage.toString()
    ) {
      setApiError("Please Fill All The Required Fields");
      setLoading(false);
      return;
    }
    Object.keys(data).map(
      (item) =>
        item !== "formdata" &&
        item !== "success" &&
        formdata.set(item, data[item])
    );
    addCatalogueItems(formdata, baseUrl + "/item/").then((data) => {
      if (data) {
        if (data.error || data.detail) {
          console.log("Error", data.err);
          setLoading(false);
          setApiError(data.error || data.detail);
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
          getCategories();
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
    Object.keys(data).map(
      (item) =>
        item !== "formdata" &&
        item !== "success" &&
        formdata.set(item, data[item])
    );
    updateItems(formdata, baseUrl + "/item/" + itemID).then((data) => {
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
          getCategories();
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
            <title>Catalog</title>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1.0"
            />
          </Head>
          <DashBoardContainer>
            <main className="md:flex-1 md:max-h-full md:pl-10 md:pr-10 md:pb-10 md:overflow-hidden md:overflow-y-auto">
              <div className="md:flex md:flex-row md:items-start md:justify-between md:pb-6 md:pt-10 md:space-y-4 md:space-y-0  md:m-5">
                <h1 className="md:text-2xl md:font-semibold md:whitespace-nowrap md:text-black">
                  Catalog
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
                                    name="categoryId"
                                    value={
                                      categories.find(
                                        (item) =>
                                          item.name == data.categoryId ||
                                          item.id == data.categoryId
                                      )?.id || ""
                                    }
                                    onBlur={({ target }) =>
                                      !target.value &&
                                      setError({
                                        ...error,
                                        ERRcategoryId:
                                          "Category Name should not be empty",
                                      })
                                    }
                                    onChange={handleChange("categoryId")}
                                    id="outlined-basic"
                                    label="Category"
                                    variant="outlined"
                                    select
                                  >
                                    {!catData ? (
                                      <div className="md:flex md:items-center md:justify-center md:h-screen">
                                        <HashLoader
                                          color={"FF0000"}
                                          loading={loading}
                                          size={150}
                                        />
                                      </div>
                                    ) : (
                                      categories.map((items) => (
                                        <MenuItem value={items.id}>
                                          {items.name}
                                        </MenuItem>
                                      ))
                                    )}
                                  </TextField>
                                </FormControl>
                              </div>
                              <span className="text-red-600">
                                {ERRcategoryId}
                              </span>
                              <div className="md:mb-3 md:pt-0">
                                <input
                                  name="image"
                                  onBlur={({ target }) =>
                                    !target.value &&
                                    setError({
                                      ...error,
                                      ERRimage: "Image should not be empty",
                                    })
                                  }
                                  onChange={handleChange("image")}
                                  type="file"
                                  placeholder="Image"
                                  className="md:px-3 md:py-3 md:placeholder-black md:text-black md:relative md:bg-white md:rounded md:text-sm md:shadow md:outline-none focus:outline-none focus:shadow-outline md:w-full"
                                />
                              </div>
                              <span className="text-red-600">{ERRimage}</span>
                              <div className="md:mb-3 md:pt-0">
                                <input
                                  name="description"
                                  value={data.description}
                                  onBlur={({ target }) =>
                                    target.value < 3 &&
                                    setError({
                                      ...error,
                                      ERRdescription:
                                        "Description should be greater than 3",
                                    })
                                  }
                                  onChange={handleChange("description")}
                                  type="text"
                                  placeholder="Item Description"
                                  className="md:px-3 md:py-3 md:placeholder-black md:text-black md:relative md:bg-white md:rounded md:text-sm md:shadow md:outline-none focus:outline-none focus:shadow-outline md:w-full"
                                />
                              </div>
                              <span className="text-red-600">
                                {ERRdescription}
                              </span>
                              <div className="md:mb-3 md:pt-0">
                                <input
                                  name="weight"
                                  value={data.weight}
                                  onBlur={({ target }) =>
                                    (target.value <= 0 || !target.value) &&
                                    setError({
                                      ...error,
                                      ERRweight:
                                        "Weight should be greater than 0",
                                    })
                                  }
                                  onChange={handleChange("weight")}
                                  type="text"
                                  placeholder="Weight"
                                  className="md:px-3 md:py-3 md:placeholder-black md:text-black md:relative md:bg-white md:rounded md:text-sm md:shadow md:outline-none focus:outline-none focus:shadow-outline md:w-full"
                                />
                              </div>
                              <span className="text-red-600">{ERRweight}</span>
                              <div className="flex flex-row items-center">
                                <div className="flex flex-col mr-2">
                                  <div className="md:mb-3 md:pt-0">
                                    <input
                                      name="name"
                                      value={data.name}
                                      onBlur={({ target }) =>
                                        !target.value &&
                                        setError({
                                          ...error,
                                          ERRname: "Name should not be empty",
                                        })
                                      }
                                      onChange={handleChange("name")}
                                      type="text"
                                      placeholder="Name"
                                      className="md:px-3 md:py-3 md:placeholder-black md:text-black md:relative md:bg-white md:rounded md:text-sm md:shadow md:outline-none focus:outline-none focus:shadow-outline md:w-full"
                                    />
                                  </div>
                                  <span className="text-red-600">
                                    {ERRname}
                                  </span>
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
                                  <span className="text-red-600">
                                    {ERRquantity}
                                  </span>
                                  <div className="md:mb-3 md:pt-0">
                                    <input
                                      name="price"
                                      value={data.price}
                                      onBlur={({ target }) =>
                                        (target.value <= 0 || !target.value) &&
                                        setError({
                                          ...error,
                                          ERRprice:
                                            "Price should be greater than 0",
                                        })
                                      }
                                      onChange={handleChange("price")}
                                      type="number"
                                      placeholder="Your Price"
                                      className="md:px-3 md:py-3 md:placeholder-black md:text-black md:relative md:bg-white md:rounded md:text-sm md:shadow md:outline-none focus:outline-none focus:shadow-outline md:w-full"
                                    />
                                  </div>
                                  <span className="text-red-600">
                                    {ERRprice}
                                  </span>
                                </div>
                                <div className="flex flex-col flex-1">
                                  <div className="md:mb-3 md:pt-1">
                                    <FormControl
                                      size="small"
                                      fullWidth
                                      className="w-full"
                                      variant="outlined"
                                    >
                                      <TextField
                                        size="small"
                                        name="displayAtHomepage"
                                        value={
                                          data.displayAtHomepage == "yes" ||
                                          data.displayAtHomepage == true
                                            ? true
                                            : false
                                        }
                                        onChange={handleChange(
                                          "displayAtHomepage"
                                        )}
                                        id="outlined-basic"
                                        label="Homepage"
                                        variant="outlined"
                                        select
                                      >
                                        <MenuItem value={true}>Yes</MenuItem>
                                        <MenuItem value={false}>No</MenuItem>
                                      </TextField>
                                    </FormControl>
                                  </div>
                                  <div className="md:mb-3 md:pt-1">
                                    <FormControl
                                      size="small"
                                      fullWidth
                                      className="w-full"
                                      variant="outlined"
                                    >
                                      <TextField
                                        size="small"
                                        name="displayAtOfferpage"
                                        value={
                                          data.displayAtOfferpage == "yes" ||
                                          data.displayAtOfferpage == true
                                            ? true
                                            : false
                                        }
                                        onChange={handleChange(
                                          "displayAtOfferpage"
                                        )}
                                        id="outlined-basic"
                                        label="Offerpage"
                                        variant="outlined"
                                        select
                                      >
                                        <MenuItem value={true}>Yes</MenuItem>
                                        <MenuItem value={false}>No</MenuItem>
                                      </TextField>
                                    </FormControl>
                                  </div>
                                  <div className="md:mb-3 md:pt-1">
                                    <FormControl
                                      size="small"
                                      fullWidth
                                      className="w-full"
                                      variant="outlined"
                                    >
                                      <TextField
                                        size="small"
                                        name="available"
                                        value={
                                          data.available == "yes" ||
                                          data.available == true
                                            ? true
                                            : false
                                        }
                                        onChange={handleChange("available")}
                                        id="outlined-basic"
                                        label="Available"
                                        variant="outlined"
                                        select
                                      >
                                        <MenuItem value={true}>Yes</MenuItem>
                                        <MenuItem value={false}>No</MenuItem>
                                      </TextField>
                                    </FormControl>
                                  </div>
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
                                  ERRname ||
                                  ERRimage ||
                                  ERRcategoryId ||
                                  ERRdisplayAtHomepage ||
                                  ERRdisplayAtOfferpage ||
                                  ERRdescription ||
                                  ERRquantity ||
                                  ERRprice
                                    ? // ERRoffer_price
                                      true
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
              <ItemsContent
                getItem={(id) => setItemID(id)}
                items={catData}
                handler={(item) => handleUpdate(item)}
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

export default Items;
