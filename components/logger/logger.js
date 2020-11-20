/* global DD_LOGS */
export default class Logger {
    static log(message, messageContext, status = 'error') {
        window.DD_LOGS &&
            DD_LOGS.logger.log(
                message,
                {
                    context: {
                        stack_trace: new Error().stack,
                        ...messageContext,
                    },
                },
                status
            );
    }
}
