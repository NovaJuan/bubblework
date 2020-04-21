class ErrorResponse extends Error {
	constructor(message, code) {
		super();
		this.message = message;
		this.statusCode = code;
	}
}

module.exports = ErrorResponse;
