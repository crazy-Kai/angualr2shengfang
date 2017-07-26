"use strict";
var ServerInterceptor = (function () {
    function ServerInterceptor() {
    }
    ServerInterceptor.prototype.interceptBefore = function (request) {
        return request;
    };
    ServerInterceptor.prototype.interceptAfter = function (response) {
        var body = response.response.json();
        if (body.code == 402)
            location.reload();
        return response;
    };
    return ServerInterceptor;
}());
exports.ServerInterceptor = ServerInterceptor;
//# sourceMappingURL=server.interceptor.js.map