const fetchData = async ({ url, body, isFetching, setIsFetching }) => {
  if (isFetching) return;

  try {
    setIsFetching(true);

    const res = await fetch(url, body);

    if (res.ok) {
      return true;
    }
  } catch (err) {
    console.log(err.message);
  } finally {
    setIsFetching(false);
  }
};

export default fetchData;
