let VertexType =  {
    START: 0,
    END: 1,
    SPLIT: 2,
    MERGE: 3,
    REGULAR: 4
}

class DualGraph {
    constructor(){
        this.vertices = []
        this.edges = []
    }

    drawGraph(){
        fill(color(0, 0, 0))
        stroke(color(0, 0, 0))
        strokeWeight(1)

        for(let e of edges){
            let start = this.vertices[e.start]
            let end = this.vertices[e.end]

            line(start.x, start.y, end.x, end.y)
        }

        for(let v of vertices){
            circle(v.x, v.y)
        }
    }
}

class Vertex {
    constructor(x, y, h){
        this.x = x
        this.y = y
        this.h = h
        this.type = null
        this.color = null
    }

    next(){
        return this.h.next.origin
    }

    previous(){
        return this.h.pair.next.next.origin;
    }

    draw(){
        let color = this.color === null ? color(0, 0, 0) : this.color
        stroke(color)
        
        let type = this.type === null ? determineVertexType(this) : this.type
        
        if(type === VertexType.START){
            fill(color(0, 255, 0))
            rect(this.x-5, this.y-5, 10, 10)
        } else if (type === VertexType.END) {
            fill(color(255, 0, 0))
            rect(this.x-5, this.y-5, 10, 10)
        } else if (type ===  VertexType.SPLIT){
            fill(color(255, 0, 255))
            angleMode(DEGREES)
            var ax = this.x + 5 * sin(240)
            var ay = this.y - 5 * cos(240)

            var bx = this.x + 5 * sin(120)
            var by = this.y - 5 * cos(120)

            var cx = this.x
            var cy = this.y - 5

            triangle(ax, ay, bx, by, cx, cy)
        } else if (type === VertexType.MERGE){
            fill(color(0, 0, 255))
            angleMode(DEGREES)
            var ax = this.x + 5 * sin(240)
            var ay = this.y + 5 * cos(240)

            var bx = this.x + 5 * sin(120)
            var by = this.y + 5 * cos(120)

            var cx = this.x
            var cy = this.y + 5

            triangle(ax, ay, bx, by, cx, cy)
        } else if (type == VertexType.REGULAR){
            fill(color(255, 255, 0))
            circle(this.x, this.y, 10)
        }
    }
}

class HalfEdge {
    constructor() {
        this.next = null
        this.previous = null
        this.pair = null

        this.origin = null
        this.left = null
        this.edge = null
    }
}

class Edge {
    constructor(halfedge) {
        this.halfedge = halfedge
        this.color = null
    }

    draw() {
        stroke(this.color === null ? color(0,0,0) : this.color)
        strokeWeight(2)

        line(p.x, p.y, q.x, q.y)
    }
}

class Polygon {
    constructor() {
        this.halfedge = null
        this.visited = false
    }
}

class Mesh {
    constructor () {
        this.edges = []
        this.vertices = []
        this.polygons = []
        this.dualgraph = null
    }

    initialize(points){
        let poly = new Polygon()
        this.polygons.push(poly)

        points.forEach(p => {
            let h = new HalfEdge()
            let hpair = new HalfEdge()
            h.pair = hpair
            hpair.pair = h

            let v = new Vertex(p.x, p.y, h)
            let e = new Edge(h)

            this.vertices.push(v)
            this.edges.push(e)  
        })

        for (let i=0; i < this.vertices.length; i++) {
            const v = this.vertices[i];
            const e = this.edges[i];
            let h = v.halfedge;

            if (i === 0)
                poly.halfedge = h
                
            h.origin = v
            h.left = poly
            h.edge = e

            let nextId = (i + 1) % this.vertices.length
            let prevId = (i - 1) < 0 ? this.vertices.length - 1 : i - 1
            h.next = this.vertices[nextId].h
            h.previous = this.vertices[previous].h

            let pair = h.pair
            pair.origin = this.vertices[nextId]
            pair.left = null
            pair.edge = 
            pair.next = h.previous.pair
            pair.previous = h.next.pair
        }
    }

    addDiagonal(start, end) {
        
    }
}

function isBelow(v1, v2) {
    if (v1.y < v2.y) {
        return true;
    } else if (v1.y == v2.y) {
        if (v1.x < v2.x) {
            return true;
        }
    }

    return false;
}

function isConvex(v1, v2, v3) {
    var tmp = (v3.y - v1.y) * (v2.x - v1.x) - (v3.x - v1.x) * (v2.y - v1.y);

    if (tmp > 0) {
        return true;
    } else {
        return false;
    }
}

function determineVertexType(vertex) {
    let vprev = vertex.previous();
    let vnext = vertex.next();

    if (isBelow(vprev, vertex) && isBelow(vnext, vertex)) {
        if (isConvex(vnext, vprev, vertex)) {
            return VertexType.START;
        } else {
            return VertexType.SPLIT;
        }
    } else if (isBelow(vertex, vprev) && isBelow(vertex, vnext)) {
        if (isConvex(vnext, vprev, vertex)) {
            return VertexType.END;
        } else {
            return VertexType.MERGE;
        }
    } else {
        return VertexType.REGULAR;
    }
}

function sortVertex(v1, v2) {
    if (v1.y > v2.y) {
        return 1
    } else if (v1.y < v2.y) {
        return -1
    } else {
        if (v1.x > v2.x) {
            return 1
        } else if (v1.x < v2.x) {
            return -1
        }
    }
    return 0
}

function compareEdges(e1, e2) {
    let p1 = e1.origin
    let p2 = e1.pair.origin
    let p3 = e2.origin
    let p4 = e2.pair.origin

    if (p3.y === p4.y) {
        if (p1.y === p2.y) {
            return (p1.y < p3.y)
        }
        return isConvex(p1, p2, p3)
    } else if (p1.y === p2.y) {
        return !isConvex(p3, p4, p1)
    } else if (p1.y < p3.y) {
        return !isConvex(p3, p4, p1)
    } else {
        return isConvex(p1, p2, p3)
    }
}