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
	constructor(triangles = []) {
		super();
		this.localTriangles = triangles;
		this.toWorldSpace();
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
		for (let i = 0; i < this.localTriangles.length; i++) {
			let triangle = this.localTriangles[i];
			triangle.p1 = new Point(triangle.p1.x - newOrigin[0], triangle.p1.y - newOrigin[1], triangle.p1.z - newOrigin[2]);
			triangle.p2 = new Point(triangle.p2.x - newOrigin[0], triangle.p2.y - newOrigin[1], triangle.p2.z - newOrigin[2]);
			triangle.p3 = new Point(triangle.p3.x - newOrigin[0], triangle.p3.y - newOrigin[1], triangle.p3.z - newOrigin[2]);
		}
		this.toWorldSpace();
		return this;
	}

	toWorldSpace() {
		this.worldTriangles = [];
		for (let i = 0; i < this.localTriangles.length; i++) {
			let triangle = this.localTriangles[i];
			let world1 = Matrix.toArray(Matrix.multiply(this.localSpace, Matrix.fromArray([triangle.p1.x, triangle.p1.y, triangle.p1.z, 1])));
			let world2 = Matrix.toArray(Matrix.multiply(this.localSpace, Matrix.fromArray([triangle.p2.x, triangle.p2.y, triangle.p2.z, 1])));
			let world3 = Matrix.toArray(Matrix.multiply(this.localSpace, Matrix.fromArray([triangle.p3.x, triangle.p3.y, triangle.p3.z, 1])));
			this.worldTriangles.push(new Triangle(
				new Point(world1[0], world1[1], world1[2]),
				new Point(world2[0], world2[1], world2[2]),
				new Point(world3[0], world3[1], world3[2])
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
		this.localTriangles = this.init();
	}

	init() {
		let p1 = new Point(-this.w / 2, this.h / 2, 0);
		let p2 = new Point(this.w / 2, this.h / 2, 0);
		let p3 = new Point(this.w / 2, -this.h / 2, 0);
		let p4 = new Point(-this.w / 2, -this.h / 2, 0);
		let triangle1 = new Triangle(p4, p1, p2);
		let triangle2 = new Triangle(p4, p2, p3);
		return [triangle1, triangle2];
	}
}

class Rectangle extends Shape {
	constructor(l, w, h) {
		super();
		this.l = l;
		this.w = w;
		this.h = h;
		this.localTriangles = this.init();
	}

	init() {
		let p1 = new Point(-this.w / 2, this.h / 2, -this.l / 2);
		let p2 = new Point(this.w / 2, this.h / 2, -this.l / 2);
		let p3 = new Point(this.w / 2, -this.h / 2, -this.l / 2);
		let p4 = new Point(-this.w / 2, -this.h / 2, -this.l / 2);
		let p5 = new Point(-this.w / 2, this.h / 2, this.l / 2);
		let p6 = new Point(this.w / 2, this.h / 2, this.l / 2);
		let p7 = new Point(this.w / 2, -this.h / 2, this.l / 2);
		let p8 = new Point(-this.w / 2, -this.h / 2, this.l / 2);
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
		return [triangle1, triangle2, triangle3, triangle4, triangle5, triangle6, triangle7, triangle8, triangle9, triangle10, triangle11, triangle12];
	}
}