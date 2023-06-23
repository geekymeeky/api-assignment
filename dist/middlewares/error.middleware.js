function errorMiddleware(error, request, response, next) {
    const status = error.status || 500;
    const message = error.message || 'Something went wrong';
    response.status(status).send({
        status,
        message,
    });
}
export default errorMiddleware;
//# sourceMappingURL=error.middleware.js.map