const fetchData = async ({ url, body, isFetching, setIsFetching }) => {
  console.log(isFetching);
  if (isFetching) return;

  setIsFetching(true);
  try {
    const res = await fetch(url, body);

    return res;
  } catch (err) {
    console.log(err.message);
  } finally {
    setIsFetching(false);
  }
};

export default fetchData;
