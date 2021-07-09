import { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';

const filters = [
  { vendorId: 0x0801, productId: 0x0001 }
];

let reader = undefined;
function handleConnectedDevice(e) {
  console.log("Device connected: " + e.device.productName);
}

function handleDisconnectedDevice(e) {
  console.log("Device disconnected: " + e.device.productName);
}
navigator.hid.addEventListener("connect", handleConnectedDevice);
navigator.hid.addEventListener("disconnect", handleDisconnectedDevice);

function App() {
  const [readerError, setReaderError] = useState(undefined);
  const [readerData, setReaderData] = useState(undefined);

  useEffect(() => {
    if (reader){
      reader.addEventListener("inputreport", handleCardRead);
    }
    return () => {
      if (reader) {
        reader.removeEventListener("inputreport", handleCardRead);
      }
    }
  });
  async function requestReader(e){
    if (reader){
      return
    }
    try {
        console.log("Requesting the reader...");
        if (reader === undefined) {
          reader = await navigator.hid.requestDevice({ filters });
          console.log(`Opening ${reader.productName}...`);
          reader.oninputreport = handleCardRead
          // reader.addEventListener("inputreport", handleCardRead);
        }
      } catch (err) {
        console.error(err);
      }
  }

  function handleCardRead(e) {
    console.log(e.device.productName + ": got input report " + e.reportId);
    debugger;
    console.log(new Uint8Array(e.data.buffer));
    setReaderData(e.data)
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

        <button onClick={requestReader} disabled={false}>Request Reader</button>
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
