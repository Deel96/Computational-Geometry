function readPolygons(objString) {
    var points = [];
    var polygons = new Array();


    const vertices = []
    const objSplit = objString.split(/(\r\n|\n|\r)/gm);

    objSplit.forEach(line => {
        var tokens = splitTokens(trim(line));
        if (tokens.length > 0) {
            if (tokens[0] == 'v') {
                points.push(
                    new Point(parseFloat(tokens[1]), parseFloat(tokens[2]))
                );
            }

            if (tokens[0] == 'f') {
                var polygonPoints = [];
                for (i = 1; i < tokens.length; i++) {
                    polygonPoints.push(points[parseInt(tokens[i]) - 1]);
                }
                polygons.push(new Polygon(polygonPoints));
            }
        }
    });

    return polygons;
}

function drawPolygon(polygon, color){
    let vertices = polygon.nodes
    for(let i=0;i<vertices.length-1;i++){
        let point1 = vertices[i].point;
        let point2 = vertices[i+1].point;
        drawLine(point1.x,point1.y,point2.x,point2.y,color);

        textSize(8);
        text(`${point1.x} / ${point1.y}`, point1.x,-point1.y+500);
    }
    let lastVertex  = vertices[vertices.length - 1].point;
    
    drawLine(lastVertex.x,lastVertex.y,vertices[0].point.x,vertices[0].point.y,color);
    textSize(8);
    text(`${lastVertex.x} / ${lastVertex.y}`, lastVertex.x,-lastVertex.y+500);
}

function drawLine(xStart,yStart,xEnd,yEnd,color="green"){
    stroke(color);
    strokeWeight(1);
    line(xStart,-yStart+500,xEnd,-yEnd+500)
}

function drawAllPoints (polygons, intersections) {
    stroke("black");
    strokeWeight(5);
    // Vertices
    for(let polygon of polygons){
        for(let entry of polygon.nodes){
            point(entry.point.x, -entry.point.y+500)
        }
    }
    
    stroke("purple");
    // Intersections
    for(let entry of intersections){
        strokeWeight(5)
        point(entry.x, -entry.y+500)
        strokeWeight(1)
        textSize(8);
        text(`${entry.x} / ${entry.y}`, entry.x,-entry.y+500);
    }
}

function getPolygonEvents(polygon){
    const startVertex = findLeftMostVertex(polygon.nodes);
    const endVertex = findRightMostVertex(polygon.nodes);

    let left = startVertex.nextLeft;
    let right = startVertex.nextRight;
    const eventStructure =[];
    eventStructure.push(startVertex);
    while(left.point.x < endVertex.point.x || right.point.x < endVertex.point.x){

    if(left.point.x === startVertex.point.x){
        left = left.nextLeft;
        continue;
    }

    if(left.point.x > right.point.x){
        eventStructure.push(right);
        right = right.nextRight;
    }
    else{
        eventStructure.push(left);
        left = left.nextLeft;
    }
}
    eventStructure.push(endVertex);


    return eventStructure;
}

function findLeftMostVertex(vertices){
    let leftVertex=null;
    for(const entry of vertices){
        if(leftVertex ===null){
            leftVertex = entry;
            continue;
        }
        if(entry.point.x < leftVertex.point.x){
            leftVertex = entry;
            continue;
        }

        if(entry.point.x === leftVertex.point.x){
            if(entry.point.y < leftVertex.point.y){
                leftVertex = entry;
                continue;
            }
        }

    }

    return leftVertex;
}
function findRightMostVertex(vertices){
    let rightVertex=null;
    for(const entry of vertices){
        if(rightVertex ===null){
            rightVertex = entry;
            continue;
        }
        if(entry.point.x > rightVertex.point.x){
            rightVertex = entry;
            continue;
        }

        if(entry.point.x === rightVertex.point.x){
            if(entry.point.y < rightVertex.point.y){
                rightVertex = entry;
                continue;
            }
        }

    }

    return rightVertex;
}

function mergeEvents(events1, events2){
    const e1 = [...events1];
    const e2 = [...events2];

    const mergedEvents = [];

    while (e1.length > 0 || e2.length > 0) {
        if (e2.length === 0) {
            mergedEvents.push(e1.shift());
        } else if (e1.length === 0) {
            mergedEvents.push(e2.shift());
        } else {
            if (e1[0].point.x < e2[0].point.x) {
                mergedEvents.push(e1.shift());
            } else if (e1[0].point.x > e2[0].point.x) {
                mergedEvents.push(e2.shift());
            } else {
                mergedEvents.push(e1.shift());
                e2.shift();
            }
        }
    }

    return mergedEvents;
}

function getIntersections ( polygon1, polygon2, mergedEvents){
const events = [...mergedEvents];

const scanLine = {
    p1_u:null,
    p1_l:null,
    p2_u:null,
    p2_l:null
}
    const intersections = [];
    while (events.length>0){
        const currentEvent = events.shift();
        startVertexPolygon1 = findLeftMostVertex(polygon1.nodes);
        startVertexPolygon2 = findLeftMostVertex(polygon2.nodes);

        endVertexPolygon1 = findRightMostVertex(polygon1.nodes);
        endVertexPolygon2 = findRightMostVertex(polygon2.nodes);

        if(currentEvent.point.x === startVertexPolygon1.point.x){
            handleLeftEdgeFirstPolygon(scanLine, startVertexPolygon1,intersections);
        }
    
        if(currentEvent.point.x === startVertexPolygon2.point.x){
            handleLeftEdgeSecondPolygon(scanLine, startVertexPolygon2,intersections);
        }
        if (currentEvent.point.x === endVertexPolygon1.point.x){
            updateScanLinePolygon1(scanLine, intersections);
        }
        else{
            handleGeneralCasePolygon1(scanLine,currentEvent, intersections);
        }

        if (currentEvent.point.x === endVertexPolygon2.point.x){
            updateScanLinePolygon2(scanLine, intersections);
        }
        else{
            handleGeneralCasePolygon2(scanLine,currentEvent, intersections);
        }
    }
    return intersections;
}
function handleGeneralCasePolygon2(scanline,currentEvent, intersections){

    //CW edge
    if(scanline.p2_u != null && currentEvent.point.x == scanline.p2_u.end.point.x){
        scanline.p2_u.start = scanline.p2_u.end;
        scanline.p2_u.end = scanline.p2_u.end.nextLeft;

        let i1 = checkForIntersection(scanline.p2_u, scanline.p1_u);
        let i2 = checkForIntersection(scanline.p2_u, scanline.p1_l);

        if (i1 != null) {
            intersections.push(i1);
        }
        if (i2 != null) {
            intersections.push(i2);
        }
    }

    //CCW edge
    if(scanline.p2_l != null && currentEvent.point.x == scanline.p2_l.start.point.x){
        scanline.p2_l.start = scanline.p2_l.start.nextRight;
        scanline.p2_l.end = scanline.p2_l.end.nextRight;

        let i1 = checkForIntersection(scanline.p2_l, scanline.p1_u);
        let i2 = checkForIntersection(scanline.p2_l, scanline.p1_l);

        if (i1 != null) {
            intersections.push(i1);
        }
        if (i2 != null) {
            intersections.push(i2);
        }
    }



}

function updateScanLinePolygon2(scanline, intersections){
    while(scanline.p2_u.end.point.y !== scanline.p2_l.start.point.y){
        scanline.p2_u.start = scanline.p2_u.end;
        scanline.p2_u.end = scanline.p2_u.end.nextLeft;

        const i1 = checkForIntersection(scanline.p1_u, scanline.p2_u);
        const i2 = checkForIntersection(scanline.p1_l, scanline.p2_u);

        if(i1 != null){
            intersections.push(i1);   
        }
         if(i2 != null){
            intersections.push(i2);   
        }
    }

    scanline.p2_u = null;
    scanline.p2_l = null;
}

function handleGeneralCasePolygon1(scanline,currentEvent, intersections){

    //CW edge
    if(scanline.p1_u != null && currentEvent.point.x == scanline.p1_u.end.point.x){
        scanline.p1_u.start = scanline.p1_u.end;
        scanline.p1_u.end = scanline.p1_u.end.nextLeft;

        let i1 = checkForIntersection(scanline.p1_u, scanline.p2_u);
        let i2 = checkForIntersection(scanline.p1_u, scanline.p2_l);

        if (i1 != null) {
            intersections.push(i1);
        }
        if (i2 != null) {
            intersections.push(i2);
        }
    }

    //CCW edge
    if(scanline.p1_l != null && currentEvent.point.x == scanline.p1_l.start.point.x){
        scanline.p1_l.start = scanline.p1_l.start.nextRight;
        scanline.p1_l.end = scanline.p1_l.end.nextRight;

        let i1 = checkForIntersection(scanline.p1_l, scanline.p2_u);
        let i2 = checkForIntersection(scanline.p1_l, scanline.p2_l);

        if (i1 != null) {
            intersections.push(i1);
        }
        if (i2 != null) {
            intersections.push(i2);
        }
    }



}

function updateScanLinePolygon1(scanline, intersections){
    while(scanline.p1_u.end.point.y !== scanline.p1_l.start.point.y){
        scanline.p1_u.start = scanline.p1_u.end;
        scanline.p1_u.end = scanline.p1_u.end.nextLeft;

        const i1 = checkForIntersection(scanline.p1_u, scanline.p2_u);
        const i2 = checkForIntersection(scanline.p1_u, scanline.p2_l);

        if(i1 != null){
            intersections.push(i1);   
        }
         if(i2 != null){
            intersections.push(i2);   
        }
    }
    scanline.p1_u = null;
    scanline.p1_l = null;
    
}

function handleLeftEdgeFirstPolygon(scanline, startVertex,intersections){
    scanline.p1_u = {
        start:startVertex, 
        end:startVertex.nextLeft
    };

    scanline.p1_l = {
        start:startVertex.nextRight, 
        end:startVertex
    };

    let intersection = checkForIntersection(scanline.p1_u, scanline.p2_u);
    if(intersection != null){
        intersections.push(intersection);   
    }
    intersection = checkForIntersection(scanline.p1_l, scanline.p2_u);
    if(intersection != null){
        intersections.push(intersection);   
    }

    intersection = checkForIntersection(scanline.p1_u, scanline.p2_l);
    if(intersection != null){
        intersections.push(intersection);   
    }

    intersection = checkForIntersection(scanline.p1_l, scanline.p2_l);
    if(intersection != null){
        intersections.push(intersection);   
    }

    while (scanline.p1_u.start.point.x === scanline.p1_u.end.point.x){
        scanline.p1_u.start = scanline.p1_u.end;
        scanline.p1_u.end = scanline.p1_u.end.nextLeft;


        intersection = checkForIntersection(scanline.p1_u, scanline.p2_u);
        if(intersection != null){
            intersections.push(intersection);   
        }
    
        intersection = checkForIntersection(scanline.p1_u, scanline.p2_l);
        if(intersection != null){
            intersections.push(intersection);   
        }


    }
}

function handleLeftEdgeSecondPolygon (scanline, startVertex,intersections){
    scanline.p2_u = {
        start:startVertex, 
        end:startVertex.nextLeft
    };

    scanline.p2_l = {
        start:startVertex.nextRight, 
        end:startVertex
    };

    let intersection = checkForIntersection(scanline.p1_u, scanline.p2_u);
    if(intersection != null){
        intersections.push(intersection);   
    }
    intersection = checkForIntersection(scanline.p1_l, scanline.p2_u);
    if(intersection != null){
        intersections.push(intersection);   
    }

    intersection = checkForIntersection(scanline.p1_u, scanline.p2_l);
    if(intersection != null){
        intersections.push(intersection);   
    }

    intersection = checkForIntersection(scanline.p1_l, scanline.p2_l);
    if(intersection != null){
        intersections.push(intersection);   
    }

    while (scanline.p2_u.start.point.x === scanline.p2_u.end.point.x){
        scanline.p2_u.start = scanline.p2_u.end;
        scanline.p2_u.end = scanline.p2_u.end.nextLeft;


        intersection = checkForIntersection(scanline.p2_u, scanline.p1_u);
        if(intersection != null){
            intersections.push(intersection);   
        }
    
        intersection = checkForIntersection(scanline.p2_u, scanline.p1_l);
        if(intersection != null){
            intersections.push(intersection);   
        }


    }
}
function checkForIntersection(line1, line2){

    if (line1 == null || line2 == null) {
        return null;
    }

    var p1 = {x: line1.start.point.x, y: line1.start.point.y};
    var p2 = {x: line1.end.point.x,   y: line1.end.point.y}
    var p3 = {x: line2.start.point.x, y: line2.start.point.y}
    var p4 = {x: line2.end.point.x,   y: line2.end.point.y}

    // down part of intersection point formula
    var d1 = (p1.x - p2.x) * (p3.y - p4.y); // (x1 - x2) * (y3 - y4)
    var d2 = (p1.y - p2.y) * (p3.x - p4.x); // (y1 - y2) * (x3 - x4)
    var d  = (d1) - (d2);

    if(d == 0) {
        return null;
    }

    // down part of intersection point formula
    var u1 = (p1.x * p2.y - p1.y * p2.x); // (x1 * y2 - y1 * x2)
    var u4 = (p3.x * p4.y - p3.y * p4.x); // (x3 * y4 - y3 * x4)

    var u2x = p3.x - p4.x; // (x3 - x4)
    var u3x = p1.x - p2.x; // (x1 - x2)
    var u2y = p3.y - p4.y; // (y3 - y4)
    var u3y = p1.y - p2.y; // (y1 - y2)

    // intersection point formula
    var px = (u1 * u2x - u3x * u4) / d;
    var py = (u1 * u2y - u3y * u4) / d;

    var p = { x: px, y: py };

    // check if intersection point lies on line segments
    var t = ((p1.x - p3.x) * (p3.y - p4.y) - (p1.y - p3.y)*(p3.x - p4.x)) / ((p1.x - p2.x) * (p3.y - p4.y) - (p1.y - p2.y)*(p3.x - p4.x));
    if (t <= 0 || t > 1) {
        return null;
    }

    var u = -((p1.x - p2.x) * (p1.y - p3.y) - (p1.y - p2.y)*(p1.x - p3.x)) / ((p1.x - p2.x) * (p3.y - p4.y) - (p1.y - p2.y)*(p3.x - p4.x));
    if (u <= 0 || u > 1) {
        return null;
    }

    return p;
}