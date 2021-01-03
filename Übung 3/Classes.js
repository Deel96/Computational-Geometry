class Point {
    constructor(x, y){
        this.x = x
        this.y = y
    }
}

class VisNode{
constructor(id,label){
    this.id=id;
    this.label=label;
}
}

class VisEdge{
    constructor(id,to,from){
      //  this.id=id;
        this.from=from;
        this.to=to;
    }
}

class Node {
    constructor(points, parentNode, x, y, width, height){
        this.id=null;
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

        this.ne = new Node([], this, this.x + nodeWidthMid, this.y + nodeHeightMid, nodeWidthMid, nodeHeightMid)
        this.nw = new Node([], this, this.x, this.y +nodeHeightMid, nodeWidthMid, nodeHeightMid)
        this.sw = new Node([], this, this.x, this.y, nodeWidthMid, nodeHeightMid)
        this.se = new Node([], this, this.x + nodeWidthMid, this.y, nodeWidthMid, nodeHeightMid)

        if(this.points.length > 1){
            for(let p of this.points){
                // Check if Point is in NorthEastern Node
                if(p.x > this.x + nodeWidthMid && p.y > this.y + nodeHeightMid){
                    this.ne.points.push(p)
                // Check if Point is in NorthWestern Node
                }else if(p.x <= this.x + nodeWidthMid && p.y > this.y + nodeHeightMid){
                    this.nw.points.push(p)
                // Check if Point is in SouthWestern Node
                }else if(p.x <= this.x + nodeWidthMid && p.y <= this.y + nodeHeightMid){
                    this.sw.points.push(p)
                // Check if Point is in SouthEastern Node
                }else if(p.x > this.x + nodeWidthMid && p.y <= this.y + nodeHeightMid){
                    this.se.points.push(p)
                }
            }
            this.drawSeperation(this)
            if(this.ne?.splitPointsinNode) this.ne?.splitPointsinNode()
            if(this.nw?.splitPointsinNode) this.nw?.splitPointsinNode()
            if(this.sw?.splitPointsinNode) this.sw?.splitPointsinNode()
            if(this.se?.splitPointsinNode) this.se?.splitPointsinNode()
            //this.points = null
        }
    }
    redrawSplit(node){  
        if(node.points.length > 1){
            this.drawLine(node.x, node.y + node.height/2, node.x + node.width, node.y + node.height/2,"black")
            this.drawLine(node.x + node.width/2, node.y, node.x + node.width/2, node.y + node.height,"black")

            if(node.ne?.redrawSplit) node.ne?.redrawSplit(node.ne);
            if(node.nw?.redrawSplit) node.nw?.redrawSplit(node.nw);
            if(node.sw?.redrawSplit) node.sw?.redrawSplit(node.sw);
            if(node.se?.redrawSplit) node.se?.redrawSplit(node.se);
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
        this.network=null;
        this.currentNode =null;
        this.currentNeighbour=null;
        this.treeNodes=null;
    }

    fillNodesAndEdges(rootNode){
      

        let id =0;
        const nodeData = [];
        const edgeData = [];

        let root = new VisNode(id.toString());

       nodeData.push(root);
        this.addChildren(rootNode,nodeData,id,edgeData);
      
        let treeNodes = new vis.DataSet({});
        treeNodes.add(nodeData);
        let treeEdges = new vis.DataSet(edgeData);
        
        return {treeNodes, treeEdges}
    }

    addChildren(quadNode,nodes,parentId,edges){
        let childId =1;

        let createChild= function(id){
            return new VisNode(id,"");
        }

        const childNE = createChild(parentId.toString()+(childId++).toString())
        const edgeNE = new VisEdge(parentId.toString()+(childId), childNE.id.toString(),parentId.toString())
        if(quadNode.ne != null ){  
            quadNode.ne.id = childNE.id;
            if(quadNode.ne.points?.length>1){      
            this.addChildren(quadNode.ne,nodes,childNE.id,edges);
            }
        }
        quadNode.id = parentId.toString();
        const childNW = createChild(parentId.toString()+(childId++).toString())
        const edgeNW = new VisEdge(parentId.toString()+(childId), childNW.id.toString(),parentId.toString())
        if(quadNode.nw != null ){  
            quadNode.nw.id = childNW.id;
            if(quadNode.nw.points?.length>1){      
            this.addChildren(quadNode.nw,nodes,childNW.id,edges);
            }
        }

        const childSW = createChild(parentId.toString()+(childId++).toString())
        const edgeSW = new VisEdge(parentId.toString()+(childId), childSW.id.toString(),parentId.toString())

        if(quadNode.sw != null ){  
            quadNode.sw.id = childSW.id;
            if(quadNode.sw.points?.length>1){      
            this.addChildren(quadNode.sw,nodes,childSW.id,edges);
            }
        }

        const childSE = createChild(parentId.toString()+(childId++).toString())
        const edgeSE = new VisEdge(parentId.toString()+(childId), childSE.id.toString(),parentId.toString())
        if(quadNode.se != null ){  
            quadNode.se.id = childSE.id;
            if(quadNode.se.points?.length>1){      
            this.addChildren(quadNode.se,nodes,childSE.id,edges);
            }
        }

        quadNode.id = parentId.toString();
        nodes.push(childNE,childNW,childSW,childSE);
        edges.push(edgeNE,edgeNW,edgeSW,edgeSE);
       
    }

    draw(quadNodes){
        var a =1;
        const {treeNodes, treeEdges} = this.fillNodesAndEdges(quadNodes);
        this.treeNodes = treeNodes;
        // create a network
        var container = document.getElementById("mynetwork");
        var data = {
            nodes: treeNodes,
            edges: treeEdges,
        };
        var options = {
            layout: {
                hierarchical: {
                    sortMethod: 'directed',  // hubsize, directed
                    shakeTowards: 'roots',  // roots, leaves
                    direction: 'UD'   // UD, DU, LR, RL
                    }
                
            },
            physics:false
        };
        let network = new vis.Network(container, data, options);
        
         network.on( 'click', (properties)=> {
            var id = properties.nodes[0];
            if(properties.nodes[0]){
            var clickedNodes = treeNodes.get(id);

            if(clickedNodes){
                console.log('clicked nodes:', clickedNodes[0]?.id);
                

                clickedNodes.color = {
                border: '#2B7CE9',
                background: '#D2E5FF',
                highlight: {
                    border: '#8a2be2',
                    background: '#8a2be2'
                }
                }
            treeNodes.update(clickedNodes);
            }



            //reset old neighbour
            if(this.currentNeighbour){
            var neighbourNode = treeNodes.get(this.currentNeighbour.id);

            neighbourNode.color = {
                border: '#2B7CE9',
                background: '#D2E5FF',
                highlight: {
                    border: '#8a2be2',
                    background: '#8a2be2'
                }
                }
                treeNodes.update(neighbourNode);
            }


            this.findNode(clickedNodes.id);

            
            if(this.currentNeighbour){
                var neighbourNode = treeNodes.get(this.currentNeighbour.id);
    
                neighbourNode.color = {
                    border: '#00ff00',
                    background: '#00ff00',
                    highlight: {
                        border: '#8a2be2',
                        background: '#8a2be2'
                    }
                    }
                    treeNodes.update(neighbourNode);
                }







            }
        });


        select.addEventListener("change",(event)=>{
            
            //reset old neighbour
            if(this.currentNeighbour){
                var neighbourNode = this.treeNodes.get(this.currentNeighbour.id);
    
                neighbourNode.color = {
                    border: '#2B7CE9',
                    background: '#D2E5FF',
                    highlight: {
                        border: '#8a2be2',
                        background: '#8a2be2'
                    }
                    }
                    this.treeNodes.update(neighbourNode);
                }
    
    
                // this.findNode(clickedNodes.id);
                this.currentNeighbour=getNeighbour(select.value,this);
                
                if(this.currentNeighbour){
                    var neighbourNode = this.treeNodes.get(this.currentNeighbour.id);
        
                    neighbourNode.color = {
                        border: '#00ff00',
                        background: '#00ff00',
                        highlight: {
                            border: '#8a2be2',
                            background: '#8a2be2'
                        }
                        }
                        treeNodes.update(neighbourNode);
                    }
    
            
            
            
            this.currentNeighbour=getNeighbour(select.value,this);
            this.drawSquare(this.currentNode);

            
        })
    
    }
    
         

    findNode(id){ //12
        let index =0;

        id.charAt(index); //1
        let foundNode = this.nodes;
        while(index < id.length){
            let currentId =id.charAt(index);
            

            if (currentId =="1"){ //NE
            foundNode = foundNode.ne;
            }
            
            else if (currentId =="2"){ //NW
                foundNode = foundNode.nw;
            }

            else if (currentId =="3"){ //SW
                foundNode = foundNode.sw;
            }

            else if (currentId =="4"){ //SE
                foundNode = foundNode.se;
            }
            index++;
        }
        console.log(foundNode);
        this.currentNode = foundNode;
        this.drawSquare(foundNode)
    }

    drawSquare(node){
        clear();
        let c = color(138,43,226);
        fill(c);
        noStroke();
        rect(node.x,-node.y+500,node.width,-node.height)
    
     
        this.currentNeighbour=getNeighbour(select.value,this);
    if(this.currentNeighbour){
        let c2 = color(0,255,0);
        fill(c2);
        noStroke();
        rect(this.currentNeighbour.x,-this.currentNeighbour.y+500,this.currentNeighbour.width,-this.currentNeighbour.height)
    }
    this.nodes.drawPoints();
    this.nodes.redrawSplit(this.nodes);
        
    }

    colorTreeNodes(nodes){
        var id = properties.nodes[0];
            if(properties.nodes[0]){
            var clickedNodes = treeNodes.get(id);

            if(clickedNodes){
                console.log('clicked nodes:', clickedNodes[0]?.id);
                

                clickedNodes.color = {
                border: '#2B7CE9',
                background: '#D2E5FF',
                highlight: {
                    border: '#8a2be2',
                    background: '#8a2be2'
                }
                }
            treeNodes.update(clickedNodes);
            }



            //reset old neighbour
            if(this.currentNeighbour){
            var neighbourNode = treeNodes.get(this.currentNeighbour.id);

            neighbourNode.color = {
                border: '#2B7CE9',
                background: '#D2E5FF',
                highlight: {
                    border: '#8a2be2',
                    background: '#8a2be2'
                }
                }
                treeNodes.update(neighbourNode);
            }


            this.findNode(clickedNodes.id);

            
            if(this.currentNeighbour){
                var neighbourNode = treeNodes.get(this.currentNeighbour.id);
    
                neighbourNode.color = {
                    border: '#00ff00',
                    background: '#00ff00',
                    highlight: {
                        border: '#8a2be2',
                        background: '#8a2be2'
                    }
                    }
                    treeNodes.update(neighbourNode);
                }







            }
        }
    
}