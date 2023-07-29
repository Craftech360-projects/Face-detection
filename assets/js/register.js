var IMGNAME;
var _ID;

function start(){
    document.getElementById('container1').style.display = 'none'
    document.getElementById('container2').style.display = 'flex'
    // startWebcam()
}

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


(() => {
    const width = 300; // We will scale the photo width to this
    let height = 0; // This will be computed based on the input stream
  
    
    let streaming = false;
   
    let video = null;
    let canvas = null;
    let photo = null;
    let startbutton = null;
  
    function showViewLiveResultButton() {
      if (window.self !== window.top) {
       document.querySelector(".contentarea").remove();
        const button = document.createElement("button");
        button.textContent = "View live result of the example code above";
        document.body.append(button);
        button.addEventListener("click", () => window.open(location.href));
        return true;
      }
      return false;
    }
  

    function startup() {
      if (showViewLiveResultButton()) {
        return;
      }
      video = document.getElementById("video");
      canvas = document.getElementById("canvas");
      photo = document.getElementById("photo");
      startbutton = document.getElementById("startbutton");
  
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: false })
        .then((stream) => {
          video.srcObject = stream;
          video.play();
        })
        .catch((err) => {
          console.error(`An error occurred: ${err}`);
        });
  
      video.addEventListener(
        "canplay",
        (ev) => {
          if (!streaming) {
            height = video.videoHeight / (video.videoWidth / width);
  
           
            if (isNaN(height)) {
              height = width / (4 / 3);
            }
  
            video.setAttribute("width", width);
            video.setAttribute("height", height);
            canvas.setAttribute("width", width);
            canvas.setAttribute("height", height);
            streaming = true;
          }
        },
        false
      );
  
      startbutton.addEventListener(
        "click",
        (ev) => {
          takepicture();
          ev.preventDefault();
        },
        false
      );
  
    //   clearphoto();
    }
  
    function takepicture() {
        document.getElementById('video').style.display = 'none'
        document.getElementById('canvas').style.display = 'block'
      const context = canvas.getContext("2d");
      if (width && height) {
        canvas.width = width;
        canvas.height = height;
        context.drawImage(video, 0, 0, width, height);
        // canvas.style.display = 'block'
        const data = canvas.toDataURL("image/png");
        // photo.setAttribute("src", data);
      } else {
        clearphoto();
      }
    }
    window.addEventListener("load", startup, false);
})(); 


function retake(){
  document.getElementById('canvas').style.display = 'none'
  document.getElementById('video').style.display = 'block'
}

function regPage(){
  document.getElementById('container2').style.display = 'none'
  document.getElementById('over').style.display = 'flex'
  // submitImage()
}

async function handleSubmit(){
    
  // e.preventDefault()
  const canvas =  document.getElementById('canvas')
  const image64 = canvas.toDataURL();
  // const data = { 'image':image64 };
  const name = document.getElementById("fname").value
  const email = document.getElementById("email1").value
  const company = document.getElementById("company").value
  const city = document.getElementById("city").value

  if(!name || !email || !company || !city){
  alert("Please fill all fields")
  }
  else{
      const data= {name, company, email, city, IMGNAME,image64 }
      // console.log(data)
      const options1 = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
    };
      

      uploadImage(image64)
      function uploadImage(your_base64_image) {
            firebase.storage().ref(`labels/${name}+${company}`).child(`1`)
            .putString(your_base64_image, 'data_url', {contentType:'image/png'})
            .then(snapshot => snapshot.ref.getDownloadURL())
            .then(url => {
                console.log(url);
            })
            .then(showThanks())
            .catch(console.error);
        }
      // await fetch('http://localhost:3000/addUser', options1)
      //         .then(response=>response.json())
      //         // .then(submitImage())
      //         .then(data=>{
      //             _ID = data._ID
      //             console.log(_ID)})
      //         .then(showThanks())
      }
}

async function submitImage(){
  const canvas =  document.getElementById('canvas')
  const image64 = canvas.toDataURL();
  uploadImage(image64)
  // const data = { image64 };
  // const options1 = {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json'
  //   },
  //   body: JSON.stringify(data)
  // };
  // const res = await fetch('https://face-registration.onrender.com/upload', options1)
  // const res_data = await res.json()
  // IMGNAME = res_data.ImageName
  // console.log(IMGNAME)
  //    console.log(firebase);
    function uploadImage(your_base64_image) {
        firebase.storage().ref(`labels`).child(`${Date.now()}`)
        .putString(your_base64_image, 'data_url', {contentType:'image/jpg'})
        .then(snapshot => snapshot.ref.getDownloadURL())
        .then(url => {
            console.log(url);
        })
        .catch(console.error);
    } 
}


function showThanks(){
  document.getElementById('over').style.display = 'none'
  document.getElementById('showThanks').style.display = 'flex'   
}
