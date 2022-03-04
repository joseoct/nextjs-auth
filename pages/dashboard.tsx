import { useContext, useEffect } from "react"
import { AuthContext } from "../contexts/AuthContext"
import { setupApiClient } from "../services/api";
import { api } from "../services/apiClient";
import { withSSRAuth } from "../utils/withSSRAuth";
import { signOut } from "../contexts/AuthContext";

export default function Dashboard () {
  const { user } = useContext(AuthContext);

  return (
    <>
      <h1>Dashboard</h1>

      <button onClick={() => signOut()}>SignOut</button>

    </>
  )
} 

export const getServerSideProps = withSSRAuth(async (ctx) => {
  return {
    props: {}
  };
});
