import React, {useEffect, useState} from 'react';
import {IMessageItem} from "../../interface/MessageIntefrace";
import {IRoomItem} from "../../interface/RoomInterface";
import {Button, Input} from "antd";
import {ReactiveSocket} from "rsocket-types";
import {Encodable, IdentitySerializer, JsonSerializer, RSocketClient} from "rsocket-core";
import * as property from "../../util/property";
import {RSOCKET_MAX_REQUEST_COUNT} from "../../util/property";
import RSocketWebSocketClient from "rsocket-websocket-client";


const containerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    height: "100%",
    width: "100%",
    padding: "10px",
    gap: "15px",
}

const chatContainerStyle: React.CSSProperties = {
    height: "100%",
    width: "100%",
    padding: "10px",
    overflow: 'auto',
    background: "#fff",
};

const messageContainerStyle: React.CSSProperties = {
    display: "flex",
    width: "100%",
    padding: "3px",
};

const senderNameStyle: React.CSSProperties = {
    fontWeight: "bold",
};

const messageStyle: React.CSSProperties = {
    marginLeft: "5px"
};

const inputContainerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    width: "100%",
    gap: "5px",
}


interface TranslationChatProps {
    activeRoom: IRoomItem
}

const TranslationChat: React.FC<TranslationChatProps> = ({activeRoom}) => {

    const [socket, setSocket] = useState<ReactiveSocket<any, Encodable>>();
    const [message, setMessage] = useState<string>('');
    const [chatMessages, setChatMessages] = useState<IMessageItem[]>([])

    useEffect(() => {

        const client = new RSocketClient({
            serializers: {
                data: JsonSerializer,
                metadata: IdentitySerializer,
            },
            setup: {
                dataMimeType: property.DATA_MIME_TYPE,
                metadataMimeType: property.META_DATA_MIME_TYPE,
                keepAlive: 60000,
                lifetime: 180000,
            },
            transport: new RSocketWebSocketClient({
                debug: true,
                url: property.RSOCKET_URL,
            }),
        });

        client
            .connect()
            .then(
                socket => {

                    setSocket(socket)

                    socket.connectionStatus().subscribe(event => console.log("status: ", event.kind))

                    socket.requestStream({
                        data: activeRoom.id,
                        metadata: String.fromCharCode(property.RSOCKET_CHAT_MAPPING_RECEIVE.length) + property.RSOCKET_CHAT_MAPPING_RECEIVE,
                    }).subscribe({
                        onSubscribe: subscription => subscription.request(RSOCKET_MAX_REQUEST_COUNT),
                        onComplete: () => console.log("Complete stream"),
                        onNext: value => {console.log(value.data); setChatMessages(prevState => [...prevState, value.data])},
                        onError: error => console.error("internal error: ", error.message)
                    });
                },
                error => console.error("external error: ", error.message)
            )
    }, []);


    const handleSend = () => {
        if (!socket) {
            return
        }

        const newMessage = {
            roomId: activeRoom.id,
            senderName: 'User_' + Math.floor(Math.random() * (1000 - 1 + 1) + 1),
            message: message
        };

        setMessage('');

        socket.fireAndForget({
            data: newMessage,
            metadata: String.fromCharCode(property.RSOCKET_CHAT_MAPPING_SEND.length) + property.RSOCKET_CHAT_MAPPING_SEND
        })

    };

    const inputHandle = (value: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(value.target.value)
    }

    return (
        <div style={containerStyle}>
            <div>
                {activeRoom.name}
            </div>
            <div style={chatContainerStyle}>
                {chatMessages.map(value =>
                    <div key={value.id} style={messageContainerStyle}>
                        <span style={senderNameStyle}>{value.senderName}:</span>
                        <span style={messageStyle}>{value.message}</span>
                    </div>
                )}
            </div>
            <div style={inputContainerStyle}>
                <Input
                    size={"large"}
                    defaultValue={message}
                    value={message}
                    placeholder={"Начните вводить текст"}
                    onChange={inputHandle}
                />
                <Button size={"large"} onClick={handleSend}>Отправить</Button>
            </div>
        </div>
    );
};

export default TranslationChat;