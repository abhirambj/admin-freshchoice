import { useState } from "react";
import Head from "next/head";
import DeliveryAreaContent from "../components/DeliveryAreaContent";
import DashBoardContainer from "../components/DashBoardContainer";
import addDeliveryArea from "./api/POST/AddDeliveryArea";
import HashLoader from "react-spinners/HashLoader";
import { requiresAuthentication } from "../functions";
import updateStore from "./api/PATCH/updateStore";
import swal from "sweetalert";

const Area = () => {
  const [baseUrl] = useState("https://immense-castle-52645.herokuapp.com");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [itemID, setItemID] = useState(1);
  const [isUpdate, setIsUpdate] = useState(false);
  const [apiError, setApiError] = useState("");
  const [data, setData] = useState({
    title: "",
    description: "",
    pincode:"",
    latitude:"",
    longitude:"",
    locality: "",
    firebase_reg_token:"",
    success: false,
  });
  const InitAddItem = () => {
    setIsUpdate(false);
    setData({ ...data, title: "", description: "", pincode: "", latitude:"", longitude:"", locality:"",firebase_reg_token:""});
    setShowModal(true);
  };
  const handleUpdate = (title, description,pincode,latitude,longitude, locality,firebase_reg_token) => {
    setData({ ...data, title, description,pincode, latitude,longitude, locality,firebase_reg_token});
    setShowModal(true);
    setIsUpdate(true);
  };
  const [error, setError] = useState({
    ERRtitle: false,
    ERRdescription: false,
    ERRpincode: false,
    ERRlatitude: false,
    ERRlongitude: false,
    ERRlocality: false,
    ERRfirebase_reg_token: false,
  });
  const { ERRtitle, ERRdescription, ERRpincode, ERRlatitude, ERRlongitude, ERRlocality, ERRfirebase_reg_token } = error;
  const handleBlur = (name) => (event) => {
    let simplifiedName = name.replace("ERR", "");
    console.log(simplifiedName, data[simplifiedName]);
    setError({ ...error, [name]: data[simplifiedName] ? true : false });
  };
  const { title, description,pincode,latitude,longitude,locality,firebase_reg_token,success } = data;
  const handleChange = (name) => (event) => {
    setError({ ...error, ["ERR" + name]: "" });
    setData({ ...data, [name]: event.target.value.toString() });
  };
  const handleSubmit = (ev) => {
    setApiError("");
    ev.preventDefault();
    setLoading(true);
    if (!title || !description || !pincode || !latitude || !longitude || !locality) {
      setApiError("Please Fill All The Required Fields");
      setLoading(false);
      console.log("No", title, description,pincode);
      return;
    }
    addDeliveryArea(data, baseUrl + "/stores/").then((data) => {
      if (data) {
        if (data.error || data.detail) {
          console.log("Error", data.err);
          setLoading(false);
          setApiError(data.error || data.detail);
        } else {
          swal({
            title: "Store Added Successful!!",
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
    ev.preventDefault();
    setLoading(true);
    let query = "";
    //Send query parameters instead of request body
    Object.entries(data).map(
      (item) => (query = query + `${item[0]}=${item[1]}&`)
    );
    updateStore(data, baseUrl + "/stores/" + itemID + `?${query}`).then(
      (data) => {
        if (data) {
          if (data.error || data.detail) {
            console.log("Error", data.err);
            setLoading(false);
            setApiError(data.error || data.detail);
          } else {
            swal({
              title: "Store Updated Successfully!!",
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
  return (
    <>
      {loading ? (
        <div className="md:flex md:items-center md:justify-center md:h-screen">
          <HashLoader color={"FF0000"} loading={loading} size={150} />
        </div>
      ) : (
        <div>
          <Head>
            <title>Store Names</title>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1.0"
            />
          </Head>
          <DashBoardContainer>
            <main className="md:flex-1 md:max-h-full md:pl-10 md:pr-10 md:pb-10 md:overflow-hidden md:overflow-y-auto">
              <div className="md:flex md:flex-row md:items-start md:justify-between md:pb-6 md:pt-10 md:space-y-4 md:space-y-0 md:m-5">
                <h1 className="md:text-2xl md:font-semibold md:whitespace-nowrap">
                  Store Names
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
                          className={`md:border-0 md:rounded-lg md:shadow-lg md:relative md:flex md:flex-col md:w-full bg-white md:outline-none focus:outline-none ${
                            apiError && "border-2 border-red-600"
                          }`}
                        >
                          {/*header*/}
                          <div className="md:flex md:items-start md:justify-between md:p-4 md:border-solid md:border-red-200 md:rounded-t">
                            <h3 className="text-2xl md:font-semibold">
                              {isUpdate ? "Update Store" : "Add Store"}
                            </h3>
                          </div>
                          {/*body*/}
                          <p className="text-center text-red-600">{apiError}</p>
                          <form className="md:p-8">
                            <div className="md:relative md:p-4 md:flex-auto">
                              <div className="md:mb-2 md:pt-0">
                                <input
                                  name="title"
                                  value={data.title}
                                  onBlur={({ target }) =>
                                    !target.value.length &&
                                    setError({
                                      ...error,
                                      ERRtitle:
                                        "Store Name should not be empty",
                                    })
                                  }
                                  onChange={handleChange("title")}
                                  type="text"
                                  placeholder="Store Name"
                                  className="md:px-5 md:py-5 md:placeholder-black md:text-black md:relative md:bg-white md:rounded md:text-sm md:shadow md:outline-none focus:outline-none focus:shadow-outline md:w-full"
                                />
                              </div>
                              <span className="text-red-600">{ERRtitle}</span>
                              <div className="md:mb-5 md:pt-0">
                                <input
                                  name="description"
                                  value={data.description}
                                  onBlur={({ target }) =>
                                    !target.value.length &&
                                    setError({
                                      ...error,
                                      ERRdescription:
                                        "Store Area description should not be empty",
                                    })
                                  }
                                  onChange={handleChange("description")}
                                  type="text"
                                  placeholder="Store description"
                                  className="md:px-5 md:py-5 md:placeholder-black md:text-black md:relative md:bg-white md:rounded md:text-sm md:shadow md:outline-none focus:outline-none focus:shadow-outline md:w-full"
                                />
                              </div>
                              <span className="text-red-600">
                                {ERRdescription}
                              </span>
                              <div className="md:mb-2 md:pt-0">
                                <input
                                  name="pincode"
                                  value={data.pincode.pincode}
                                  onBlur={({ target }) =>
                                    !target.value.length &&
                                    setError({
                                      ...error,
                                      ERRpincode:
                                        "Store Pincode should not be empty",
                                    })
                                  }
                                  onChange={handleChange("pincode")}
                                  type="number"
                                  placeholder="Store Pincode"
                                  className="md:px-5 md:py-5 md:placeholder-black md:text-black md:relative md:bg-white md:rounded md:text-sm md:shadow md:outline-none focus:outline-none focus:shadow-outline md:w-full"
                                />
                              </div>
                              <span className="text-red-600">{ERRpincode}</span>
                              <div className="md:mb-2 md:pt-0">
                                <input
                                  name="latitude"
                                  value={(data.address).latitude}
                                  onBlur={({ target }) =>
                                    !target.value.length &&
                                    setError({
                                      ...error,
                                      ERRlatitude:
                                        "Store Latitude should not be empty",
                                    })
                                  }
                                  onChange={handleChange("latitude")}
                                  type="number"
                                  placeholder="Store Latitude"
                                  className="md:px-5 md:py-5 md:placeholder-black md:text-black md:relative md:bg-white md:rounded md:text-sm md:shadow md:outline-none focus:outline-none focus:shadow-outline md:w-full"
                                />
                              </div>
                              <span className="text-red-600">{ERRlatitude}</span>
                              <div className="md:mb-2 md:pt-0">
                                <input
                                  name="longitude"
                                  value={(data.address).longitude}
                                  onBlur={({ target }) =>
                                    !target.value.length &&
                                    setError({
                                      ...error,
                                      ERRlongitude:
                                        "Store Longitude should not be empty",
                                    })
                                  }
                                  onChange={handleChange("longitude")}
                                  type="number"
                                  placeholder="Store Longitude"
                                  className="md:px-5 md:py-5 md:placeholder-black md:text-black md:relative md:bg-white md:rounded md:text-sm md:shadow md:outline-none focus:outline-none focus:shadow-outline md:w-full"
                                />
                              </div>
                              <span className="text-red-600">{ERRlongitude}</span>
                              <div className="md:mb-2 md:pt-0">
                                <input
                                  name="locality"
                                  value={(data.address).locality}
                                  onBlur={({ target }) =>
                                    !target.value.length &&
                                    setError({
                                      ...error,
                                      ERRlocality:
                                        "Store Locality should not be empty",
                                    })
                                  }
                                  onChange={handleChange("locality")}
                                  type="text"
                                  placeholder="Store Locality"
                                  className="md:px-5 md:py-5 md:placeholder-black md:text-black md:relative md:bg-white md:rounded md:text-sm md:shadow md:outline-none focus:outline-none focus:shadow-outline md:w-full"
                                />
                              </div>
                              <span className="text-red-600">{ERRlocality}</span>
                              <div className="md:mb-2 md:pt-0">
                                <input
                                  name="firebase_reg_token"
                                  value={data.firebase_reg_token}
                                  onBlur={({ target }) =>
                                    !target.value.length &&
                                    setError({
                                      ...error,
                                      ERRfirebase_reg_token:
                                        "Firebase Token should not be empty",
                                    })
                                  }
                                  onChange={handleChange("firebase_reg_token")}
                                  type="text"
                                  placeholder="Store Firebase Token"
                                  className="md:px-5 md:py-5 md:placeholder-black md:text-black md:relative md:bg-white md:rounded md:text-sm md:shadow md:outline-none focus:outline-none focus:shadow-outline md:w-full"
                                />
                              </div>
                              <span className="text-red-600">{ERRlongitude}</span>
                            </div>
                          </form>
                          {/*footer*/}
                          <div className="md:flex md:items-center md:justify-end md:p-6 md:border-t md:border-solid md:border-red-200 md:rounded-b">
                            <button
                              className="text-red-500 md:background-transparent md:font-bold uppercase md:px-6 md:py-2 md:text-sm md:outline-none focus:outline-none md:mr-1 md:mb-1 md:ease-linear md:transition-all md:duration-150"
                              type="button"
                              onClick={() => setShowModal(false)}
                            >
                              Close
                            </button>
                            {!isUpdate ? (
                              <button
                                className="button bg-red-700 disabled:opacity-50 text-white active:bg-red-600 font-bold uppercase md:text-sm md:px-6 md:py-3 md:rounded md:shadow hover:shadow-lg md:outline-none focus:outline-none md:mr-1 md:mb-1 md:ease-linear md:transition-all md:duration-150"
                                type="submit"
                                onClick={handleSubmit}
                                disabled={
                                  ERRtitle || ERRdescription ? true : false
                                }
                              >
                                Add
                              </button>
                            ) : (
                              <button
                                className="button bg-red-700 text-white active:bg-red-600 font-bold uppercase md:text-sm md:px-6 md:py-3 md:rounded md:shadow hover:shadow-lg md:outline-none focus:outline-none md:mr-1 md:mb-1 md:ease-linear md:transition-all md:duration-150"
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
                    <div className="md:opacity-25 md:fixed md:inset-0 md:z-40 bg-black"></div>
                  </>
                ) : null}
              </div>
              <DeliveryAreaContent
                getItem={(id) => setItemID(id)}
                handler={(title, description) =>
                  handleUpdate(title, description)
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
export default Area;
