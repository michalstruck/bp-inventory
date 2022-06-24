const defVal = [[]];

const Main = ({ valueKeys }: { valueKeys: any }) => {
  const getData = () =>
    valueKeys.map((el: string[], i: number) => (
      <tr key={i + 240}>
        <td>{el[0]}</td>
        <td>{el[1]}</td>
        <td>{el[el.length !== 1 ? el.length - 1 : "69696969"]}</td>
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
