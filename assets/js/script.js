const video = document.getElementById("video");
var labels = []
var canvas;
var NAME;
var DATA;
var COMPANY;

// const socket = io()
const firebaseConfig = {
      apiKey: "AIzaSyBZnFJQJlCQEFdvmFLI0gkSCHHiH1lUAWo",
      authDomain: "node-file-uploader.firebaseapp.com",
      projectId: "node-file-uploader",
      storageBucket: "node-file-uploader.appspot.com",
      messagingSenderId: "345185058962",
      appId: "1:345185058962:web:8629baa36820a3c410a64b",
      measurementId: "G-GSV81VWQE1"
    };
  
firebase.initializeApp(firebaseConfig);

Promise.all([
  faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
  faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
  faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
])
  .then(startWebcam)
  .then(faceRecognition);

function startWebcam(){
  navigator.mediaDevices
    .getUserMedia({
      video: true,
      audio: false,
    })
    .then((stream) => {
      video.srcObject = stream;
    })
    .catch((error) => {
      console.error(error);
    });
    
}

async function getLabels(){
  var listRef = await firebase.storage().ref(`labels`);
    // Find all the prefixes and items.
    await listRef.listAll()
      .then((res) => {
        res.prefixes.forEach((folderRef) => {
          // labels = []
          // console.log(folderRef)
          // All the prefixes under listRef.
          // You may call listAll() recursively on them.
          // console.log(folderRef.location.path_.slice(7))
          labels.push(folderRef.location.path_.slice(7))
        });
        // res.items.forEach((itemRef) => {
          // All the items under listRef.
        // });
      }).catch((error) => {
        // Uh-oh, an error occurred!
        console.error(error)
      });
      // console.log(labels)
}


function getLabeledFaceDescriptions() {
  getLabels()
  // const response =  await fetch('https://face-registration.onrender.com/getLabels')
  // const labels = await response.json()
  // console.log(labels)
  return Promise.all(
    labels.map(async (label) => {
      const descriptions = [];
        let path = `labels/${label}`
        await firebase.storage().ref(path).child(`1`).getDownloadURL()
        .then(async (url) => {
          const img = await faceapi.fetchImage(url)
          // console.log(url)
          const detections = await faceapi
            .detectSingleFace(img)
            .withFaceLandmarks()
            .withFaceDescriptor();
          descriptions.push(detections.descriptor);
          })
        .catch((error) => {
          // Handle any errors
          console.error(error)
        });
        // console.log(descriptions)
      // }
      return new faceapi.LabeledFaceDescriptors(label, descriptions);
    })
  );
  // })
}

video.addEventListener("playing", () => {
// location.reload();
faceRecognition()
});
async function faceRecognition() {
  const labeledFaceDescriptors = await getLabeledFaceDescriptions();
  const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors);
  
    canvas = faceapi.createCanvasFromMedia(video);
    document.body.append(canvas);

    const displaySize = { width: video.width, height: video.height };
    faceapi.matchDimensions(canvas, displaySize);

    // setInterval(async () => {
      const detections = await faceapi
        .detectAllFaces(video)
        .withFaceLandmarks()
        .withFaceDescriptors();

        // console.log(detections)

      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      // console.log(`Redsized Detections: ${resizedDetections}`)
      // canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);

      const results = resizedDetections.map((d) => {
        // console.log(d)
        return faceMatcher.findBestMatch(d.descriptor);
      });
      // console.log(results) 
      results.forEach((result, i) => {
        // console.log(result._label)
        const box = resizedDetections[i].detection.box;
        // const drawBox = new faceapi.draw.DrawBox(box, {
          // label: result._label,
        // });
        DATA = result._label.split('+')
        // drawBox.draw(canvas);
        setTimeout(
          showPrint,1000
        )
      });
    // }, 5000);
}


function showPrint(){
  NAME = DATA[0]
  COMPANY = DATA[1]
  canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
  document.getElementById('video').style.display = 'none'
  // document.getElementById('canvas').style.display = 'none'
  document.getElementById('body').style.backgroundImage="url(../assets/images/bgs/Webscreen3.png)";
  document.getElementById('PrintBadge').style.display = 'flex'
  document.getElementById('Name').innerHTML += NAME
  document.getElementById('Company').innerHTML += COMPANY
}

// function printBadge(){
//   downloadReceipt()
//   showThanks()
// }

function showThanks(){
    document.getElementById('PrintBadge').style.display = 'none'
    document.getElementById('showThanks').style.display = 'flex'
    setTimeout(()=>{
      location.reload()
    },1000)
}


function downloadReceipt() {
  // document.getElementById('print').style.display = 'none'
  const data = document.getElementById('show');
  html2canvas(data,{allowTaint:true}).then(async(canvas) => {
  const image64 = canvas.toDataURL();
  const data = { image64 };
  const options1 = {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
  };
  const response = await fetch('http://localhost:3000/upload', options1)
  const res_data = await response.json()
  console.log(res_data.ImageName)
  showThanks()
  })
}

function goBack(){
  location.reload()
}