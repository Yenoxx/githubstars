// message module.
// Contains Message classes to store serializable response data


class Message {

    constructor(type, data, status=200) {
        this.type = type; // Type of response
        this.status = status; // Status of response
        this.data = data; // Additional data
    }
}


class ErrorMessage extends Message {

    constructor(text, status=404) {
        super('error', {text: text}, status)
    }
}


export {
    Message, ErrorMessage
}