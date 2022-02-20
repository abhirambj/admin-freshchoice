import MUIDataTable from "mui-datatables";
import { useState, useEffect } from "react";
import getAllItems from "../pages/api/GET/GetAllItems";
import HashLoader from "react-spinners/HashLoader";
import deleteItemsById from "../pages/api/DELETE/DeleteItems";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import { baseUrl } from "../constants";
import Image from "next/image";
import { FormControl, TextField, MenuItem, Select } from "@material-ui/core";
import updateItems from "../pages/api/PATCH/updateItems";
import { Modal } from "@material-ui/core";
import swal from "sweetalert";
import React from 'react';

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
const InventoryContent = ({ handler, getItem, items, selectedStore,getNewItems }) => {
  const [userData, setUserData] = useState(items);
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [rowItem, setRowItem] = useState({ [Object.keys(items)[0]]: items[Object.keys(items)[0]] });

  const initUpdate = (id) => {
    const upddateItem = items?.find(item => item.variants.find(v => v.id == id));
    handler(upddateItem, id);
    getItem(id);
  };
  useEffect(() => {
    let finalData = [];
    let allRowItems = {};
    finalData = items.map((item, index) => {
      item['sl-no'] = index;
      allRowItems[item.name] = item.id;
    });
    setRowItem(allRowItems);
    setUserData(items);
  }, [items]);

  const columns = React.useMemo(() => {
    return [{
      name: "sl-no",
      label: "Sl no",
      options: {
        filter: true,
        sort: true,
        filterType: 'textField'
      },
    }, {
      name: "id",
      label: "ID",
      options: {
        filter: true,
        sort: true,
        filterType: 'textField'
      },
    }, {
      name: "name",
      label: "Name",
      options: {
        filter: true,
        sort: true,
        filterType: 'textField'
      },
    },
    {
      name: "image",
      label: "Image",
      options: {
        filter: false,
        sort: true,
        customBodyRender: (val) => <Image
          loader={({ src, width }) =>
            `${baseUrl}${src}?width=${width}`
          }
          width="100"
          height="100"
          src={val}
          alt=""
        />
      }
    },
    {
      name: "categoryId",
      label: "Category",
      options: {
        filter: true,
        sort: true,
        filterType: 'checkbox'
      },
    },
    {
      name: "offer-price",
      label: "offer Price",
      options: {
        filter: false,
        sort: true,
        customBodyRender: val => {
          const current = val[0]?.find(item => item.id == rowItem[val[1]]);
          return current?.offer_price || current?.price;
        }
      },
    },
    {
      name: "weight",
      label: "Weight",
      options: {
        filter: false,
        sort: true,
        customBodyRender: val => {
          return !!(rowItem[val[1]]) && <Select
            onChange={e => setRowItem({ ...rowItem, [val[1]]: e.target.value })}
            value={rowItem[val[1]]}>
            {
              val[0]?.map(item => item && <MenuItem key={item.id} value={item.id}>{item.weight}</MenuItem>)
            }
          </Select>;
        }
      },
    },
    {
      name: "quantity",
      label: "Quantity",
      options: {
        filter: false,
        sort: true,
        customBodyRender: val => val[0]?.find(item => item.id == rowItem[val[1]])?.quantity
      },
    },
    {
      name: "available",
      label: "Available",
      options: {
        filter: false,
        customBodyRender: (val) => <FormControl
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
            value={val[0]
            }
            onChange={(ev) => updateStatus(rowItem[val[1]], ev.target.value)}
          >
            <MenuItem value={true}>Yes</MenuItem>
            <MenuItem value={false}>No</MenuItem>
          </TextField>
        </FormControl>
      }
    },
    {
      name: "description",
      label: "Description",
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      label: "Actions",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (val, tableMeta, updateTableRow) => {
          return (
            <div className="flex z-0 flex-row justify-center">
              <div>
                <button
                  onClick={() => {
                    initUpdate(rowItem[val]);
                  }}
                >
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
    ]
  }, [items, rowItem]);

  const updateStatus = (id, value) => {
    const tempData = [...userData];
    const currentData = tempData.find((item) => item.variants.find(v => v.id==id));
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
    onRowsDelete: (rows, rowData,rowIndex) => {
      rows.data.map((data) => {
        const currentItem = items.find(it => it['sl-no']==data.dataIndex);
        const info = items?.map(item => {
          const currentVar = item?.variants.find(v=> v.id==rowItem[currentItem.name]);
          item?.variants.splice(currentVar,1);
          return item
        });
        let finalData = [];
    let allRowItems = {};
    finalData = info.map((item, index) => {
      item['sl-no'] = index;
      allRowItems[item.name] = item.id;
    });
    setRowItem(allRowItems);
    getNewItems();
    setUserData([]);
    setUserData(info);
         deleteItemsById(`${baseUrl}/item/${ rowItem[currentItem.name]}`)
          .then(() => {
            swal({
              title: "Deleted Successfully",
              button: 'OK',
              icon:'success'
            });
            getNewItems();
            return false;
          })
          .catch((err) => {
            swal({
            title:"Deletion failed",
            button:"OK",
            icon:"error",
            timer:3000
          });
          return false;
        });
      });
      return false;
    },
    downloadOptions: {
      separator: '\n'
    },
    onDownload: (buildHead, buildBody, columns, data) => {
      buildHead = () => {
        return [...columns.map(col => col.name)]
      }
      buildBody = () => {
        return [...items.map((item, index) => '\n' + String([
          index,
          rowItem[item.name],
          item.name,
          item.image,
          item.categoryId || '',
          item.variants.reduce((v, i) => v + String(String(i.offer_price) + ' '), ''),
          item.variants.reduce((v, i) => v + String(i.weight) + ' ', ''),
          item.variants.reduce((v, i) => v + String(i.quantity) + ' ', ''),
          item.available ? 'yes' : 'no',
          item.description
        ]))];
      }
      console.log(buildHead(), buildBody())
      return "\uFEFF" + buildHead() + buildBody();
    }
  };

  return (
    <>
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
                userData && userData.map((item, index) => [
                  index,
                  rowItem[item.name],
                  item.name,
                  item.image,
                  item.categoryId || '',
                  [item.variants, item.name],
                  [item.variants, item.name],
                  [item.variants, item.name],
                  [item.available, item.name],
                  item.description,
                  item.name
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

export default InventoryContent;
