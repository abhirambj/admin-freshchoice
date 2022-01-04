import MUIDataTable from "mui-datatables";
import { useState, useEffect } from "react";
import getAllItems from "../pages/api/GET/GetAllItems";
import HashLoader from "react-spinners/HashLoader";
import deleteItemsById from "../pages/api/DELETE/DeleteItems";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import { baseUrl } from "../constants";
import Image from "next/image";
import { FormControl, TextField, MenuItem } from "@material-ui/core";
import updateItems from "../pages/api/PATCH/updateItems";

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
    handler(items.find((el) => el.id == tableMeta.rowData[0].props.id));
    getItem(tableMeta.rowData[0]);
  };
  useEffect(() => setUserData(items), [items]);

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
    "ID",
    "Image",
    "Name",
    "Category",
    "Description",
    "Quantity",
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

  const updateStatus = (id, value) => {
    const tempData = [...userData];
    const currentData = tempData.find((item) => item.id === id);
    currentData.available = value;
    tempData.splice(tempData.indexOf(currentData), 1, currentData);
    setUserData(tempData);
    const formData = new FormData();
    formData.set("available", value);
    updateItems(formData, baseUrl + "/item/" + id).then((data) => {
      if (data) {
        if (data.error || data.detail) {
          console.log("Error", data.err);
          setLoading(false);
          setApiError(data.error || data.detail);
        } else {
          swal({
            title: "Item Updated Successfully!!",
            confirmButtonText: "OK",
            animation: true,
            icon: "success",
            timer: 2000,
          });
          setLoading(false);
        }
      } else {
        setApiError("We are experiencing some problems, please try again");
        console.log("No DATA");
        setLoading(false);
      }
    });
  };

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
                  userData?.map((item) => [
                    <span id={item.id} key={item.id}>
                      item.id
                    </span>,
                    <span key={item.id}>{item.id}</span>,
                    <td
                      key={item.id}
                      className="px-6 block mx-auto py-4 whitespace-nowrap text-center"
                    >
                      <Image
                        width="100"
                        height="100"
                        loader={({ src, width }) =>
                          `${baseUrl}${src}?width=${width}`
                        }
                        src={item.image}
                        alt=""
                      />
                    </td>,
                    item.name,
                    item.categoryId || 0,
                    item.description,
                    item.quantity,
                    // item.price,
                    item.offer_price,

                    <FormControl
                      size="small"
                      fullWidth
                      key={item.id}
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
                          userData.find((data) => data.id === item.id)
                            ?.available
                        }
                        onChange={(ev) =>
                          updateStatus(item.id, ev.target.value)
                        }
                      >
                        <MenuItem value={true}>Yes</MenuItem>
                        <MenuItem value={false}>No</MenuItem>
                      </TextField>
                    </FormControl>,
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
