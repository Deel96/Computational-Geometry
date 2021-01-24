let VertexType =  {
    START: 0,
    END: 1,
    SPLIT: 2,
    MERGE: 3,
    REGULAR: 4
}

class Point {
    constructor (x, y){
        this.x = x
        this.y = y
    }
}

class Node {
    constructor (data) {
        this.data = data
        this.left = null
        this.right = null
    }
}

class BinarySearchTree {
    constructor () {
        this.root = null
    }

    comparatorLess(a, b){
        return compareEdges(a.edge, b.edge)
    }

    comparatorMore(a, b){
        return compareEdges(b.edge, a.edge)
    }

    insert(data) {
        let node = new Node(data)
        if(this.root === null){
            this.root = node
        } else {
            this.insertNode(this.root, node)
        }
    }

    insertNode(node, newNode){
        if (this.comparatorLess(newNode.data, node.data)) {
            if (node.left === null) {
                node.left = newNode
            } else {
                this.insertNode(node.left, newNode)
            }
        } else {
            if(node.right === null) {
                node.right = newNode
            } else {
                this.insertNode(node.right, newNode)
            }
        }
    }

    remove(data) {
        this.root = this.removeNode(this.root, data)
    }

    removeNode(node, key){
        if(node === null) {
            return null
        } else if (this.comparatorLess(key, node.data)) {
            node.left = this.removeNode(node.left, key)
            return node
        } else if (this.comparatorMore(key, node.data)) {
            node.right = this.removeNode(node.right, key)
            return node
        } else {
            if (node.left === null && node.right === null) {
                node = null
                return node
            }

            if (node.left === null) {
                node = node.right
                return node
            } else if (node.right === null) {
                node = node.left
                return node
            }

            let tmp = this.findMinNode(node.right)
            node.data = tmp.data
            node.right = this.removeNode(node.right, tmp.data)
            return node
        }
    }

    search(node, edge) {
        if (node === null) {
            return null
        }

        if (compareEdges(edge, node.data.edge)){
            return this.search(node.left, edge)
        } else if (compareEdges(node.data.edge, edge)) {
            return this.search(node.right, edge)
        } else {
            return node
        }
    }

    searchLower(node, edge) {
        if(node === null){
            return null
        }

        if(compareEdges(edge, node.data.edge)){
            return this.searchLower(node.left, edge)
        } else {
            let result = this.searchLower(node.right, edge)
            if (result === null) {
                return node
            } else {
                return result
            }
        }
    }

    findMinNode (node) {
        if (node.left === null) {
            return node
        } else {
            return this.findMinNode(node.left)
        }
    }
}

class DualGraph {
    constructor(){
        this.vertices = []
        this.edges = []
        this.colorA = color(255, 0, 0)
        this.colorB = color(0, 255, 0)
        this.colorC = color(0, 0, 255)
    }

    draw(){
        fill(color(0, 0, 0))
        stroke(color(0, 0, 0))
        strokeWeight(2)

        this.edges.forEach(e => {
            let start = this.vertices[e.a]
            let end = this.vertices[e.b]

            line(start.x, start.y, end.x, end.y)
        })

        this.vertices.forEach( v => {
            circle(v.x, v.y, 5)
        })
    }
}

class Vertex {
    constructor(x, y, h){
        this.x = x
        this.y = y
        this.halfedge = h
        this.type = null
        this.color = null
    }

    next(){
        return this.halfedge.next.origin
    }

    previous(){
        return this.halfedge.pair.next.next.origin;
    }

    draw(){
        let c = this.color === null ? color(0, 0, 0) : this.color
        stroke(c)
        
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

        line(this.halfedge.origin.x, this.halfedge.origin.y, this.halfedge.next.origin.x, this.halfedge.next.origin.y)
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
        this.dual = null
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
            const v = this.vertices[i]
            const e = this.edges[i]
            let h = v.halfedge

            if (i === 0)
                poly.halfedge = h
                
            h.origin = v
            h.left = poly
            h.edge = e

            let nextId = (i + 1) % this.vertices.length
            let prevId = (i - 1) < 0 ? this.vertices.length - 1 : i - 1
            h.next = this.vertices[nextId].halfedge
            h.previous = this.vertices[prevId].halfedge

            let pair = h.pair
            pair.origin = this.vertices[nextId]
            pair.left = null
            pair.edge = e
            pair.next = h.previous.pair
            pair.previous = h.next.pair
        }
    }

    addDiagonal(start, end) {
        let startEndHalfedge = new HalfEdge()
        let endStartHalfedge = new HalfEdge()
        let edge = new Edge(startEndHalfedge)
        edge.color = color(0, 255, 0)

        startEndHalfedge.edge = edge
        startEndHalfedge.origin = start
        startEndHalfedge.pair = endStartHalfedge
        startEndHalfedge.next = endStartHalfedge
        startEndHalfedge.previous = endStartHalfedge

        endStartHalfedge.edge = edge
        endStartHalfedge.origin = end
        endStartHalfedge.pair = startEndHalfedge
        endStartHalfedge.next = startEndHalfedge
        endStartHalfedge.previous = startEndHalfedge
        
        let startIn, startOut, endIn, endOut
        let success = false
        let h = start.halfedge
        const h_start = start.halfedge

        do {
            startOut = h
            startIn  = h.previous

            let he1 = end.halfedge
            const he1_start = end.halfedge
            do {
                endOut = he1
                endIn  = he1.previous

                if (startOut.left !== null && startOut.left === startIn.left && endOut.left === endIn.left && startOut.left === endOut.left) {
                    success = true
                    break
                }

                he1 = he1.pair.next
            } while (he1 !== he1_start)

            if (success) {
                break
            }

            h = h.pair.next
        } while (h !== h_start)

        startEndHalfedge.previous = startIn;
        startIn.next = startEndHalfedge;
        endStartHalfedge.next = startOut;
        startOut.previous = endStartHalfedge;

        startEndHalfedge.next = endOut;
        endOut.previous = startEndHalfedge;
        endStartHalfedge.previous = endIn;
        endIn.next =  endStartHalfedge;

        endStartHalfedge.left = startOut.left;
        startOut.left.halfedge = endStartHalfedge;

        let face = new Polygon()
        let halfedge = startEndHalfedge
        const beginning = startEndHalfedge
        do{
            halfedge.left = face
            halfedge = halfedge.next
        } while (halfedge !== beginning)
        
        face.halfedge = startEndHalfedge

        this.edges.push(edge)
        this.polygons.push(face)
    }

    triangulate() {
        let triangulationCandidates = []
        this.polygons.forEach(poly => {
            var points = []
            var numPoints = 0
            var top = null
            var bottom = null
            var topEdge = null
            var start = poly.halfedge
            var current = start

            do {
                points.push(current.origin)
                numPoints += 1

                if (top === null || isBelow(top, current.origin)) {
                    top = current.origin
                    topEdge = current
                }

                if (bottom === null || isBelow(current.origin, bottom)) {
                    bottom = current.origin
                }

                current = current.next
            } while (current !== start)

            if (numPoints === 3) {
                return
            }

            let priority = [{vertex: top, type: 0}];
            let cw = topEdge.previous
            let ccw = topEdge.next

            for (let index = 0; index < numPoints - 1; index++) {
                const left = ccw.origin
                const right = cw.origin

                if (left === bottom) {
                    priority.push({vertex: right, type: -1})
                    cw = cw.previous
                } else if (right === bottom) {
                    priority.push({vertex: left, type: 1})
                    ccw = ccw.next
                } else {
                    if (isBelow(left, right)) {
                        priority.push({vertex: right, type: -1})
                        cw = cw.previous
                    } else {
                        priority.push({vertex: left, type: 1})
                        ccw = ccw.next
                    }
                }
            }

            triangulationCandidates.push({points: points, priority: priority, numPoints: numPoints})
        })

        triangulationCandidates.forEach(poly => {
            var stack = []
            const prio = poly.priority
            const n = poly.numPoints

            stack.push(prio[0])
            stack.push(prio[1])

            for (let i = 2; i < n - 1; i++) {
                var next = prio[i]
                if (next.type !== stack[stack.length - 1].type) {
                    while (stack.length > 0) {
                        var elem = stack.pop()

                        if (stack.length > 0) {
                            this.addDiagonal(next.vertex, elem.vertex)
                        }
                    }
                    stack.push(prio[i - 1])
                    stack.push(prio[i])
                } else {
                    var lastPopped = stack.pop()

                    while (stack.length > 0) {
                        var elem = stack.pop()

                        var convex = (
                            next.type === 1 ? 
                            isConvex(elem.vertex, lastPopped.vertex, next.vertex) :
                            isConvex(lastPopped.vertex, elem.vertex, next.vertex)
                        )

                        if (convex) {
                            this.addDiagonal(next.vertex, elem.vertex)
                            lastPopped = elem
                        } else {
                            stack.push(elem)
                            break;
                        }

                    }
                    stack.push(lastPopped);
                    stack.push(next);
                }
            }

            var bottom = prio[n - 1]
            var stackLength = stack.length
            for (let i = 0; i < stackLength; i++) {
                var elem = stack.pop()
                if (i !== 0 && i !== stackLength - 1) {
                    this.addDiagonal(bottom.vertex, elem.vertex)
                }
            }
        })
    }

    serperateToMonotone() {
        let priority = [...this.vertices]
        priority.sort(sortVertex).reverse()

        this.vertices.forEach(v => {
            v.type = determineVertexType(v)
        })

        let tree = new BinarySearchTree()
        priority.forEach(event => {
            let v = event
            let e = event.halfedge

            if(v.type === VertexType.START) {
                tree.insert({edge:e, helper: v})

            } else if (v.type === VertexType.END) {
                let vHelper = tree.search(tree.root, e.previous).data.helper
                if(vHelper.type === VertexType.MERGE){
                    this.addDiagonal(v, vHelper)
                }
                tree.remove({edge: e.previous})

            } else if (v.type === VertexType.SPLIT) {
                let node = tree.searchLower(tree.root, e)
                this.addDiagonal(v, node.data.helper)
                node.data.helper = v
                tree.insert({edge: e, helper: v})

            } else if (v.type === VertexType.MERGE) {
                let vHelper = tree.search(tree.root, e.previous).data.helper
                if(vHelper.type == VertexType.MERGE){
                    this.addDiagonal(v, vHelper)
                }
                tree.remove({edge: e.previous})

                let node =  tree.searchLower(tree.root, e)
                vHelper = node.data.helper
                if(vHelper.type === VertexType.MERGE){
                    this.addDiagonal(v, vHelper)
                }
                node.data.helper = v

            } else if (v.type === VertexType.REGULAR){
                if(isBelow(v, v.previous())) {
                    let prev = e.previous
                    let vHelper = tree.search(tree.root, e.previous).data.helper
                    if(vHelper.type === VertexType.MERGE){
                        this.addDiagonal(v, vHelper)
                    }
                    tree.remove({edge: prev})
                    tree.insert({edge: e, helper: v})
                } else {
                    let node = tree.searchLower(tree.root, e)
                    let vHelper = node.data.helper
                    if(vHelper.type === VertexType.MERGE) {
                        this.addDiagonal(v, vHelper)
                    }
                    node.data.helper = v
                }
            }
        })
    }

    createDualGraph() {
        this.dual = new DualGraph()
        if (this.polygons.length > 0) {
            this.createDualGraphNode(this.polygons[0]);
        }
    }

    createDualGraphNode(face) {
        if(face === null || face.visited === true){
            return null
        }

        face.visited = true

        let points = []
        let neighbors = []
        let numPoints = 0
        let start = face.halfedge
        let current = start

        do {
            points.push(current.origin)
            numPoints += 1
            let neighbor = current.pair.left
            if(neighbor !== null){
                neighbors.push(neighbor)
            }

            current = current.next
        } while (current !== start)

        let centerx = 0, centery = 0
        points.forEach(p => {
            centerx += p.x
            centery += p.y
        })
        centerx /= numPoints
        centery /= numPoints

        this.colorVertices(points)

        let nodeId = this.dual.vertices.length
        this.dual.vertices.push({x: centerx, y: centery})

        neighbors.forEach(n => {
            let i = this.createDualGraphNode(n)
            if(i !== null){
                this.dual.edges.push({a: nodeId, b: i})
            }
        })
        
        return nodeId
    }

    colorVertices(vertices) {
        if (vertices[0].color === null && vertices[1].color === null && vertices[2].color === null) {
            vertices[0].color = this.dual.colorA;
            vertices[1].color = this.dual.colorB;
            vertices[2].color = this.dual.colorC;
        } else {
            let colorSet = new Set()
            let uncolored = null
            vertices.forEach(v => {
                if (v.color !== null){
                    colorSet.add(v.color)
                } else {
                    uncolored = v
                }
            })

            if (colorSet.has(this.dual.colorA) && colorSet.has(this.dual.colorB)) {
                uncolored.color = this.dual.colorC
            } else if (colorSet.has(this.dual.colorA) && colorSet.has(this.dual.colorC)) { 
                uncolored.color = this.dual.colorB
            } else {
                uncolored.color = this.dual.colorA
            }
        }
    }

    draw () {
        this.edges.forEach(e => {
            e.draw()
        })
        this.vertices.forEach(v => {
            v.draw()
        })
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
    var tmp = (v3.y - v1.y) * (v2.x - v1.x) - (v3.x - v1.x) * (v2.y - v1.y)

    if (tmp > 0) {
        return true
    } else {
        return false
    }
}

function determineVertexType(vertex) {
    let vprev = vertex.previous()
    let vnext = vertex.next()

    if (isBelow(vprev, vertex) && isBelow(vnext, vertex)) {
        if (isConvex(vnext, vprev, vertex)) {
            return VertexType.START
        } else {
            return VertexType.SPLIT
        }
    } else if (isBelow(vertex, vprev) && isBelow(vertex, vnext)) {
        if (isConvex(vnext, vprev, vertex)) {
            return VertexType.END
        } else {
            return VertexType.MERGE
        }
    } else {
        return VertexType.REGULAR
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
