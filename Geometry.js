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
		this.triangles = triangles;
		this.toWorldSpace();
	}

	addTriangle(triangle) {
		this.toLocalSpace();
		this.tiangles.push(triangle);
		this.toWorldSpace();
		return this;
	}

	move(moveVec) {
		this.toLocalSpace();
		super.move(moveVec);
		this.toWorldSpace();
		return this;
	}

	moveTo(translationVec) {
		this.toLocalSpace();
		super.moveTo(translationVec);
		this.toWorldSpace();
		return this;
	}

	rotate(rotX, rotY, rotZ) {
		this.toLocalSpace();
		super.rotate(rotX, rotY, rotZ);
		this.toWorldSpace();
		return this;
	}

	setRotation(rotX, rotY, rotZ) {
		this.toLocalSpace();
		super.setRotation(rotX, rotY, rotZ);
		this.toWorldSpace();
		return this;
	}

	toWorldSpace() {
		for (let i = 0; i < this.triangles.length; i++) {
			let triangle = this.triangles[i];
			let world1 = Matrix.toArray(Matrix.multiply(this.localSpace, Matrix.fromArray([triangle.p1.x, triangle.p1.y, triangle.p1.z, 1])));
			let world2 = Matrix.toArray(Matrix.multiply(this.localSpace, Matrix.fromArray([triangle.p2.x, triangle.p2.y, triangle.p2.z, 1])));
			let world3 = Matrix.toArray(Matrix.multiply(this.localSpace, Matrix.fromArray([triangle.p3.x, triangle.p3.y, triangle.p3.z, 1])));
			triangle.p1 = new Point(world1[0], world1[1], world1[2]);
			triangle.p2 = new Point(world2[0], world2[1], world2[2]);
			triangle.p3 = new Point(world3[0], world3[1], world3[2]);
		}
		return this;
	}

	toLocalSpace() {
		for (let i = 0; i < this.triangles.length; i++) {
			let triangle = this.triangles[i];
			let world1 = Matrix.toArray(Matrix.multiply(Matrix.getInverseOf(this.localSpace), Matrix.fromArray([triangle.p1.x, triangle.p1.y, triangle.p1.z, 1])));
			let world2 = Matrix.toArray(Matrix.multiply(Matrix.getInverseOf(this.localSpace), Matrix.fromArray([triangle.p2.x, triangle.p2.y, triangle.p2.z, 1])));
			let world3 = Matrix.toArray(Matrix.multiply(Matrix.getInverseOf(this.localSpace), Matrix.fromArray([triangle.p3.x, triangle.p3.y, triangle.p3.z, 1])));
			triangle.p1 = new Point(world1[0], world1[1], world1[2]);
			triangle.p2 = new Point(world2[0], world2[1], world2[2]);
			triangle.p3 = new Point(world3[0], world3[1], world3[2]);
		}
		return this;
	}
}