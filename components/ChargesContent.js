import getAllCharges from "../pages/api/GET/GetAllCharges";
import MUIDataTable from "mui-datatables";
import { useState, useEffect } from "react";
import HashLoader from "react-spinners/HashLoader";
import deleteChargesById from "../pages/api/DELETE/DeleteCharges";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import { baseUrl } from "../constants";

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
const ChargesContent = ({ handler, getItem }) => {
  const [userData, setUserData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [viewData, setViewData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);

  const initUpdate = (tableMeta) => {
    console.log(tableMeta.rowData);
    handler(tableMeta.rowData[1], tableMeta.rowData[2]);
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
        console.info(currentItem);
        deleteChargesById(`${baseUrl}/charges/${currentItem[0]}`)
          .then(() => console.info("success"))
          .catch((err) => console.info(err));
      });
    },
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
    "Up To Amount",
    "Shipment Cost",
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
    getAllCharges(baseUrl + "/charges/").then((data) => {
      if (data) {
        if (data.error || data.detail) {
          console.log("Error", data.err);
          setLoading(false);
        } else {
          console.log("Success", data);
          data.reverse();
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
                  <div>loading..</div>
                ) : (
                  userData.map((items, index) => [
                    index,
                    items.id,
                    items.upto_amount,
                    items.ship_cost,
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

export default ChargesContent;
