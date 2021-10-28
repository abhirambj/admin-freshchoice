import getDeliveryBoys from "../pages/api/GET/GetDeliveryBoy";
import MUIDataTable from "mui-datatables";
import { useState, useEffect } from "react";
import HashLoader from "react-spinners/HashLoader";
import deleteDeliveryBoyById from "../pages/api/DELETE/DeleteDeliveryBoy";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";

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
const DeliveryBoyContent = ({ handler, getItem }) => {
  const [baseUrl] = useState("https://immense-castle-52645.herokuapp.com");
  const [userData, setUserData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [viewData, setViewData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);

  const initUpdate = (tableMeta) => {
    console.log(tableMeta.rowData);
    handler(tableMeta.rowData[1], tableMeta.rowData[2], tableMeta.rowData[3]);
    getItem(tableMeta.rowData[0]);
  };

  const options = {
    filterType: "checkbox",
    rowsPerPageOptions: [10, 25, 50, 100],
    onTableInit: (action, tableState) => setTableData(tableState.data),
    onRowsDelete: (rows, rowData) => {
      rows.data.map((data) => {
        const currentItem = tableData.find(
          (row) => row.index == data.dataIndex
        ).data;
        deleteDeliveryBoyById(`${baseUrl}/admin/deliveryboy/${currentItem[0]}`)
          .then(() => {
            swal({
              title: "Delivery Boy Deleted Successfully!!",
              button: "OK",
              icon: "success",
              timer: 2000,
            });
          })
          .catch((err) => console.info(err));
      });
    },
  };

  const columns = [
    {
      name: 'Sl. No',
      selector: 'serial'
    },
    "Name",
    "Mobile Number",
    "Store",
    {
      label: "Action",
      options: {
        customBodyRender: (val, tableMeta, updateTableRow) => {
          return (
            <div className="flex flex-row justify-center">
              <div>
                <button onClick={() => initUpdate(tableMeta)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="green"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          );
        },
      },
    },
  ];

  useEffect(() => {
    setLoading(true);
    getDeliveryBoys(baseUrl + "/admin/deliveryboy/").then((data) => {
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
  }, []);

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
                  userData.map((items,index) => [
                    items.serial=index+1,
                    // items.id,
                    items.name,
                    items.mobile,
                    items.store==null ? "Unassigned" : items.store,
                  ])
                )
              }
              columns={columns}
              options={options}
            />
          </MuiThemeProvider>
        </div>
      )}
    </>
  );
};

export default DeliveryBoyContent;
