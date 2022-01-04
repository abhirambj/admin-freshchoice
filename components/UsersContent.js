import getAllUsers from "../pages/api/GET/GetAllUsers";
import MUIDataTable from "mui-datatables";
import { useState, useEffect } from "react";
import HashLoader from "react-spinners/HashLoader";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import { baseUrl } from "../constants";

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
const options = {
  selectableRows: false,
  filterType: "checkbox",
  rowsPerPageOptions: [10, 25, 50, 100],
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
  // "ID",
  "Name",
  "Email",
  "Mobile Number",
  "Address",
];

const UsersContent = () => {
  const [userData, setUserData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getAllUsers(baseUrl + "/customer/all").then((data) => {
      if (data) {
        if (data.error || data.detail) {
          console.log("Error", data.err);
          setLoading(false);
        } else {
          console.log("Success", data);
          setUserData(data);
          data.reverse();
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
                    "",
                    // items.id,
                    items.full_name,
                    items.email,
                    items.mobile,
                    items.default_address.locality.replace(",", ""),
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

export default UsersContent;
