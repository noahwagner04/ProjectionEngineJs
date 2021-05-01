class Entity {
	constructor() {
		this.localSpace = Matrix.identity(4);
		this.translation = [0, 0, 0];
		this.rotation = [0, 0, 0];
	}

	moveTo(translationVec) {
		this.translation[0] = translationVec[0];
		this.translation[1] = translationVec[1];
		this.translation[2] = translationVec[2];
		this.localSpace.setColumn(3, [this.translation[0], this.translation[1], this.translation[2], 1]);
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
		this.rotation[0] = rotX;
		this.rotation[1] = rotY;
		this.rotation[2] = rotZ;
		let rotationSpace = Matrix.identity(3).rotate(rotX, rotY, rotZ);
		this.localSpace.map((e, i, j) => {
			if (i === 3 || j === 3) return e;
			else {
				return rotationSpace.data[i][j];
			}
		});
	}

	rotate(rotX, rotY, rotZ) {
		this.rotation[0] += rotX;
		this.rotation[1] += rotY;
		this.rotation[2] += rotZ;
		this.setRotation(this.rotation[0], this.rotation[1], this.rotation[2]);
	}
}