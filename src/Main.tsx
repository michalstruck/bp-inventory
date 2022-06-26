import { ValueKeys } from "./App";

const Main = ({ valueKeys }: { valueKeys: ValueKeys }) => {
  const getData = () => (
    <tr>
      <td>{valueKeys.name}</td>
      <td>{valueKeys.measure}</td>
      <td>{valueKeys.lastEntry}</td>
    </tr>
  );
  console.log(valueKeys.name);
  return (
    <div>
      <table>
        <tbody>{getData()}</tbody>
      </table>
    </div>
  );
};

export default Main;
