import Login from "./components/Login";
import Logout from "./components/Logout";
import { SyntheticEvent, useEffect } from "react";
import { gapi } from "gapi-script";
import credentials from "./client_secret.json";

const apiKey = credentials.api_key;
const discoveryDocs = [
  "https://sheets.googleapis.com/$discovery/rest?version=v4",
];
const clientId = credentials.client_id;
const scopes = "https://www.googleapis.com/auth/spreadsheets";
const authorizeButton = document.getElementById("authorize-button");
const signoutButton = document.getElementById("signout-button");

function App() {
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

  const handleAuthClick = (event: SyntheticEvent) => {
    gapi.auth2.getAuthInstance().signIn();
  };

  const handleSignoutClick = (event: SyntheticEvent) => {
    gapi.auth2.getAuthInstance().signOut();
  };

  const makeApiCall = () => {
    const params = {
      // The spreadsheet to request.
      spreadsheetId: "1BiFcix7htCYmrV6v1DknnsA4ddTp56Nm76_m2PFap8Q",
      // The ranges to retrieve from the spreadsheet.
      ranges: [],
      // True if grid data should be returned.
      // This parameter is ignored if a field mask was set in the request.
      includeGridData: true,
    };
    //@ts-ignore
    const request = gapi.client.sheets.spreadsheets.get(params);
    request.then(
      (res: { result: any }) => {
        // TODO: Change code below to process the `response` object:
        console.log(res.result);
      },
      (res: { result: { error: { message: string } } }) => {
        console.error("error: " + res.result.error.message);
      }
    );
  };
  useEffect(() => handleClientLoad(), []);
  return (
    <div className="App">
      <button onClick={handleAuthClick} id="authorize-button">
        signin
      </button>
      <button onClick={handleSignoutClick} id="signout-button">
        signout
      </button>
      <button onClick={makeApiCall}>fetch</button>

      <Login />
      <Logout />
    </div>
  );
}

export default App;
