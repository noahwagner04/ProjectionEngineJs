class Triangle {
	constructor(p1, p2, p3) {
		this.p1 = p1;
		this.p2 = p2;
		this.p3 = p3;
	}
}

class Point {
	constructor(x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
	}
}

class Shape {
	constructor(triangles = []) {
		this.triangles = triangles;
		this.local = Matrix.identity(4);
	}

	addTriangle(triangle) {

	}

	move(x, y = 0, z = 0) {
		
	}

	rotate(x, y = 0, z = 0) {

	}
}