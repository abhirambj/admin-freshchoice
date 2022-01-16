import getAllBanners from "../pages/api/GET/GetAllBanners";
import MUIDataTable from "mui-datatables";
import { useState, useEffect } from "react";
import deleteBannerById from "../pages/api/DELETE/DeleteBanner";
import HashLoader from "react-spinners/HashLoader";
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

const BannerContent = () => {
  const [userData, setUserData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);

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
        deleteBannerById(`${baseUrl}/banner/${currentItem[1]}`)
          .then(() => {
            swal({
              title: "Banner Image Deleted Successfully!!",
              timer: 3000,
              icon: "success",
            });
          })
          .catch((err) => {
            swal({
              title: "Banner Image not deleted",
              timer: 3000,
              icon: "error",
            });
          });
      });
    },
  };

  useEffect(() => {
    setLoading(true);
    getAllBanners(baseUrl + "/banner/").then((data) => {
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
                  <div className="flex items-center justify-center h-screen">
                    <HashLoader color={"FF0000"} loading={loading} size={150} />
                  </div>
                ) : (
                  userData.map((items, index) => [
                    index,
                    items.id,
                    <td
                      key={items.id}
                      className="px-6 py-4 whitespace-nowrap flex justify-center text-center"
                    >
                      <Image
                        loader={({ src, width }) =>
                          `${baseUrl}${src}?width=${width}`
                        }
                        width="100"
                        height="100"
                        src={items.image}
                        alt=""
                      />
                    </td>,
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

export default BannerContent;
