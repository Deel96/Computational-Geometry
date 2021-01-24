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
            let polygon = readPolygons(text)
            main(polygon)
    });
  reader.readAsText(file);
})

function setup() {
    const canvas = createCanvas(canvasHeight, canvasWidth);
    //canvas.parent(document.body);
}

function main(polygon){
    let mesh = new Mesh()
    mesh.initialize(polygon[0])
    mesh.serperateToMonotone()
    mesh.triangulate()
    mesh.createDualGraph()

    mesh.draw()
    mesh.dual.draw()

}

function readPolygons(objString) {
    var points = [];
    var polygons = [];

    const vertices = []
    const objSplit = objString.split(/(\r\n|\n|\r)/gm);

    objSplit.forEach(line => {
        var tokens = splitTokens(trim(line));
        if (tokens.length > 0) {
            if (tokens[0] == 'v') {
                points.push(new Point(parseFloat(tokens[1]), parseFloat(tokens[2])));
            }

            if (tokens[0] == 'f') {
                var polygonPoints = [];
                for (i = 1; i < tokens.length; i++) {
                    polygonPoints.push(points[parseInt(tokens[i]) - 1]);
                }
                polygons.push(polygonPoints);
            }
        }
    });

    return polygons;
}