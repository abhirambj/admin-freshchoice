import { useState, useEffect } from "react";
import Head from "next/head";
import BannerContent from "../components/BannerContent";
import DashBoardContainer from "../components/DashBoardContainer";
import addBanner from "../pages/api/POST/AddBanner";
import { requiresAuthentication } from "../functions";
import HashLoader from "react-spinners/HashLoader";
import swal from "sweetalert";
import { baseUrl } from "../constants";
import { Modal } from "@material-ui/core";

const Banner = () => {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [apiError, setApiError] = useState("");
  const [data, setData] = useState({
    image: "",
    formdata: "",
    success: false,
  });

  const [error, setError] = useState({
    ERRimage: false,
  });

  const { ERRimage } = error;

  const handleBlur = (name) => (event) => {
    let simplifiedName = name.replace("ERR", "");
    console.log(simplifiedName, data[simplifiedName]);
    setError({ ...error, [name]: data[simplifiedName] ? true : false });
  };

  const { image, success, formdata } = data;

  useEffect(() => {
    setData({ ...data, formdata: new FormData() });
  }, []);

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
    if (!image) {
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
    addBanner(formdata, baseUrl + "/banner/").then((data) => {
      if (data) {
        if (data.error || data.detail) {
          console.log("Error", data.err);
          setLoading(false);
          setApiError(data.error || data.detail);
        } else {
          swal({
            title: "Banner Added Successfully!!",
            confirmButtonText: "OK",
            animation: true,
            icon: "success",
            timer: 2000,
          });
          setShowModal(false);
          setLoading(false);
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
      <div>
        <Head>
          <title>Banner</title>
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
            <div className="md:flex md:flex-row md:items-start md:justify-between md:pb-6 md:pt-10 md:space-y-4  md:items-center md:space-y-0 md:flex-row md:m-5">
              <h1 className="md:text-2xl md:font-semibold md:whitespace-nowrap">
                Banners
              </h1>
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
                        <div className="md:flex md:items-start md:justify-between md:p-4  md:border-solid md:border-red-200 md:rounded-t">
                          <h3 className="md:text-3xl md:font-semibold">
                            Add Banner
                          </h3>
                        </div>
                        {/*body*/}
                        <div
                          className={`relative p-10 flex-auto ${
                            apiError && "border-2 border-red-600"
                          }`}
                        >
                          <div className="mb-5 pt-0">
                            <p className="text-center text-red-600">
                              {apiError}
                            </p>
                            <form>
                              <label>Image</label>
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
                                className="md:px-5 md:py-5 md:placeholder-black md:text-black md:relative md:bg-white md:bg-white md:rounded md:text-sm md:shadow md:outline-none focus:outline-none focus:shadow-outline md:w-full"
                              />
                              <span className="text-red-600">{ERRimage}</span>
                            </form>
                          </div>
                        </div>
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
                            disabled={ERRimage ? true : false}
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
            <BannerContent />
          </main>
        </DashBoardContainer>
      </div>
    </>
  );
};
export default Banner;
