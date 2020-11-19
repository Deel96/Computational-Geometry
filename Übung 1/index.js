class Point{
  constructor(x,y){
    this.x = x;
    this.y = y;
  }
}


const resultArray=[];
  
fileInput = document.querySelector("input")
fileInput.addEventListener("change", (event) => {
  const file = event.target.files[0];

  let reader = new FileReader();
        reader.addEventListener('load', function(e) {
                let text = e.target.result;
                main(text)
        });
  reader.readAsText(file);
})

function main(objString) {
  const vertices = []
  // g=Global -> all matches
  // m= Multiline
  objString= objString.replace(/(\r\n|\n|\r)/gm, " ");
  objString = objString.trim()
  const objSplit = objString.split(" ");

  
  for(let i=0;i<objSplit.length;i++){
    let point = new Point(objSplit[i+1],objSplit[i+2])
    i+=2
    vertices.push(point);
  }
  
  const steps= GrahamScan(vertices);

  let stepCount = 0;
  const intervallId= setInterval(()=>{
    clear();
    drawAllPoints(vertices);
    DrawStep(steps[stepCount]);
    if(stepCount === steps.length-1){
      clearInterval(intervallId);
    }
    stepCount++;
  },800)
  
  console.log("CW")
  console.log("--------------------")
  for(let i = 0; i < steps[steps.length-1].red.length - 1; i++){
    let entry = steps[steps.length-1].red[i]
    console.log("X: " + entry.x, "Y: " + entry.y)
  }

  console.log("CCW")
  console.log("--------------------")
  for(let i = steps[steps.length-1].red.length - 1; i > 0; i--){
    let entry = steps[steps.length-1].red[i]
    console.log("X: " + entry.x, "Y: " + entry.y)
  }
}


function DrawStep(step){
  drawLines(step.red,"red")
  drawLines(step.blue,"blue");
}

function drawLines(vertices,color){
  for(let i=0;i<vertices.length-1;i++){
    drawLine(vertices[i].x,vertices[i].y,vertices[i+1].x,vertices[i+1].y,color);

    textSize(8);
    text(`${vertices[i].x} / ${vertices[i].y}`, vertices[i].x,-vertices[i].y+500);


  }
}

function drawAllPoints(vertices){
  stroke("purple");
  strokeWeight(5);
  for(let entry of vertices){
    drawPoint(entry.x,entry.y)
  }
}

function setup() {
  createCanvas(600, 500);
}
 
function draw() {
}

function drawPoint(x,y){
  point(x,-y+500)
}

function drawLine(xStart,yStart,xEnd,yEnd,color="green"){
  stroke(color);
  strokeWeight(1);
  line(xStart,-yStart+500,xEnd,-yEnd+500)
}

function sortPoints(points){
  const sorted = [...points];
  sorted.sort((p1,p2)=>{
    if(p1.x == p2.x){
      return p1.y-p2.y
    }else{
      return p1.x - p2.x
    }
  })

  return sorted;
}

function GrahamScan(points){
  const steps=[];
  const lUpper =[];
  const sorted =sortPoints(points);
  lUpper.push(sorted[0],sorted[1]);

  for(let i =2; i<sorted.length;i++){
    let redArray =[...lUpper];
    lUpper.push(sorted[i]);
    
    const blueArray= [...lUpper].splice(-2);

    steps.push({
      red:redArray,
      blue:blueArray});

    while(lUpper.length>2 &&  !checkForRight(lUpper[lUpper.length-3], lUpper[lUpper.length-2], lUpper[lUpper.length-1])){     
      lUpper.splice(lUpper.length - 2 ,1);
    }
  }

  //Wird für die weiteren Steps benötigt
  const lUpperFinal = [...lUpper];
  lUpperFinal.pop();

  const lLower =[];
  lLower.push(sorted[sorted.length-1],sorted[sorted.length-2]);

  for(let i =sorted.length-3; i>=0;i--){
    drawAllPoints(sorted);
    const redArrayLower =[...lLower];
    lLower.push(sorted[i]);
  
    const blueArrayLower= [...lLower].splice(-2);
   
    let redResultArray =[...lUpperFinal];
    redResultArray.push(...redArrayLower);

    steps.push({
      red:redResultArray,
      blue:blueArrayLower
    });

  
    while(lLower.length > 2 &&  !checkForRight(lLower[lLower.length - 3], lLower[lLower.length - 2], lLower[lLower.length - 1])){
      lLower.splice(lLower.length-2,1);
    }
  }
  const lComplete =[...lUpperFinal]
  const lLowerFinal = [...lLower];

  lComplete.push(...lLowerFinal);

  steps.push({
    red:lComplete,
    blue:[]});

  return steps;
}

function checkForRight(p,w,q){
  //Durch die Spiegelung des Koordinatensystem dreht sich das Vorzeichen
  //von den Kurven
  return ((q.x - p.x) * (w.y - p.y) - (q.y - p.y) * (w.x - p.x) ) >=0
}
