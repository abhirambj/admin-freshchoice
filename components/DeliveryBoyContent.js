import MUIDataTable from "mui-datatables";
import { useState, useEffect } from "react";
import HashLoader from "react-spinners/HashLoader";
import deleteDeliveryBoyById from "../pages/api/DELETE/DeleteDeliveryBoy";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import { baseUrl } from "../constants";
import getAllStores from "../pages/api/GET/GetAllStores";
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
const DeliveryBoyContent = ({
  handler,
  getItem,
  userData,
  setUserData,
  loading,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [viewData, setViewData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [stores, setStores] = useState([]);

  const initUpdate = (tableMeta) => {
    console.log(tableMeta.rowData);
    getItem(tableMeta.rowData[0]);
    const currentDeliveryBoy = userData.find(
      (item) => item.id === tableMeta.rowData[tableMeta.rowData.length - 1]
    );
    console.log(currentDeliveryBoy, userData);
    handler(currentDeliveryBoy);
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
        console.log(currentItem);
        deleteDeliveryBoyById(
          `${baseUrl}/admin/deliveryboy/${
            userData.find(
              (item) => item.id === currentItem[currentItem.length - 1]
            ).id
          }`
        )
          .then(() => {
            const currentData = userData.findIndex(
              (item) => currentItem.id === item.id
            );
            const tempData = userData;
            tempData.splice(currentData, 1);
            setUserData(tempData);
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
  useEffect(() => {
    getAllStores(baseUrl + "/stores/").then((data) => {
      if (data) {
        if (data.error || data.detail) {
          console.log("Error", data.err);
          setLoading(false);
        } else {
          console.log("Success", data);
          data.reverse();
          setStores(data);
        }
      } else {
        console.log("No DATA");
        setLoading(false);
      }
    });
  }, []);

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
    "Name",
    "Username",
    "Mobile Number",
    "Email",
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

  return (
    <>
      (
      <div>
        <MuiThemeProvider theme={theme}>
          <Modal open={loading} className=" flex justify-center items-center">
            <HashLoader color={"FF0000"} loading={loading} size={150} />
          </Modal>
          <MUIDataTable
            title={""}
            data={
              !userData ? (
                <div className="flex items-center justify-center h-screen">
                  <HashLoader color={"FF0000"} loading={loading} size={150} />
                </div>
              ) : (
                userData.map((items, index) => [
                  index,
                  // items.id,
                  items.name,
                  items.username,
                  items.mobile,
                  items.email,
                  items.store == null
                    ? "Unassigned"
                    : stores.find((store) => store.id === parseInt(items.store))
                        ?.title,
                  items.id,
                ])
              )
            }
            columns={columns}
            options={options}
          />
        </MuiThemeProvider>
      </div>
      )
    </>
  );
};

export default DeliveryBoyContent;
