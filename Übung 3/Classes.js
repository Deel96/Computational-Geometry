class Point {
    constructor(x, y){
        this.x = x
        this.y = y
    }
}

class Node {
    constructor(points, parentNode, x, y, width, height){
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.points = points
        this.parentNode = parentNode
        this.ne = null
        this.nw = null
        this.se = null
        this.sw = null

        this.drawPoints()
    }

    splitPointsinNode(){
        let nodeWidthMid = this.width / 2
        let nodeHeightMid = this.height / 2

        if(this.points.length > 1){
            for(let p of this.points){
                // Check if Point is in NorthEastern Node
                if(p.x > this.x + nodeWidthMid && p.y > this.y + nodeHeightMid){
                    if(this.ne === null){
                        this.ne = new Node([p], this, this.x + nodeWidthMid, this.y + nodeHeightMid, nodeWidthMid, nodeHeightMid)
                    }else{
                        this.ne.points.push(p)
                    }
                // Check if Point is in NorthWestern Node
                }else if(p.x <= this.x + nodeWidthMid && p.y > this.y + nodeHeightMid){
                    if(this.nw === null){
                        this.nw = new Node([p], this, this.x, nodeHeightMid, nodeWidthMid, nodeHeightMid)
                    }else{
                        this.nw.points.push(p)
                    }
                // Check if Point is in SouthWestern Node
                }else if(p.x <= this.x + nodeWidthMid && p.y <= this.y + nodeHeightMid){
                    if(this.sw === null){
                        this.sw = new Node([p], this, this.x, this.y, nodeWidthMid, nodeHeightMid)
                    }else{
                        this.sw.points.push(p)
                    }
                // Check if Point is in SouthEastern Node
                }else if(p.x > this.x + nodeWidthMid && p.y <= this.y + nodeHeightMid){
                    if(this.se === null){
                        this.se = new Node([p], this, nodeWidthMid, this.y, nodeWidthMid, nodeHeightMid)
                    }else{
                        this.se.points.push(p)
                    }
                }
            }
            this.drawSeperation(this)

            this.ne?.splitPointsinNode()
            this.nw?.splitPointsinNode()
            this.sw?.splitPointsinNode()
            this.se?.splitPointsinNode()
            this.points = null
        }
    }

    drawPoints(){
        stroke("black");
        strokeWeight(5);
        for(let p of this.points){
            point(p.x, -p.y+500)
        }
    }

    drawSeperation(node){
        this.drawLine(node.x, node.y + node.height/2, node.x + node.width, node.y + node.height/2,"black")
        this.drawLine(node.x + node.width/2, node.y, node.x + node.width/2, node.y + node.height,"black")
    }

    drawLine(xStart,yStart,xEnd,yEnd,color="green"){
        stroke(color);
        strokeWeight(1);
        line(xStart,-yStart+500,xEnd,-yEnd+500)
    }
}

class QuadTree {
    constructor(nodes){
        this.nodes = nodes
    }

    fillNodesAndEdges(){
        let nodes = new vis.DataSet();
        let edges = new vis.DataSet();

        // Rekursiv durch die Nodes iterieren und daten füllen
        
        
        return nodes, edges
    }

    draw(){
        // var nodes = new vis.DataSet([
        //     { id: 1, label: "Node 1" },
        //     { id: 2, label: "Node 2" },
        //     { id: 3, label: "Node 3" },
        //     { id: 4, label: "Node 4" },
        //     { id: 5, label: "Node 5" },
        //   ]);
    
        //   // create an array with edges
        //   var edges = new vis.DataSet([
        //     { from: 1, to: 3 },
        //     { from: 1, to: 2 },
        //     { from: 2, to: 4 },
        //     { from: 2, to: 5 },
        //     { from: 3, to: 3 },
        //   ]);

        let nodes, edges = this.fillNodesAndEdges()
    
        // create a network
        var container = document.getElementById("mynetwork");
        var data = {
            nodes: nodes,
            edges: edges,
        };
        var options = {
            layout: {
                hierarchical: {
                    direction: "UD",
                    enabled: true,
                    sortMethod: 'directed',
                    shakeTowards: 'roots',
                },
                
            },
            physics: false, 
        };
        var network = new vis.Network(container, data, options);
    }
}