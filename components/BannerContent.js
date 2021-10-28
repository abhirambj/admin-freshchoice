import getAllBanners from "../pages/api/GET/GetAllBanners";
import MUIDataTable from "mui-datatables";
import { useState, useEffect } from "react";
import deleteBannerById from "../pages/api/DELETE/DeleteBanner";
import HashLoader from "react-spinners/HashLoader";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import Image from 'next/image';

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
  const [baseUrl] = useState("https://immense-castle-52645.herokuapp.com");
  const [userData, setUserData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);

  const columns = ["ID", "Image"];

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
        deleteBannerById(`${baseUrl}/banner/${currentItem[0]}`)
          .then(() => console.info("success"))
          .catch((err) => console.info(err));
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
                  userData.map((items) => [
                    items.id,
                    <td key={items.id} className="px-6 py-4 whitespace-nowrap flex justify-center text-center">
                      <Image
                        width="100"
                        height="100"
                        src={`${baseUrl}` + items.image}
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
