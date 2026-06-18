import { Container, type Newable } from "inversify"

export class IoCContainer {
	private _container: Container

	constructor() {
		this._container = new Container()
	}

	bindRepository<T>(signature: symbol, repository: Newable<T>) {
		this._container.bind<T>(signature).to(repository)
	}

	bindUseCase<T>(signature: symbol, useCase: Newable<T>) {
		this._container.bind<T>(signature).to(useCase)
	}

	bindController<T>(signature: symbol, controller: Newable<T>) {
		this._container.bind<T>(signature).to(controller)
	}

	get<T>(signature: symbol): T {
		return this._container.get<T>(signature)
	}
}
