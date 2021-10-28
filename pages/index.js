import Head from "next/head";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useCookies } from "react-cookie";
import userSignIn from "./api/POST/LoginFunc";
import { saveToken } from "../pages/api/apiRequests";
import HashLoader from "react-spinners/HashLoader";
import swal from "sweetalert";
import Image from 'next/image';

export default function Login() {
  const [baseUrl] = useState("https://immense-castle-52645.herokuapp.com");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    username: "",
    password: "",
    formdata: "",
    success: false,
  });
  const [cookie, setCookie, removeCookie] = useCookies(["user"]);
  const [apiError, setApiError] = useState("");
  const [error, setError] = useState({
    ERRusername: false,
    ERRpassword: false,
  });
  const { ERRusername, ERRpassword } = error;

  const handleBlur = (name) => (event) => {
    let simplifiedName = name.replace("ERR", "");
    setError({ ...error, [name]: !event.target.value ? true : false });
  };

  useEffect(() => {
    setData({ ...data, formdata: new FormData() });
    return () => setLoading(false);
  }, []);

  const { username, password, success, formdata } = data;
  const router = useRouter();
  const handleChange = (name) => (event) => {
    setError({ ...error, ["ERR" + name]: "" });
    formdata.set(name, event.target.value);
    setData({ ...data, [name]: event.target.value });
  };
  const handleSubmit = (ev) => {
    setApiError("");
    ev.preventDefault();
    if (!password || !username) {
      return;
    }
    setLoading(true);
    Object.keys(data).map(
      (item) =>
        item !== "formdata" &&
        item !== "success" &&
        formdata.set(item, data[item])
    );
    userSignIn(formdata, baseUrl + "/login").then((data) => {
      if (data) {
        if (data.error || data.detail) {
          console.log("Error", data.err);
          setLoading(false);
          setApiError(data.error || data.detail);
        } else {
          swal({
            title: "Login Successful!!",
            text: "Navigating to home page now",
            confirmButtonText: "OK",
            animation: true,
            icon: "success",
            timer: 2000,
          });
          let { access_token } = data;
          saveToken(setCookie, { access_token, type: "user" });
          router.push("/dashboard");
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
        <div className="flex items-center justify-center h-screen">
          <HashLoader color={"FF0000"} loading={loading} size={150} />
        </div>
      ) : (
        <div>
          <Head>
            <title>Fresh Choice</title>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1.0"
            />
          </Head>
          <div className="h-screen bg-white flex flex-col space-y-10 justify-center items-center">
            <div
              className={`bg-white w-96 shadow-xl rounded-lg p-5 ${
                apiError && "border-2 border-red-600"
              }`}
            >
              <div className="items-center">
                <Image className="h-36 block mx-auto" src="/logo.png" />
              </div>
              <p className="text-center text-red-600">{apiError}</p>
              <form className="space-y-5 mt-5" onSubmit={handleSubmit}>
                <input
                  onBlur={({ target }) =>
                    target.value < 3 &&
                    setError({
                      ...error,
                      ERRusername: "Username Should Be Minimum Of 3 Characters",
                    })
                  }
                  type="email"
                  className="w-full h-12 border border-gray-800 rounded px-3"
                  placeholder="Username"
                  value={username}
                  onChange={handleChange("username")}
                />
                <span className="text-red-600">{ERRusername}</span>
                <input
                  onBlur={({ target }) =>
                    !target.value.length &&
                    setError({
                      ...error,
                      ERRpassword: "Password Should Not Be Empty",
                    })
                  }
                  value={password}
                  type="password"
                  className="w-full h-12 border border-gray-800 rounded px-3"
                  placeholder="Password"
                  onChange={handleChange("password")}
                />
                <span className="text-red-600">{ERRpassword}</span>

                <button
                  type="submit"
                  className="text-center w-full bg-red-700 rounded-md text-white py-3 font-medium"
                >
                  Login
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
