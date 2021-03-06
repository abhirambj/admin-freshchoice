import getAllCoupons from "../pages/api/GET/GetCoupons";
import MUIDataTable from "mui-datatables";
import { useState, useEffect } from "react";
import HashLoader from "react-spinners/HashLoader";
import deleteCouponsById from "../pages/api/DELETE/DeleteCoupons";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import getAllStores from "../pages/api/GET/GetAllStores";
import { baseUrl } from "../constants";
import swal from "sweetalert";
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
const CouponContent = ({ handler, getItem, coupons }) => {
  const [userData, setUserData] = useState(coupons);
  const [showModal, setShowModal] = useState(false);
  const [viewData, setViewData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [stores, setStores] = useState([]);

  const initUpdate = (tableMeta) => {
    console.log(tableMeta.rowData);
    const currentCoupon = userData.find(
      (item) => item.id === tableMeta.rowData[tableMeta.rowData.length - 1]
    );
    handler(currentCoupon);
    getItem(tableMeta.rowData[tableMeta.rowData.length - 1]);
  };

  const options = {
    filterType: "checkbox",
    rowsPerPageOptions: [10, 25, 50, 100],
    onTableInit: (action, tableState) => setTableData(tableState.data),
    onRowsDelete: (rows, rowData, item1, item2) => {
      console.log(rows, rowData, item1, item2, tableData);
      rows.data.map((data) => {
        const currentItem = tableData.find(
          (item) => item.index === data.dataIndex
        ).data;
        console.info(currentItem);
        return deleteCouponsById(
          `${baseUrl}/coupon/${currentItem[currentItem.length - 1]}`
        )
          .then(() =>
            swal({
              title: "Deleted Successfully",
              button: "OK",
              icon: "success",
              timer: 2000,
            })
          )
          .catch((err) => false);
      });
    },
  };
  useEffect(() => {
    setUserData(coupons);
  }, [coupons]);
  const columns = [
    {
      name: "Sl No.",
      label: "Sl. No",
      options: {
        filter: false,
        customBodyRender: (value, tableMeta, update) => {
          return <span>{value+1}</span>;
        },
      },
    },
    "Store Name",
    "Coupon Code",
    "Deduction Price",
    "Description",
    "Minimum Order Amount",
    "Maximum Discount",
    "Valid From",
    "user usage count",
    "Valid To",
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

  return (
    <>
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
                userData.map((items, index) => [
                  index,
                  stores.find((store) => store.id === items.store_id)?.title ||
                    "",
                  items.code,
                  items.deduction,
                  items.description,
                  items.min_eligible_amount,
                  items.max_discount,
                  new Date(items.valid_from).toLocaleString(),
                  items.count || 0,
                  new Date(items.valid_to).toLocaleString(),
                  items.id,
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

export default CouponContent;
