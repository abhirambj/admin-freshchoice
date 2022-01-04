import getAllCategories from "../pages/api/GET/GetAllCategories";
import MUIDataTable from "mui-datatables";
import { useState, useEffect } from "react";
import HashLoader from "react-spinners/HashLoader";
import deleteCategoryById from "../pages/api/DELETE/DeleteCategory";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import Image from "next/image";
import { baseUrl } from "../constants";
import swal from "sweetalert";

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
const CategoriesContent = ({ handler, getItem }) => {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);

  const initUpdate = (tableMeta) => {
    console.log(tableMeta.rowData);
    handler(tableMeta.rowData[3], tableMeta.rowData[4]);
    getItem(tableMeta.rowData[1]);
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
    "ID",
    "Image",
    "Name",
    "Description",
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
        deleteCategoryById(`${baseUrl}/category/${currentItem[1]}`)
          .then(() => swal({ title: "Deleted Succefffully!!", button: "OK" }))
          .catch((err) => console.info(err));
      });
    },
  };

  useEffect(() => {
    setLoading(true);
    getAllCategories(baseUrl + "/category/?disabled=false").then((data) => {
      if (data) {
        if (data.error || data.detail) {
          console.log("Error", data.err);
          setLoading(false);
        } else {
          data.reverse();
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
                  userData.map((items, index) => [
                    "",
                    items.id,
                    <td
                      key={index}
                      className="px-6 block mx-auto py-4 whitespace-nowrap text-center"
                    >
                      <Image
                        width="100"
                        height="100"
                        loader={({ src, width }) =>
                          `${baseUrl}${src}?width=${width}`
                        }
                        src={items.image}
                        alt=""
                      />
                    </td>,
                    items.name,
                    items.description,
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

export default CategoriesContent;
