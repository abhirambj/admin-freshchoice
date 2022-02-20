import getAllFeedback from "../pages/api/GET/GetAllCharges";
import MUIDataTable from "mui-datatables";
import { useState, useEffect } from "react";
import HashLoader from "react-spinners/HashLoader";
import deleteFeedbackById from "../pages/api/DELETE/DeleteFeedback";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import { baseUrl } from "../constants";
import getAllItems from "../pages/api/GET/GetAllItems";

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
const FeedbackContent = () => {
  const [showModal, setShowModal] = useState(false);
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [items, setItems] = useState([]);

  const options = {
    selectableRows: false,
    filterType: "checkbox",
    rowsPerPageOptions: [10, 25, 50, 100],
    onTableInit: (action, tableState) => setTableData(tableState.data),
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
    "Store",
    "Order ID",
    {
      label: "Item - Ratings",
      options: {
        customBodyRender: (val, itemName) => {
          return (<ul>
            {val.map((item, key) => (
              <li key={key}>
                {item?.item_name} -- {item.rating}
              </li>
            ))}
          </ul>);
        },
      },
    },
    "Feedback",
  ];

  useEffect(() => {
    setLoading(true);
    getAllFeedback(baseUrl + "/feedback/").then((data) => {
      if (data) {
        if (data.error || data.detail) {
          console.log("Error", data.err);
          setLoading(false);
        } else {
          console.log("Success", data);
          data.sort((a,b) => b.id-a.id);
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
                    items.store_name,
                    items.id,
                    items.ratings,
                    items.feedback,
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

export default FeedbackContent;
