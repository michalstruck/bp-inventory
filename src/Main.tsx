const Main = ({ valueKeys }: { valueKeys: string[] }) => {
  const getData = () => (
    <tr>
      {/* {valueKeys.map((el, i) => (
        <>
          <td key={i}>{el.name}</td>
          <td key={i + 1}>{el.measure}</td>
          <td key={i + 2}>{el.lastEntry}</td>
        </>
      ))} */}
    </tr>
  );
  return (
    <div>
      <table>
        <tbody>{getData()}</tbody>
      </table>
    </div>
  );
};

export default Main;
