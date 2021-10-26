import getAllMessages from "../pages/api/GET/GetAllMessages";
import MUIDataTable from "mui-datatables";
import { useState, useEffect } from "react";
import HashLoader from "react-spinners/HashLoader";
import deleteMessageById from "../pages/api/DELETE/DeleteMessages";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";

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
const MessageContent = () => {
  const [baseUrl] = useState("https://immense-castle-52645.herokuapp.com");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState([]);
  const [tableData, setTableData] = useState([]);

  const options = {
    selectableRows: false,
    filterType: "checkbox",
    rowsPerPageOptions: [10, 25, 50, 100],
    onTableInit: (action, tableState) => setTableData(tableState.data),
    onRowsDelete: (rows, rowData) => {
      rows.data.map((data) => {
        const currentItem = tableData.find(
          (row) => row.index == data.dataIndex
        ).data;
        console.info(currentItem);
        deleteMessageById(`${baseUrl}/messages/${currentItem[0]}`)
          .then(() => console.info("success"))
          .catch((err) => console.info(err));
      });
    },
  };
  const columns = ["ID", "Name", "Mobile Number", "Message"];
  useEffect(() => {
    setLoading(true);
    getAllMessages(baseUrl + "/messages/").then((data) => {
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
                    items.name,
                    items.mobile_number,
                    items.message,
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

export default MessageContent;
