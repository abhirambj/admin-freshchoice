import Head from "next/head";
import DashBoardContainer from "../components/DashBoardContainer";
import CategoriesContent from "../components/CategoriesContent";
import { useState, useEffect } from "react";
import addCategory from "../pages/api/POST/AddCategory";
import updateCategory from "../pages/api/PATCH/updateCategory";
import HashLoader from "react-spinners/HashLoader";
import { requiresAuthentication } from "../functions";
import swal from "sweetalert";
import { baseUrl } from "../constants";

function Categories() {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [itemID, setItemID] = useState(1);
  const [isUpdate, setIsUpdate] = useState(false);
  const [apiError, setApiError] = useState("");
  const [data, setData] = useState({
    name: "",
    image: "",
    description: "",
    formdata: "",
    success: false,
  });

  const [error, setError] = useState({
    ERRname: true,
    ERRimage: false,
    ERRdescription: false,
  });

  const InitAddItem = () => {
    setIsUpdate(false);
    setData({ ...data, name: "", description: "" });
    setShowModal(true);
  };

  const handleUpdate = (name, description) => {
    setData({ ...data, name, description });
    setShowModal(true);
    setIsUpdate(true);
  };

  const { ERRname, ERRimage, ERRdescription } = error;

  const handleBlur = (name) => (event) => {
    let simplifiedName = name.replace("ERR", "");
    console.log(simplifiedName, data[simplifiedName]);
    setError({ ...error, [name]: data[simplifiedName] ? true : false });
  };

  useEffect(() => {
    setData({ ...data, formdata: new FormData() });
  }, []);

  const { name, image, description, success, formdata } = data;

  const handleChange = (name) => (event) => {
    setError({ ...error, ["ERR" + name]: "" });
    if (name == "image") {
      setData({ ...data, [name]: event.target.files[0] });
    } else {
      setData({ ...data, [name]: event.target.value });
    }
  };

  const handleSubmit = (ev) => {
    setApiError("");
    ev.preventDefault();
    setLoading(true);
    if (!description || !name || !image) {
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
    console.info(data);
    for (var pair of formdata.entries()) {
      console.log(pair[0] + ", " + pair[1]);
    }
    addCategory(formdata, baseUrl + "/category/").then((data) => {
      if (data) {
        if (data.error || data.detail) {
          console.log("Error", data.err);
          setLoading(false);
          setApiError(data.error || data.detail);
        } else {
          swal({
            title: "Category Added Successfully!!",
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
  console.info(error);
  const updateItem = (ev) => {
    setApiError("");
    ev.preventDefault();
    setLoading(true);
    Object.keys(data).map(
      (item) =>
        item !== "formdata" &&
        item !== "success" &&
        formdata.set(item, data[item])
    );
    console.log(itemID);
    updateCategory(formdata, baseUrl + "/category/" + itemID).then((data) => {
      if (data) {
        if (data.error || data.detail) {
          console.log("Error", data.err);
          setLoading(false);
          setApiError(data.error || data.detail);
        } else {
          swal({
            title: "Category Updated Successfully!!",
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
  return (
    <>
      {loading ? (
        <div className="md:flex md:items-center md:justify-center md:h-screen">
          <HashLoader color={"FF0000"} loading={loading} size={150} />
        </div>
      ) : (
        <div>
          <Head>
            <title>Categories</title>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1.0"
            />
          </Head>
          <DashBoardContainer>
            <main className="md:flex-1 md:max-h-full md:pl-10 md:pr-10 md:pb-10 md:overflow-hidden md:overflow-y-auto">
              <div className="md:flex md:flex-row md:items-start md:justify-between md:pb-6 md:pt-10 md:space-y-4  md:items-center md:space-y-0 md:flex-row md:m-5">
                <h1 className="md:text-2xl md:font-semibold md:whitespace-nowrap">
                  Categories
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
                          } `}
                        >
                          {/*header*/}
                          <div className="md:flex md:items-start md:justify-between md:p-4  md:border-solid md:border-red-200 md:rounded-t">
                            <h3 className="md:text-2xl md:font-semibold">
                              {isUpdate ? "Update Category" : "Add Category"}
                            </h3>
                          </div>
                          {/*body*/}
                          <p className="text-center text-red-600">{apiError}</p>
                          <form>
                            <div className="md:relative md:p-5 md:pt-0 md:flex-auto">
                              <div className="md:mb-5 md:pt-0">
                                <label>Name</label>
                                <input
                                  name="name"
                                  type="text"
                                  placeholder="Category Name"
                                  value={data.name}
                                  onBlur={({ target }) =>
                                    !target.value.length &&
                                    setError({
                                      ...error,
                                      ERRname:
                                        "Category Name should not be empty",
                                    })
                                  }
                                  onChange={handleChange("name")}
                                  className="px-5 py-5 placeholder-black text-black relative bg-white bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full"
                                />
                              </div>
                              <span className="text-red-600">{ERRname}</span>
                              <div className="md:mb-5 md:pt-0">
                                <label>Description</label>
                                <input
                                  name="description"
                                  type="text"
                                  value={data.description}
                                  placeholder="Category Description"
                                  onBlur={({ target }) =>
                                    target.value < 3 &&
                                    setError({
                                      ...error,
                                      ERRdescription:
                                        "Description Should Be Greater Than 3 Characters",
                                    })
                                  }
                                  onChange={handleChange("description")}
                                  className="md:px-5 md:py-5 md:placeholder-black md:text-black md:relative md:bg-white md:rounded md:text-sm md:shadow md:outline-none focus:outline-none focus:shadow-outline md:w-full"
                                />
                              </div>
                              <span className="text-red-600">
                                {ERRdescription}
                              </span>
                              <div className="md:mb-5 md:pt-0">
                                <label>Image</label>
                                <input
                                  name="image"
                                  type="file"
                                  placeholder="Image"
                                  onBlur={({ target }) =>
                                    !target.value &&
                                    setError({
                                      ...error,
                                      ERRimage: "Image should not be empty",
                                    })
                                  }
                                  onChange={handleChange("image")}
                                  className="md:px-5 md:py-5 md:placeholder-black md:text-black md:relative md:bg-white md:rounded md:text-sm md:shadow md:outline-none focus:outline-none focus:shadow-outline md:w-full"
                                />
                              </div>
                            </div>
                          </form>
                          {/*footer*/}
                          <div className="md:flex md:items-center md:justify-end md:p-4 md:border-t md:border-solid md:border-red-200 md:rounded-b">
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
                                  ERRname || ERRimage || ERRdescription
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
              <CategoriesContent
                getItem={(id) => setItemID(id)}
                handler={(name, description) => handleUpdate(name, description)}
              />
            </main>
          </DashBoardContainer>
        </div>
      )}
    </>
  );
}

export default Categories;
