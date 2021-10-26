import Head from "next/head";
import DashboardUsers from "../components/DashboardUsers";
import DashboardContent from "../components/DashboardContent";
import DashBoardContainer from "../components/DashBoardContainer";
import DashboardCharts from "../components/DashboardCharts";
import dashIconAnalytics from "../pages/api/GET/DashContentAnalytics";
import { useState, useEffect } from "react";
import HashLoader from "react-spinners/HashLoader";
import { requiresAuthentication } from "../functions";

const Dashboard = () => {
  const [baseUrl] = useState("https://immense-castle-52645.herokuapp.com");
  const [analysis, setAnalysis] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    dashIconAnalytics(baseUrl + "/dashboard/").then((data) => {
      if (data) {
        if (data.error || data.detail) {
          console.log("Error", data.err);
          setLoading(false);
        } else {
          console.log("Success", data);
          setAnalysis(data);
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
        <div className="md:flex md:items-center md:justify-center md:h-screen">
          <HashLoader color={"FF0000"} loading={loading} size={150} />
        </div>
      ) : (
        <div>
          <Head>
            <title>Dashboard</title>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1.0"
            />
          </Head>
          <DashBoardContainer>
            <main className="md:flex-1 md:max-h-full md:p-10 md:overflow-hidden md:overflow-y-auto">
              {!analysis ? (
                <div className="md:flex md:items-center md:justify-center md:h-screen">
                  <HashLoader color={"FF0000"} loading={loading} size={150} />
                </div>
              ) : (
                <DashboardUsers
                  orders={analysis.orders}
                  items={analysis.items}
                  messages={analysis.messages}
                  users={analysis.users}
                />
              )}
              <div className="md:flex md:flex-row md:items-start md:justify-between md:pt-4 md:pb-6 md:space-y-4 md:space-y-0 md:m-5">
                <h1 className="md:text-2xl md:font-semibold md:whitespace-nowrap">
                  Pending Orders
                </h1>
              </div>
              <DashboardContent />
              <div className="md:flex md:flex-row md:items-start md:justify-between md:pb-6 md:pt-10 md:space-y-4 md:space-y-0 md:m-5">
                <h1 className="md:text-2xl md:font-semibold md:whitespace-nowrap">
                  Analytics
                </h1>
              </div>
              <DashboardCharts />
            </main>
          </DashBoardContainer>
        </div>
      )}
    </>
  );
};

export const getServerSideProps = requiresAuthentication((ctx) => {
  return {
    props: {},
  };
});

export default Dashboard;
