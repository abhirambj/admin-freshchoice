import { Visibility } from "@material-ui/icons";
import MUIDataTable from "mui-datatables";
import { useState, useEffect } from "react";
import viewOrdersById from "../pages/api/GET/ViewOrdersById";
import { FormControl, MenuItem, TextField } from "@material-ui/core";
import HashLoader from "react-spinners/HashLoader";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import updateStore from "../pages/api/PATCH/updateStore";
import getAllStores from "../pages/api/GET/GetAllStores";
import { processItems } from "../functions";
import { baseUrl } from "../constants";
import { Modal } from "@material-ui/core";

const theme = createMuiTheme({
  palette: {
    primary: {
      light: "#500000",
      main: "#E40017",
      dark: "#FF0000",
      contrastText: "#500",
    },
  },
});
const ManageOrdersContent = ({ data, fetchOrders, isLoading }) => {
  const [showModal, setShowModal] = useState(false);
  const [viewData, setViewData] = useState([]);
  const [userData, setUserData] = useState(data);
  const [loading, setLoading] = useState(isLoading);
  const [stores, setStores] = useState([]);

  const options = {
    selectableRows: false,
    filterType: "checkbox",
    rowsPerPageOptions: [10, 25, 50, 100],
  };
  const updateStatus = (id, value) => {
    setLoading(true);
    updateStore({ status: value }, `${baseUrl}/order/${id}`)
      .then(() => fetchOrders())
      .then(() => setLoading(false));
  };
  const columns = [
    {
      name: "Sl No.",
      label: "Sl. No",
      options: {
        filter: false,
        customBodyRender: (value, tableMeta, update) => {
          let rowIndex = Number(tableMeta.rowIndex) + 1;
          return <span>{rowIndex}</span>;
        },
      },
    },
    "Order ID",
    "Time",
    "Name",
    "Mobile Number",
    "Chosen Delivery Time",
    "Store Name",
    "Payment Mode",
    "Ratings",
    // "Delivered Time",
    "Items",
    "Total",
    // {
    //   label: "View",
    //   options: {
    //     customBodyRender: (_, item) => {
    //       return (
    //         <div id={item.rowData[0]} className="flex flex-row justify-center">
    //           <div
    //             onClick={() => {
    //               setShowModal(true);
    //             }}
    //           >
    //             <Visibility />
    //           </div>
    //         </div>
    //       );
    //     },
    //   },
    // },
    {
      label: "Manage",
      options: {
        customBodyRender: (_, item2) => {
          return (
            <FormControl
              size="small"
              fullWidth
              className="w-full"
              variant="outlined"
            >
              <TextField
                size="small"
                id="outlined-basic"
                label="Options"
                variant="outlined"
                select
                value={
                  data.find((order) => order.id === item2.rowData[1])?.status
                }
                onChange={(ev) =>
                  updateStatus(item2.rowData[1], ev.target.value)
                }
              >
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Confirmed">Confirmed</MenuItem>
                <MenuItem value="On way">Out For Delivery</MenuItem>
                <MenuItem value="Delivered">Delivered</MenuItem>
                <MenuItem value="Canceled">Cancelled</MenuItem>
              </TextField>
            </FormControl>
          );
        },
      },
    },
  ];

  const handleView = (id) => {
    // setLoading(true);
    setViewData({});
    // viewOrdersById(baseUrl + "/order/orderid?orderID=" + id).then((data) => {
    //   if (data) {
    //     if (data.error || data.detail) {
    //       console.log("Error", data.err);
    //       setLoading(false);
    //     } else {
    //       console.log("Success", data);
    //       setViewData(data);
    //       setShowModal(true);
    //       setLoading(false);
    //     }
    //   } else {
    //     console.log("No DATA");
    //     setLoading(false);
    //   }
    // });
  };
  useEffect(() => {
    setLoading(true);
    getAllStores(baseUrl + "/stores/").then((data) => {
      setStores(data);
    });
  }, []);
  useEffect(() => {
    setUserData(data);
    setLoading(isLoading);
  }, [data]);
  return (
    <>
      <div>
        <Modal open={loading} className="flex justify-center items-center">
          <HashLoader color={"FF0000"} loading={loading} size={150} />
        </Modal>
        <MuiThemeProvider theme={theme}>
          <MUIDataTable
            title={""}
            data={
              !userData ? (
                <div className="flex items-center justify-center h-screen">
                  <HashLoader color={"FF0000"} loading={loading} size={150} />
                </div>
              ) : (
                userData
                  .sort((item1, item2) => item2.id - item1.id)
                  .map((item, index) => [
                    index,
                    item.id,
                    new Date(
                      new Date(item.time).getTime() -
                        new Date(item.time).getTimezoneOffset() * 60000
                    ).toLocaleString("en-US", {
                      hour12: true,
                    }),
                    item.name,
                    item.mobile_number,
                    item["Chosen Delivery Time"] || "",
                    stores.find((items) => items.id === item.store_id)?.title,
                    item.paytype
                      ? item.paytype === "RAZORPAY"
                        ? "ONLINE"
                        : "Cash on Delivery"
                      : item.rzpy_order_id
                      ? "ONLINE"
                      : "Cash on Delivery",
                    item.rating,
                    // item.delivered_time,
                    processItems(item.items || []),
                    item.total,
                  ])
              )
            }
            columns={columns}
            options={options}
          />
          {showModal ? (
            <>
              <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                <div className="relative flex justify-center w-auto my-3 mx-auto max-w-sm">
                  {/*content*/}
                  <div className="border-0 p-1 rounded-lg shadow-lg relative flex flex-col h-max w-max bg-white outline-none focus:outline-none">
                    {/*header*/}
                    <div className="flex items-start justify-between p-3 border-b border-solid border-red-200 rounded-t">
                      <h3 className="text-2xl font-semibold">View Order</h3>
                    </div>

                    {/*body*/}
                    {!viewData ? (
                      <div>loading..</div>
                    ) : (
                      <div key={viewData.id}>
                        <div className="max-w-4xl mt-0 p-0 bg-white w-max rounded-lg shadow-xl">
                          <div className="p-4 border-b">
                            <h2 className="text-2xl ">{viewData.id}</h2>
                          </div>
                          <div>
                            <div className="w-full items-center flex flex-row">
                              <div className="md:grid md:grid-cols-1 w-full hover:bg-gray-50 md:space-y-0 space-y-1 p-2 border-b">
                                <p className="text-gray-600">Name</p>
                                <p>{viewData.name}</p>
                              </div>
                              <div className="md:grid md:grid-cols-1 w-full hover:bg-gray-50 md:space-y-0 space-y-1 p-2 border-b">
                                <p className="text-gray-600">Store Name</p>
                                <p>
                                  {stores.find(
                                    (item) => item.id === viewData.store_id
                                  )?.title || ""}
                                </p>
                              </div>
                            </div>
                            <div className="flex flex-row items-center">
                              <div className="md:grid w-full md:grid-cols-1 hover:bg-gray-50 md:space-y-0 space-y-1 p-2 border-b">
                                <p className="text-gray-600">Pay Type</p>
                                <p>{viewData.paytype || "card"}</p>
                              </div>
                              <div className="md:grid w-full md:grid-cols-1 hover:bg-gray-50 md:space-y-0 space-y-1 p-2 border-b">
                                <p className="text-gray-600">Delivery Time</p>
                                <p>{viewData.delivered_time}</p>
                              </div>
                            </div>
                            <div className="md:grid md:grid-cols-1 hover:bg-gray-50 md:space-y-0 space-y-1 p-2 border-b">
                              <p className="text-gray-600">RazorPay ID</p>
                              <p>{viewData.rzpy_order_id}</p>
                            </div>
                          </div>
                          <table className="w-full my-6 text-center">
                            <tr className="border-b-2 border-t-2">
                              <th>Name</th>
                              <th>Quantity</th>
                              <th>Price</th>
                              <th>Total</th>
                            </tr>
                            <tbody>
                              {!viewData ? (
                                <div>loading..</div>
                              ) : (
                                viewData.items.map((items, key) => (
                                  <tr key={key}>
                                    <td className="border-2">{items.name}</td>
                                    <td className="border-2">
                                      {items.quantity}
                                    </td>
                                    <td className="border-2">{items.price}</td>
                                    <td className="border-2">{items.total}</td>
                                  </tr>
                                ))
                              )}
                              <tr>
                                <td></td>
                                <td></td>
                                <td className="font-bold">Grand Total</td>
                                <td className="border-2">{viewData.total}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                    {/*footer*/}
                    <div className="flex items-center justify-end p-1 border-solid border-red-200 rounded-b">
                      <button
                        className="button bg-red-500 text-white active:bg-red-600 font-bold uppercase text-sm px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                        type="button"
                        onClick={() => setShowModal(false)}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
            </>
          ) : null}
        </MuiThemeProvider>
      </div>
    </>
  );
};

export default ManageOrdersContent;
