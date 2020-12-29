fileInput = document.querySelector("input")
fileInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  clear();

  let reader = new FileReader();
        reader.addEventListener('load', function(e) {
                let text = e.target.result;
                let polygons = readPolygons(text)
                main(polygons)
        });
  reader.readAsText(file);
})

function main(polygons) {
    drawPolygon(polygons[0], "black")
    drawPolygon(polygons[1], "blue")
    const events1 =getPolygonEvents(polygons[0]);
    const events2 =getPolygonEvents(polygons[1]);

    const mergedEvents = mergeEvents(events1, events2);
 
    const intersections = getIntersections(polygons[0],polygons[1],mergedEvents)
   
    drawAllPoints(polygons, intersections)

    console.log(intersections);
}

function setup() {
    createCanvas(600, 600);
  }