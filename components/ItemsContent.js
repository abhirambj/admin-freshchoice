import MUIDataTable from "mui-datatables";
import { useState, useEffect } from "react";
import getAllItems from "../pages/api/GET/GetAllItems";
import HashLoader from "react-spinners/HashLoader";
import deleteItemsById from "../pages/api/DELETE/DeleteItems";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import Image from "next/image";
import { baseUrl } from "../constants";
import { Modal, Select, MenuItem } from "@material-ui/core";
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

const ItemsContent = ({ handler, getItem, items, getNewItems }) => {
  const [userData, setUserData] = useState(items);
  const [loading, setLoading] = useState(false);
  const [names,setNames] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [rowItem,setRowItem] = useState({[Object.keys(items)[0]]: items[Object.keys(items)[0]]});

  const initUpdate = (id) => {
    // alert(id)
    const upddateItem = items?.find(item => item.variants.find(v => v.id==id));
    handler(upddateItem,id);
    getItem(id);
  };

  useEffect(() => {
    let finalData = [];
    let allRowItems = {};
    finalData = items.map((item,index) => {
      item['sl-no']=index;
      allRowItems[item.name] = item.id;
    });
    setRowItem(allRowItems);
  console.log(rowItem);
    setUserData(items);
  },[items]);


  const columns = React.useMemo(() => {
    return [ {
      name: "sl-no",
      label: "Sl no",
      options: {
        filter:true,
        sort:true
      },
    }, {
      name: "id",
      label: "ID",
      options: {
        filter:true,
        sort:true
      },
    }, {
      name: "name",
      label: "Name",
      options: {
        filter:true,
        sort:true
      },
    },
      {
      name: "image",
      label: "Image",
      options: {
        filter:true,
        sort:true,
        customBodyRender:(val) => <Image
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
        filter:true,
        sort:true
      },
    },
    {
      name: "price",
      label: "Price",
      options: {
        filter:true,
        sort:true,
        customBodyRender: val => {
          const current = val[0]?.find(item => item.id==rowItem[val[1]]);
          console.log(val[0],current,rowItem[val[1]]);
          return current?.price || current?.offer_price;  
        }
      },
    },
      {
        name: "weight",
        label: "Weight",
        options: {
          filter:true,
          sort:true,
          customBodyRender: val => {
          return !!(rowItem[val[1]]) && <Select
           onChange={e => setRowItem({...rowItem,[val[1]]:e.target.value})}
           value={rowItem[val[1]]}>
            {
              val[0]?.map(item => <MenuItem key={item.id} value={item.id}>{item.weight}</MenuItem>)
            }
          </Select>;
        }
        },
    },
    {
      name: "quantity",
      label: "Quantity",
      options: {
        filter:true,
        sort:true,
        customBodyRender: val => val[0]?.find(item => item.id==rowItem[val[1]])?.quantity
      },
    },
    {
      name: "available",
      label: "Available",
      options: {
        customBodyRender:(val) => val ? "Yes":"No"
      }
    },
    {
      name: "description",
      label: "Description",
      options: {
        filter:true,
        sort:true,
      },
    },
    {
      label: "Actions",
      options: {
        customBodyRender: (val, tableMeta, updateTableRow) => {
        // alert(val)
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
  },[items,rowItem]);

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
        return deleteItemsById(`${baseUrl}/item/${currentItem.id}`)
          .then(() => {
            swal({
              title: "Deleted Successfully",
              button: 'OK',
              icon:'success'
            });
            getNewItems();
            return true;
          })
          .catch((err) => false);
      });
    },
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
               items && items.map((item, index) => [
                 index,
                  rowItem[item.name],
                  item.name,
                  item.image,
                  item.categoryId || '',
                  [item.variants,item.name],
                  [item.variants,item.name],
                  [item.variants,item.name],
                 item.available,
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

export default ItemsContent;
