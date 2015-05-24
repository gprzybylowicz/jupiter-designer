function BehaviourModel() {
	this.lifeBehaviour = new jupiter.LifeBehaviour();
	this.positionBehaviour = new jupiter.PositionBehaviour();
	this.colorBehaviour = new jupiter.ColorBehaviour();
}

module.exports = BehaviourModel;