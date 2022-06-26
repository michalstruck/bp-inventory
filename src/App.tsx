import Login from "./components/Login";
import Logout from "./components/Logout";
import { SyntheticEvent, useEffect, useState } from "react";
import { gapi } from "gapi-script";
import credentials from "./client_secret.json";
import Main from "./Main";

const apiKey = credentials.api_key;
const discoveryDocs = [
  "https://sheets.googleapis.com/$discovery/rest?version=v4",
];
const clientId = credentials.client_id;
const scopes = "https://www.googleapis.com/auth/spreadsheets";

export type ValueKeys = { name: string; measure: string; lastEntry: string };

function App() {
  const authorizeButton = document.getElementById("authorize-button");
  const signoutButton = document.getElementById("signout-button");
  const [valueKeys, setValueKeys] = useState<ValueKeys>({
    name: "",
    measure: "",
    lastEntry: "",
  } as ValueKeys);

  useEffect(() => handleClientLoad(), []);

  // Load the API client and auth2 library
  const handleClientLoad = () => {
    gapi.load("client:auth2", initClient);
  };

  const initClient = () => {
    gapi.client
      .init({
        apiKey: apiKey,
        discoveryDocs: discoveryDocs,
        clientId: clientId,
        scope: scopes,
      })
      .then(() => {
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
        // Handle the initial sign-in state - change button display.
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
      });
  };
  const updateSigninStatus = (isSignedIn: any) => {
    if (isSignedIn) {
      authorizeButton!.style.display = "none";
      signoutButton!.style.display = "block";
      makeApiCall();
    } else {
      authorizeButton!.style.display = "block";
      signoutButton!.style.display = "none";
    }
  };

  const handleAuthClick = () => {
    gapi.auth2.getAuthInstance().signIn();
  };

  const handleSignoutClick = (event: SyntheticEvent) => {
    gapi.auth2.getAuthInstance().signOut();
  };

  const makeApiCall = () => {
    const params = {
      spreadsheetId: "1BiFcix7htCYmrV6v1DknnsA4ddTp56Nm76_m2PFap8Q",
      range: "SŁONY",
    };
    const request = gapi.client.sheets.spreadsheets.values.get(params);
    request.then(
      ({ result }: any) => {
        // .map((el: string[], i: number) => (
        //   <tr key={i + 240}>
        //     <td>{el[0]}</td>
        //     <td>{el[1]}</td>
        //     <td>{el[el.length !== 1 ? el.length - 1 : "69696969"]}</td>
        //   </tr>
        console.log(result.values);
        setValueKeys(
          result.values.map((el: string[], i: number) => ({
            name: el[0],
            measure: el[1 ?? ""],
            lastEntry: [el.length !== 1 ? el.length - 1 : "69696969"],
          }))
        );
        console.log(valueKeys);
      },
      ({ result }: any) => {
        console.error("error: " + result.error.message);
      }
    );
  };
  return (
    <div className="grid place-items-center">
      <div className="grid place-items-center bg-zinc-600 w-96 h-96 elevation-10 rounded-lg">
        <button
          className="w-24 h-12 bg-zinc-400 rounded-lg elevation-5"
          onClick={handleAuthClick}
          id="authorize-button"
        >
          google signin
        </button>
        <button
          onClick={handleSignoutClick}
          className="w-24 h-12 bg-zinc-400 rounded-lg elevation-5"
          id="signout-button"
        >
          signout
        </button>
        <button
          onClick={makeApiCall}
          className="w-24 h-12 bg-zinc-400 rounded-lg elevation-5"
        >
          fetch
        </button>
      </div>
      <Login />
      <Main valueKeys={valueKeys} />
      <Logout />
    </div>
  );
}

export default App;
