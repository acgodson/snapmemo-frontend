import type { NextPage } from "next";
import dynamic from "next/dynamic";

const Loader = dynamic(
  () => {
    return import("../components/homeLoader");
  },
  { ssr: false }
);

const Home: NextPage = () => {
  return <Loader />;
};

export default Home;
