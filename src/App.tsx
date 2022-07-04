import { SyntheticEvent, useEffect } from "react";
import { gapi } from "gapi-script";
import credentials from "./client_secret.json";
import Main from "./components/Main";
import Card from "./components/Card";
import useSheet from "./common/useSheet";

const apiKey = credentials.api_key;
const discoveryDocs = [
  "https://sheets.googleapis.com/$discovery/rest?version=v4",
];
const clientId = credentials.client_id;
const scopes = "https://www.googleapis.com/auth/spreadsheets";

function App() {
  const authorizeButton = document.getElementById("authorize-button");
  const signoutButton = document.getElementById("signout-button");
  const { addEmptyColumn, fetchCellValues, addNewValues, valueKeys } =
    useSheet();

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
      fetchCellValues();
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

  return (
    <div className="grid place-items-center">
      <div className="grid place-items-center bg-zinc-600 w-96 h-96 elevation-10 rounded-lg">
        <button
          className="w-24 h-12 button-animation bg-zinc-400 rounded-lg elevation-5"
          onClick={handleAuthClick}
          id="authorize-button"
        >
          google signin
        </button>
        <button
          onClick={handleSignoutClick}
          className="w-24 h-12 button-animation bg-zinc-400 rounded-lg elevation-5"
          id="signout-button"
        >
          signout
        </button>
        <button
          onClick={fetchCellValues}
          className="w-24 h-12 button-animation bg-zinc-400 rounded-lg elevation-5"
        >
          fetch
        </button>
        <button
          onClick={addNewValues}
          className="w-24 h-12 button-animation bg-zinc-400 rounded-lg elevation-5"
        >
          update
        </button>
        <button
          onClick={addEmptyColumn}
          className="w-24 h-12 button-animation bg-zinc-400 rounded-lg elevation-5"
        >
          add cols
        </button>
      </div>
      <Card />
      <Main valueKeys={valueKeys} />
    </div>
  );
}

export default App;
