import { useEffect, useState } from 'react';
import './App.css';

const vendorId = 0x0801;
const productId = 0x0002;
const filters = [{ vendorId, productId }];

function App() {
  const [errMsg, setErrMsg] = useState(undefined);
  const [magStripeString, setMagStripeString] = useState(undefined);
  const [reader, setReader] = useState(undefined);

  function handleConnectedDevice(e) {
    const device = e.device;
    // == on purpose here.
    if (device.productId == productId && device.vendorId == vendorId){
      console.log("MagTek reader added...")
      setReader(device);
    }
  }

  function handleDisconnectedDevice(e) {
    e.device.oninputreport = undefined;
    setReader(undefined);
  }

  // This effect tries to acquire the device if it has already been paired.
  useEffect(() => {
    (async () => {
      if (reader) {
        return;
      }
      console.log("looking for readers");
      const devices = await navigator.hid.getDevices();
      devices.forEach(device => {
        // == on purpose here.
        if (device.productId == productId && device.vendorId == vendorId){
          console.log("Found a pre-paired reader...");
          setReader(device);
        }
      });
    })()

  })
  // This effect handles the case that the device was plugged in while this component
  // is mounted.
  useEffect(() => {
    navigator.hid.addEventListener("connect", handleConnectedDevice);
    navigator.hid.addEventListener("disconnect", handleDisconnectedDevice);
    return () => {
      navigator.hid.removeEventListener("connect", handleConnectedDevice);
      navigator.hid.removeEventListener("disconnect", handleDisconnectedDevice);
    }
  });

  //This effect instruments a new reader after it's set.
  useEffect(() => {
    if (!reader) {
      // The reader was removed.
      return;
    }

    (async () => {
      console.log("reader was just set");
      if (reader.opened) {
        console.log("reader was already open")
        return;
      }

      try {
        console.log("opening the reader...")
        await reader.open();
        reader.oninputreport = handleCardRead;
        console.log("reader is ready")
      } catch (err) {
        console.error(err);
        setErrMsg(`Could not open the device: ${err}`)
        setReader(undefined);
      }
    })();
  }, [reader]);

  async function requestPairReader(e) {
    // Just checking
    if (reader) {
      return
    }
    console.log("attempting to pair an un-paired reader.");
    try {
      const selected = await navigator.hid.requestDevice({ filters });
      if (!selected || selected.length === 0) {
        return
      }
      setReader(selected[0]);

    } catch (err) {
      console.error(err);
      setErrMsg(`Could not pair the device: ${err}`)
    }
  }

  function handleCardRead(e) {
    setMagStripeString(new TextDecoder("utf-8").decode(e.data));
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src="data:image/png;base64,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" alt="logo" />
      </header>
      <button onClick={requestPairReader} disabled={!!reader && reader.opened}>Request Reader</button>
      <div>
        <span>Mag stripe data:</span>
        <pre>{magStripeString}</pre>
      </div>
      {errMsg && <div>
        <span>Mag stripe error:</span>
        <pre>{errMsg}</pre>
      </div>
      }
    </div>
  );
}

export default App;
