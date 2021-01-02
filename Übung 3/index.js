const canvasHeight = 500
const canvasWidth = 500

const select = document.querySelector("#neighbourSelect");

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
    const canvas = createCanvas(500, 500);
    //canvas.parent(document.body);
}

function main(points){
   
   
    console.log(points)

    let quadTree = new QuadTree(new Node(points, null, 0, 0, 500, 500))
    quadTree.nodes.splitPointsinNode();

    quadTree.draw(quadTree.nodes)

    select.addEventListener("change",(event)=>{
        // let node =getNeighbour(event.target.value,quadTree)

        // let c = color(0,255,0);
        // fill(c);
        // noStroke();
        // rect(node.x,-node.y+500,node.width,-node.height)

        quadTree.drawSquare(quadTree.currentNode);
    })
    
}


function getNeighbour(neighbour,quadTree){
    if(neighbour =="North")
        return findNorthNeighbour(quadTree.currentNode,quadTree);
    if(neighbour =="West")
        return findWestNeighbour(quadTree.currentNode,quadTree);
    if(neighbour =="East")
        return findEastNeighbour(quadTree.currentNode,quadTree);
    if(neighbour =="South")
        return findSouthNeighbour(quadTree.currentNode,quadTree);
}

function findNorthNeighbour(node, tree){
    if(node == tree.nodes) return null;

    if(node == node.parentNode.sw) return node.parentNode.nw; 

    if(node == node.parentNode.se) return node.parentNode.ne;

    let muh = findNorthNeighbour(node.parentNode,tree);

    if(muh == null || isLeaf(muh) ) return muh;

    else{
        if(node == node.parentNode.nw) return muh.sw;
        else return muh.se;
    }
}

function findWestNeighbour(node, tree){
    if(node == tree.nodes) return null;

    if(node == node.parentNode.ne) return node.parentNode.nw; 

    if(node == node.parentNode.se) return node.parentNode.sw;

    let muh = findWestNeighbour(node.parentNode,tree);

    if(muh == null || isLeaf(muh) ) return muh;

    else{
        if(node == node.parentNode.nw) return muh.ne;
        else return muh.se;
    }
}

function findEastNeighbour(node, tree){
    if(node == tree.nodes) return null;

    if(node == node.parentNode.nw) return node.parentNode.ne; 

    if(node == node.parentNode.sw) return node.parentNode.se;

    let muh = findEastNeighbour(node.parentNode,tree);

    if(muh == null || isLeaf(muh) ) return muh;

    else{
        if(node == node.parentNode.ne) return muh.nw;
        else return muh.sw;
    }
}

function findSouthNeighbour(node, tree){
    if(node == tree.nodes) return null;

    if(node == node.parentNode.ne) return node.parentNode.se; 

    if(node == node.parentNode.nw) return node.parentNode.sw;

    let muh = findSouthNeighbour(node.parentNode,tree);

    if(muh == null || isLeaf(muh) ) return muh;

    else{
        if(node == node.parentNode.se) return muh.ne;
        else return muh.nw;
    }
}

function isLeaf(node){
    return node.points <2;
}