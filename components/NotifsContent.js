import getAllNotifs from "../pages/api/GET/GetNotifs";
import MUIDataTable from "mui-datatables";
import { useState, useEffect } from "react";
import HashLoader from "react-spinners/HashLoader";
import deleteNotifsById from "../pages/api/DELETE/DeleteNotifs";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import { baseUrl } from "../constants";
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
const NotifsContent = () => {
  const [userData, setUserData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);

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
        deleteNotifsById(`${baseUrl}/notifications/${currentItem[0]}`)
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
          return <span>{value+1}</span>;
        },
      },
    },
    "ID",
    "Title",
    "Description",
  ];

  useEffect(() => {
    setLoading(true);
    getAllNotifs(baseUrl + "/notifications/").then((data) => {
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
                  items.id,
                  items.title,
                  items.description,
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

export default NotifsContent;
