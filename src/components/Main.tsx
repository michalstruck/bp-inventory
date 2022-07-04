const Main = ({ valueKeys }: { valueKeys: string[] }) => {
  const getData = () =>
    valueKeys.map((el, i) => (
      <tr key={i + 240}>
        <td key={i}>{el} </td>
      </tr>
    ));
  return (
    <div>
      <table>
        <tbody>{getData()}</tbody>
      </table>
    </div>
  );
};

export default Main;
