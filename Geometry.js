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

class Shape extends Entity {
	constructor(points = [], triangles = []) {
		super();
		this.localPoints = points;
		this.localTriangles = triangles;
		this.toWorldSpace();
		this.rasterPoints = [];
		this.rasterTriangles = [];
	}

	addTriangle(triangle) {
		this.localTriangles.push(triangle);
		this.toWorldSpace();
		return this;
	}

	setPosition(translationVec) {
		super.setPosition(translationVec);
		this.toWorldSpace();
		return this;
	}

	setRotation(rotX, rotY = 0, rotZ = 0) {
		super.setRotation(rotX, rotY, rotZ);
		this.toWorldSpace();
		return this;
	}

	changeOrigin(newOrigin) {
		for (let i = 0; i < this.localPoints.length; i++) {
			this.localPoints[i].x -= newOrigin[0];
			this.localPoints[i].y -= newOrigin[1];
			this.localPoints[i].z -= newOrigin[2];
		}
		this.toWorldSpace();
		return this;
	}

	toWorldSpace() {
		this.worldPoints = [];
		for (let i = 0; i < this.localPoints.length; i++) {
			let worldPoint =  Matrix.toArray(
				Matrix.multiply(
					this.localSpace, 
					Matrix.fromArray([this.localPoints[i].x, this.localPoints[i].y, this.localPoints[i].z, 1])
			));
			this.worldPoints.push(new Point(worldPoint[0], worldPoint[1], worldPoint[2]));
		}
		this.worldTriangles = [];
		for (let i = 0; i < this.localTriangles.length; i++) {
			let triangle = this.localTriangles[i];
			let p1Index = this.localPoints.indexOf(triangle.p1);
			let p2Index = this.localPoints.indexOf(triangle.p2);
			let p3Index = this.localPoints.indexOf(triangle.p3);
			this.worldTriangles.push(new Triangle(
				this.worldPoints[p1Index], 
				this.worldPoints[p2Index], 
				this.worldPoints[p3Index]
			));
		}
		return this;
	}
}

class Plane extends Shape {
	constructor(w, h) {
		super();
		this.w = w;
		this.h = h;
		this.init();
	}

	init() {
		let p1 = new Point(-this.w / 2, this.h / 2, 0);
		let p2 = new Point(this.w / 2, this.h / 2, 0);
		let p3 = new Point(this.w / 2, -this.h / 2, 0);
		let p4 = new Point(-this.w / 2, -this.h / 2, 0);
		this.localPoints = [p1, p2, p3, p4];
		let triangle1 = new Triangle(p4, p1, p2);
		let triangle2 = new Triangle(p4, p2, p3);
		this.localTriangles =  [triangle1, triangle2];
		return this;
	}
}

class Rectangle extends Shape {
	constructor(l, w, h) {
		super();
		this.l = l;
		this.w = w;
		this.h = h;
		this.init();
	}

	init() {
		let p1 = new Point(-this.w / 2, this.h / 2, this.l / 2);
		let p2 = new Point(this.w / 2, this.h / 2, this.l / 2);
		let p3 = new Point(this.w / 2, -this.h / 2, this.l / 2);
		let p4 = new Point(-this.w / 2, -this.h / 2, this.l / 2);
		let p5 = new Point(-this.w / 2, this.h / 2, -this.l / 2);
		let p6 = new Point(this.w / 2, this.h / 2, -this.l / 2);
		let p7 = new Point(this.w / 2, -this.h / 2, -this.l / 2);
		let p8 = new Point(-this.w / 2, -this.h / 2, -this.l / 2);
		this.localPoints = [p1, p2, p3, p4, p5, p6, p7, p8];
		// front face
		let triangle1 = new Triangle(p4, p1, p2);
		let triangle2 = new Triangle(p4, p2, p3);
		// right face
		let triangle3 = new Triangle(p3, p2, p6);
		let triangle4 = new Triangle(p3, p6, p7);
		// left face
		let triangle5 = new Triangle(p8, p5, p1);
		let triangle6 = new Triangle(p8, p1, p4);
		// back face
		let triangle7 = new Triangle(p7, p6, p5);
		let triangle8 = new Triangle(p7, p5, p8);
		// bottom face
		let triangle9 = new Triangle(p4, p8, p7);
		let triangle10 = new Triangle(p4, p7, p3);
		// top face
		let triangle11 = new Triangle(p1, p5, p6);
		let triangle12 = new Triangle(p1, p6, p2);
		this.localTriangles = [triangle1, triangle2, triangle3, triangle4, triangle5, triangle6, triangle7, triangle8, triangle9, triangle10, triangle11, triangle12];
		return this;
	}
}