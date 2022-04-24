import React, {useState, useEffect} from 'react';
import axios from 'axios';

function App() {

  const [test, setTest] = useState("");

  const getData = async () => {
    const testData = await (await axios({
      url: '/hello',
      method: 'GET',
    })).data
    setTest(testData);
  }

  useEffect(() => {
    getData();
  }, [])

  return (
    <div>
      <p>{test}</p>
    </div>
  );
}

export default App;
