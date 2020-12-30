const canvasHeight = 500
const canvasWidth = 500

fileInput = document.querySelector("input")
fileInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  clear();

  let reader = new FileReader();
        reader.addEventListener('load', function(e) {
                let text = e.target.result;
                let points = readFile(text)
                main(points)
        });
  reader.readAsText(file);
})

function readFile(objString){
    objString= objString.replace(/(\r\n|\n|\r)/gm, " ");
    objString = objString.trim()
    const objSplit = objString.split(" ");
    const vertices = []
    
    for(let i=0;i<objSplit.length;i++){
        let point = new Point(objSplit[i+1],objSplit[i+2])
        i+=2
        vertices.push(point);
    }

    return vertices
}

function setup() {
    createCanvas(500, 500);
}

function main(points){
    console.log(points)

    let quadTree = new QuadTree(new Node(points, null, 0, 0, 500, 500))
    quadTree.nodes.splitPointsinNode()

    quadTree.draw()
}