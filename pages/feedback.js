import Head from "next/head";
import DashBoardContainer from "../components/DashBoardContainer";
import FeedbackContent from "../components/FeedbackContent";
import { requiresAuthentication } from "../functions";

const Feedback = () => {
  return (
    <>
      <Head>
        <title>Feedback</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <DashBoardContainer>
        <main className="md:flex-1 md:max-h-full md:pl-10 md:pr-10 md:pb-10 md:overflow-hidden md:overflow-y-auto">
          <div className="md:flex md:flex-row md:items-start md:justify-between md:pb-6 md:pt-10 md:space-y-4  md:items-center md:space-y-0 md:flex-row md:m-5">
            <h1 className="md:text-2xl md:font-semibold md:whitespace-nowrap">
              Feedback
            </h1>
          </div>
          <FeedbackContent />
        </main>
      </DashBoardContainer>
    </>
  );
};

export default Feedback;
