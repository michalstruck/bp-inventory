import { useState } from "react";

const useSheet = () => {
  const [valueKeys, setValueKeys] = useState<string[]>([""]);

  const fetchCellValues = () => {
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
    fetchCellValues();
    const values = [["1", "2", "3", "4", "5", "6", "7"]];
    const body = {
      values: values,
      majorDimension: "COLUMNS",
    };
    const params = {
      spreadsheetId: "1aQ5r9B5-NVY2ETiUx1tV2ket7ljyv6T0J4BwV5Ttdps",
      //appends new values to the column
      range: `SŁONY!C${(valueKeys[2]?.length ?? 0) + 1}`,
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
        const result = response.result;
        console.log(`${result.updates?.updatedCells} cells appended.`);
        fetchCellValues();
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
  return { addEmptyColumn, fetchCellValues, addNewValues, valueKeys };
};

export default useSheet;
