import MUIDataTable from "mui-datatables";
import { useState, useEffect } from "react";
import getAllItems from "../pages/api/GET/GetAllItems";
import HashLoader from "react-spinners/HashLoader";
import deleteItemsById from "../pages/api/DELETE/DeleteItems";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import { baseUrl } from "../constants";
import Image from "next/image";

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
const InventoryContent = ({ handler, getItem, items, selectedStore }) => {
  const [userData, setUserData] = useState(items);
  console.info(userData);
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);

  const initUpdate = (tableMeta) => {
    console.info(tableMeta);
    handler(items.find((el) => el.id == tableMeta.rowData[0]));
    getItem(tableMeta.rowData[0]);
  };

  const columns = [
    "ID",
    "Image",
    "Name",
    "Category",
    "Description",
    "Quantity",
    // "Price",
    "Offer Price",
    "Available",
    {
      label: "Actions",
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

  const options = {
    filterType: "checkbox",
    rowsPerPageOptions: [10, 25, 50, 100],
    onTableInit: (action, tableState) => setTableData(tableState.data),
    onRowsDelete: (rows, rowData) => {
      rows.data.map((data) => {
        console.info(items[data.dataIndex], rowData);
        const currentItem = items[data.dataIndex];
        console.info(currentItem);
        deleteItemsById(
          `${baseUrl}/item/store/${selectedStore}/${currentItem.id}`
        )
          .then(() => console.info("success"))
          .catch((err) => console.info(err));
      });
    },
  };

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
                  items?.map((item) => [
                    item.id,
                    <td
                      key={item.id}
                      className="px-6 py-4 whitespace-nowrap text-center"
                    >
                      <Image
                        width="100"
                        height="100"
                        loader={({ src, width }) => `${src}?width=${width}`}
                        src={`${baseUrl}` + item.image}
                      />
                    </td>,
                    item.name,
                    item.categoryId || 0,
                    item.description,
                    item.quantity,
                    // item.price,
                    item.offer_price,
                    item.available ? "Yes" : "No",
                    item.displayAtHomepage ? "Yes" : "No",
                    item.displayAtOfferpage ? "Yes" : "No",
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

export default InventoryContent;
