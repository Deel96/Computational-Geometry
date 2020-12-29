class Point {
    constructor(x, y){
        this.x = x
        this.y = y
    }
}

class Line {
    constructor(point1, point2){
        this.point1 = point1
        this.point2 = point2
    }
}

class Polygon {
    constructor(points){
        //this.points = [...points]
        this.nodes =[];

        for(const entry of points){
            this.nodes.push(new ListNode(entry))
        }

        for(let i=0;i<this.nodes.length;i++){
            const length = this.nodes.length;
            if( i===0){
                this.nodes[i].nextLeft = this.nodes[length-1];
                this.nodes[i].nextRight = this.nodes[i+1];
                continue;
            }
            if( i===length-1){
                this.nodes[i].nextLeft = this.nodes[i-1];
                this.nodes[i].nextRight = this.nodes[0];
                continue;
            }

            this.nodes[i].nextLeft = this.nodes[i-1];
            this.nodes[i].nextRight = this.nodes[i+1];
            continue;
        }
    }
}

class ListNode {
    constructor(point) {
        this.point = point;
        this.nextLeft = null;
        this.nextRight = null;
    }
}