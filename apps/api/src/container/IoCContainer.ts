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

	bindService<T>(signature: symbol, service: Newable<T>) {
		this._container.bind<T>(signature).to(service).inSingletonScope()
	}

	get<T>(signature: symbol): T {
		return this._container.get<T>(signature)
	}

	/**
	 * Test seam: swap a binding for a stub. Rebinding a repository leaves the real
	 * controller and use case in place, so a route test still exercises the whole
	 * chain down to the port boundary.
	 */
	rebindToValue<T>(signature: symbol, value: T) {
		this._container.rebind<T>(signature).toConstantValue(value)
	}
}
