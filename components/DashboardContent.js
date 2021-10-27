import MUIDataTable from "mui-datatables";
import { useState, useEffect } from "react";
import getOrders from "../pages/api/GET/GetPendingOrder";
import viewOrdersById from "../pages/api/GET/ViewOrdersById";
import { Visibility } from "@material-ui/icons";
import { FormControl, MenuItem, TextField } from "@material-ui/core";
import HashLoader from "react-spinners/HashLoader";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import updateStore from "../pages/api/PATCH/updateStore";

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
const DashboardContent = () => {
  const [baseUrl] = useState("https://immense-castle-52645.herokuapp.com");
  const [userData, setUserData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [viewData, setViewData] = useState([]);
  const [loading, setLoading] = useState(false);

  const options = {
    selectableRows: false,
    filterType: "checkbox",
    rowsPerPageOptions: [10, 25, 50, 100],
    onCellClick: (rowData) => {
      handleView(rowData.props.id);
    },
  };
  const updateStatus = (id,value) => {
    setLoading(true);
    updateStore({status:value},`${baseUrl}/order/${id}`)
    .then(() =>fetchOrders())
    .then(() => setLoading(false));
  }
  const columns = [
    "Order ID",
    "Time",
    "Name",
    "Locality",
    {
      label: "View",
      options: {
        customBodyRender: (_,item) => {
          return (
            <div id={item.rowData[0]} className="flex flex-row justify-center">
              <div
                onClick={() => {
                  setShowModal(true);
                }}
              >
                <Visibility />
              </div>
            </div>
          );
        },
      },
    },
    {
      label: "Manage",
      options: {
        customBodyRender: (_,item2) => {
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
                value={userData.find(order => order.id === item2.rowData[0])?.status}
                onChange={(ev) => updateStatus(item2.rowData[0],ev.target.value)}
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
    setLoading(true);
    setViewData({});
    viewOrdersById(baseUrl + "/order/orderid?orderID=" + id).then((data) => {
      if (data) {
        if (data.error || data.detail) {
          console.log("Error", data.err);
          setLoading(false);
        } else {
          console.log("Success", data);
          setViewData(data);
          setLoading(false);
        }
      } else {
        console.log("No DATA");
        setLoading(false);
      }
    });
  };

  useEffect(() => {
    setLoading(true);
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    getOrders(baseUrl + "/order/?status=1").then((data) => {
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
  }

  return (
    <>
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <HashLoader color={"FF0000"} loading={loading} size={150} />
        </div>
      ) : (
        <div>
          <MuiThemeProvider theme={theme}>
            <MUIDataTable
              title={""}
              data={
                !userData ? (
                  <div className="flex items-center justify-center h-screen">
                    <HashLoader color={"FF0000"} loading={loading} size={150} />
                  </div>
                ) : (
                  userData.map((items) => [
                    items.id,
                    new Date(items.time).toLocaleString(),
                    items.name,
                    items.address.replace(',',''),
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
                    <div className="border-0 p-3 rounded-lg shadow-lg relative flex flex-col h-max w-max bg-white outline-none focus:outline-none">
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
                                  <p>{viewData.area}</p>
                                </div>
                              </div>
                              <div className="flex flex-row items-center">
                                <div className="md:grid w-full md:grid-cols-1 hover:bg-gray-50 md:space-y-0 space-y-1 p-2 border-b">
                                  <p className="text-gray-600">Pay Type</p>
                                  <p>{viewData.paytype || "card"}</p>
                                </div>
                                <div className="md:grid w-full md:grid-cols-1 hover:bg-gray-50 md:space-y-0 space-y-1 p-2 border-b">
                                  <p className="text-gray-600">Delivery Type</p>
                                  <p>{viewData.deliverytype}</p>
                                </div>
                              </div>
                              <div className="md:grid md:grid-cols-1 hover:bg-gray-50 md:space-y-0 space-y-1 p-2 border-b">
                                <p className="text-gray-600">Pay ID</p>
                                <p>{viewData.payid}</p>
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
                                  viewData.items.map((items,key) => (
                                    <tr key={key}>
                                      <td className="border-2">{items.name}</td>
                                      <td className="border-2">
                                        {items.quantity}
                                      </td>
                                      <td className="border-2">
                                        {items.price}
                                      </td>
                                      <td className="border-2">
                                        {items.total}
                                      </td>
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
      )}
    </>
  );
};

export default DashboardContent;
