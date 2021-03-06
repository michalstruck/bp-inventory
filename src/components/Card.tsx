const Card = () => {
  return (
    <div className="mt-5 grid place-items-center bg-emerald-500 rounded-lg elevation-5">
      <form className="w-fit h-56 p-8 flex flex-col items-center">
        <label>Ilość</label>
        <input type="text" />
        <br />
        <br />
        <div className="flex flex-row">
          <button
            onClick={(e) => e.preventDefault()}
            className="bg-emerald-600 button-animation m-1 rounded-sm elevation-5 p-2"
          >
            Pomiń
          </button>
          <button
            onClick={(e) => e.preventDefault()}
            className="bg-emerald-600 button-animation m-1 rounded-sm elevation-5 p-2"
          >
            Następny
          </button>
          <button
            onClick={(e) => e.preventDefault()}
            className="bg-emerald-600 button-animation m-1 rounded-sm elevation-5 p-2"
          >
            Poprzedni
          </button>
        </div>
      </form>
    </div>
  );
};

export default Card;
