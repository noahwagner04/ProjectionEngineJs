class Camera {
	constructor(config) {
		this.cameraSpace = Matrix.identity(4); // 4 x 4 matrix
		this.rotX = 0;
		this.rotY = 0;
		this.rotZ = 0;
		this.translation = [0, 0, 0];

		this.zNear = config.zNear;
		this.zFar = config.zFar;

		this.imageW = config.imageW;
		this.imageH = config.imageH;

		this.fitResolutionGate = config.fitResolutionGate;

		this.focalLength = config.focalLength;
		this.filmApertureW = config.filmApertureW;
		this.filmApertureH = config.filmApertureH;

		this.FOVHorizontal = 0;
		this.FOVVertical = 0;

		this.filmAspectRatio = this.filmApertureW / this.filmApertureH;
		this.imageAspectRatio = this.imageW / this.imageH;

		this.r = undefined;
		this.l = undefined;
		this.t = undefined;
		this.b = undefined;

		this.workingPoint = undefined;

		this.getCanvaseCoords().getFOVW().getFOVH();
	}

	getFOVW() {
		this.FOVHorizontal = Math.atan((this.filmApertureW * inchToMm / 2) / this.focalLength) * 57.2958 * 2;
		return this;
	}

	getFOVH() {
		this.FOVVertical = Math.atan((this.filmApertureH * inchToMm / 2) / this.focalLength) * 57.2958 * 2;
		return this;
	}

	moveTo(translationVec) {
		this.translation[0] = translationVec[0];
		this.translation[1] = translationVec[1];
		this.translation[2] = translationVec[2];
		this.cameraSpace.setColumn(3, [this.translation[0], this.translation[1], this.translation[2], 1]);
		return this;
	}

	move(moveVec) {
		this.translation[0] += moveVec[0];
		this.translation[1] += moveVec[1];
		this.translation[2] += moveVec[2];
		this.moveTo(this.translation);
		return this;
	}

	setRotation(rotX, rotY, rotZ) {
		this.rotX = rotX;
		this.rotY = rotY;
		this.rotZ = rotZ;
		let rotationSpace = Matrix.identity(3).rotate(rotX, rotY, rotZ);
		this.cameraSpace.map((e, i, j) => {
			if (i === 3 || j === 3) return e;
			else {
				return rotationSpace.data[i][j];
			}
		});
	}

	rotate(rotX, rotY, rotZ) {
		this.rotX += rotX;
		this.rotY += rotY;
		this.rotZ += rotZ;
		this.setRotation(this.rotX, this.rotY, this.rotZ);
	}

	getCanvaseCoords() {
		let xScale = 1;
		let yScale = 1;
		if (this.filmAspectRatio !== this.imageAspectRatio) {
			if (this.fitResolutionGate === fitMode.FILL) {
				if (this.filmAspectRatio > this.imageAspectRatio) {
					xScale = this.imageAspectRatio / this.filmAspectRatio;
				} else {
					yScale = this.filmAspectRatio / this.imageAspectRatio;
				}
			} else if (this.fitResolutionGate === fitMode.OVERSCAN) {
				if (this.filmAspectRatio > this.imageAspectRatio) {
					yScale = this.filmAspectRatio / this.imageAspectRatio;
				} else {
					xScale = this.imageAspectRatio / this.filmAspectRatio;
				}
			}
		}
		this.t = ((this.filmApertureH * inchToMm / 2) / this.focalLength) * this.zNear * yScale;
		this.r = ((this.filmApertureW * inchToMm / 2) / this.focalLength) * this.zNear * xScale;
		this.b = -this.t;
		this.l = -this.r;
		return this;
	}

	toCameraSpace(p) {
		let point = Matrix.toArray(Matrix.multiply(Matrix.getInverseOf(this.cameraSpace), Matrix.fromArray([p.x, p.y, p.z, 1])));
		this.workingPoint = new Point(point[0], point[1], point[2]);
		return this;
	}

	toScreenSpace() {
		this.workingPoint.x *= this.zNear / -this.workingPoint.z;
		this.workingPoint.y *= this.zNear / -this.workingPoint.z;
		return this;
	}

	toNDCSpace() {
		this.workingPoint.x = (this.workingPoint.x + this.r) / (this.r * 2);
		this.workingPoint.y = 1 - (this.workingPoint.y + this.t) / (this.t * 2);
		return this;
	}

	toRasterSpace() {
		this.workingPoint.x *= this.imageW;
		this.workingPoint.y *= this.imageH;
	}

	project(p) {
		this.toCameraSpace(p).toScreenSpace().toNDCSpace().toRasterSpace();
		return this.workingPoint;
	}
}