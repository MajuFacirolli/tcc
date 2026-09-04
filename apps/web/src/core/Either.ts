export type TEither<L, R> = Left<L, R> | Right<L, R>

export class Left<L, R> {
	readonly value: L

	constructor(value: L) {
		this.value = value
	}

	isLeft(): this is Left<L, R> {
		return true
	}

	isRight(): this is Right<L, R> {
		return false
	}
}

export class Right<L, R> {
	readonly value: R

	constructor(value: R) {
		this.value = value
	}

	isLeft(): this is Left<L, R> {
		return false
	}

	isRight(): this is Right<L, R> {
		return true
	}
}

export const left = <L, R>(l: L): TEither<L, R> => {
	return new Left<L, R>(l)
}

export const right = <L, R>(r: R): TEither<L, R> => {
	return new Right<L, R>(r)
}
