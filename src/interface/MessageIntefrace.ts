export interface IMessageItem {
    id: string,
    roomId: string
    message: string,
    senderName: string,
    sendedAt: string
}

export interface CreateMessageRequest{
    roomId: string,
    message: string,
    senderName: string
}