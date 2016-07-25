import { Const } from '../const';

export class CircleMesh {
    constructor(circle) {
        this._points = [];
        this.circleCenter = circle.center;
        this._steps = Const.CIRCLE_BY_STEPS;
        this._pi2 = Math.PI * 2;
        this._vertices = [];
        this._radius = Const.EARTH_RADIUS + 100;
        this._circleRadius = (180 / this._radius) * circle.radius;
        this._createMesh();
    }

    _createMesh() {
        for (let i = 0; i <= this._steps; i++) {
            const lng = this.circleCenter[0] +
                this._circleRadius * Math.cos(i / this._steps * this._pi2);
            const lat = this.circleCenter[1] +
                this._circleRadius * Math.sin(i / this._steps * this._pi2);
            this._points.push([lng, lat]);
        }
        this._points.forEach(point => {
            const latLng = {
                lng: point[0],
                lat: point[1]
            };
            const pointX = this._radius * Math.sin(latLng.lng * Math.PI / 180) *
                            Math.cos(latLng.lat * Math.PI / 180);
            const pointY = this._radius * Math.sin(latLng.lat * Math.PI / 180);
            const pointZ = this._radius * Math.cos(latLng.lng * Math.PI / 180) *
                            Math.cos(latLng.lat * Math.PI / 180);
            this._vertices.push(pointX, pointY, pointZ);
        });
    }

    setup(gl) {
        if (this.vertexPosBuffer) {
            return;
        }

        this.vertexPosBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPosBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._vertices),
            gl.STATIC_DRAW);
        this.VERTEX_POS_BUF_ITEM_SIZE = 3;
    }

    bindPoint(gl, loc) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPosBuffer);
        gl.vertexAttribPointer(loc,
            this.VERTEX_POS_BUF_ITEM_SIZE,
            gl.FLOAT, false, 0, 0);
    }

    get count() {
        return this._vertices.length / 3;
    }
}