import getStoreManager from "../pages/api/GET/GetStoreManager";
import MUIDataTable from "mui-datatables";
import { useState, useEffect } from "react";
import HashLoader from "react-spinners/HashLoader";
import deleteManagerById from "../pages/api/DELETE/DeleteManager";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import swal from "sweetalert";
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
const StoreManagerContent = ({ handler, getItem, managers }) => {
  const [userData, setUserData] = useState(managers);
  const [showModal, setShowModal] = useState(false);
  const [viewData, setViewData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);

  const initUpdate = (tableMeta) => {
    console.log(tableMeta.rowData);
    handler(userData.find((item) => item.id === tableMeta.rowData[0]));
    getItem(tableMeta.rowData[0]);
  };

  const options = {
    filterType: "checkbox",
    rowsPerPageOptions: [10, 25, 50, 100],
    onTableInit: (action, tableState) => setTableData(tableState.data),
    onRowsDelete: (rows, rowData) => {
      rows.data.map((data) => {
        console.log(tableData, rowData, rows);
        const currentItem = managers[data.dataIndex];
        deleteManagerById(`${baseUrl}/admin/storemanager/${currentItem.id}`)
          .then(() => {
            const currentData = userData.findIndex(
              (item) => currentItem.id === item.id
            );
            const tempData = userData;
            tempData.splice(currentData, 1);
            setUserData(tempData);
            swal({
              title: "Store Manager Deleted Successfully!!",
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
    "ID",
    "Name",
    "Email",
    "Mobile Number",
    "Username",
    "Store",
    "Other Mobiles",
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
    setUserData(managers);
  }, [managers]);

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
                userData.map((items) => [
                  items.id,
                  items.name,
                  items.email,
                  items.mobile,
                  items.username,
                  items.store,
                  items.other_mobiles,
                ])
              )
            }
            columns={columns}
            options={options}
          />
        </MuiThemeProvider>
      </div>
    </>
  );
};

export default StoreManagerContent;
