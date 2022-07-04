import { SyntheticEvent, useEffect, useState } from "react";
import { gapi } from "gapi-script";
import credentials from "./client_secret.json";
import Main from "./components/Main";
import Card from "./components/Card";

const apiKey = credentials.api_key;
const discoveryDocs = [
  "https://sheets.googleapis.com/$discovery/rest?version=v4",
];
const clientId = credentials.client_id;
const scopes = "https://www.googleapis.com/auth/spreadsheets";

function App() {
  const authorizeButton = document.getElementById("authorize-button");
  const signoutButton = document.getElementById("signout-button");
  const [valueKeys, setValueKeys] = useState<string[]>([""]);

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
      fetchData();
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

  const fetchData = () => {
    const params = {
      spreadsheetId: "1aQ5r9B5-NVY2ETiUx1tV2ket7ljyv6T0J4BwV5Ttdps",
      range: "SŁONY!A:C",
      majorDimension: "COLUMNS",
    };
    const request = gapi.client.sheets.spreadsheets.values.get(params);
    request.then(
      ({ result }: any) => {
        console.log(result);
        setValueKeys(result.values);
      },
      ({
        result: {
          error: { message },
        },
      }: any) => {
        console.error("error: " + message);
      }
    );
  };
  const addNewValues = () => {
    fetchData();
    const values = [["1", "2", "3", "4", "5", "6", "7"]];
    const body = {
      values: values,
      majorDimension: "COLUMNS",
    };
    const params = {
      spreadsheetId: "1aQ5r9B5-NVY2ETiUx1tV2ket7ljyv6T0J4BwV5Ttdps",
      //for it to append values to a partially full column
      //you need to `SŁONY!C${valueKeys[2].length}` and make it fetch
      range: `SŁONY!C${valueKeys[2].length + 1}`,
      // range: "SŁONY!C8",
    };
    console.log(params.range);
    gapi.client.sheets.spreadsheets.values
      .append({
        // spreadsheetId: params.spreadsheetId,
        // range: params.range,
        ...params,
        valueInputOption: "RAW",
        resource: body,
      })
      .then((response) => {
        var result = response.result;
        console.log(`${result.updates?.updatedCells} cells appended.`);
      });
  };

  const addEmptyColumn = () => {
    const params = {
      spreadsheetId: "1aQ5r9B5-NVY2ETiUx1tV2ket7ljyv6T0J4BwV5Ttdps",
    };
    const sheetId = 40983018; //SŁONY

    const batchUpdateSpreadsheetRequestBody = {
      requests: [
        {
          insertDimension: {
            range: {
              sheetId: sheetId,
              dimension: "COLUMNS",
              startIndex: 2,
              endIndex: 3,
            },
            inheritFromBefore: false,
          },
        },
      ],
    };
    const request = gapi.client.sheets.spreadsheets.batchUpdate(
      params,
      batchUpdateSpreadsheetRequestBody
    );
    request.then(
      function (response) {
        console.log(response.result);
      },
      function (reason) {
        console.error("error: " + reason.result.error.message);
      }
    );
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
          onClick={fetchData}
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
