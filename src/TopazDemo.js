import { useEffect, useRef, useState } from 'react'

// Could not get the timer to work in state.
let timer;

export default function TopazDemo() {
  const [sigVersion, setSigVersion] = useState(undefined)
  const [bioData, setBioData] = useState(undefined)
  const [base64Data, setBase64Data] = useState(undefined)
  const signatureCanvas = useRef(null)

  useEffect(() => {
    (async function () {
      if (!sigVersion && window.IsSigWebInstalled()) {
        try {
          setSigVersion(window.GetSigWebVersion())
          window.SetJustifyMode(0);
          window.SetImagePenWidth(10);
        } catch (e) {
          console.error(e)
          return
        }
      }
    })()
    return () => {
      window.Reset()
      clearInterval(timer)
      timer = undefined
    }
  })

  function handleSign(e) {
    if (!timer) {
      window.SetTabletState(0, timer);
    }
    const ctx = signatureCanvas.current.getContext('2d');
    timer = window.SetTabletState(1, ctx, 50)
  }

  function handleClear(e) {
    const canvas = signatureCanvas.current
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    setBase64Data("")
    setBioData("")
    window.ClearTablet();
  }

  function handleDone(e) {
    if (window.NumberOfTabletPoints() === 0) {
      alert("Oh shoot, you didn't sign!");
    } else {
      window.SetTabletState(0, timer);
      window.SetSigCompressionMode(1);
      setBioData(window.GetSigString())
      window.GetSigImageB64((v) => setBase64Data(v));
    }
  }

  // Don't interact with the tablet in the draw function in real life, it will kill performance.
  const size = { x: window.GetTabletLogicalXSize(), y: window.GetTabletLogicalYSize() }
  return (
    <div>
      {sigVersion === undefined ? <span>Checking your SigWeb version...</span>
        : sigVersion ? (
          <div>
            <br />
            <p>SigWeb {sigVersion} installed</p>
            <p>Firmware: {window.GetFirmwareRevision()}</p>
            <p>Tablet data: {window.GetTabletData()}</p>
            <p>model: {window.TabletModelNumber()}, serial: {window.TabletSerialNumber()}, resolution: {size.x}x{size.y} </p>
            <p>SigWeb Certificate expires in {window.GetDaysUntilCertificateExpires()} days.</p>

            <button onClick={handleSign}>Sign</button>&nbsp;&nbsp;&nbsp;&nbsp;
            <button onClick={handleClear} >Clear</button>&nbsp;&nbsp;&nbsp;&nbsp;
            <button onClick={handleDone}>Done</button>&nbsp;&nbsp;&nbsp;&nbsp;
            <br />
            <br />
            <div style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }} >

              <canvas
                ref={signatureCanvas}
                width={size.x / 2 }
                height={size.y / 2}
                style={{
                  border: "black 15px solid",
                  borderRadius: 15,
                  backgroundColor: "lightgrey"
                }} />
            </div>
            <br />
            <br />
            <textarea name="sigStringData" rows="20" cols="50" defaultValue="SigString:" value={bioData} />
            <textarea name="sigImageData" rows="20" cols="50" defaultValue="Base64 String:" value={base64Data} />
          </div>)
          :
          (<span>Couldn't find SigWeb ! You need to download and install the <a href="https://topazsystems.com/sdks/sigweb.html">SigWeb driver</a> and attach your Topaz signature pad for this to work.</span>)
      }
    </div>)
}