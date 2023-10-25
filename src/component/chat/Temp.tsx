import React, {useEffect, useState} from 'react';

import {Encodable, IdentitySerializer, JsonSerializer, RSocketClient} from 'rsocket-core';
import RSocketWebSocketClient from 'rsocket-websocket-client';
import {ReactiveSocket} from 'rsocket-types';
import * as property from "../../util/property"
import {RSOCKET_MAX_REQUEST_COUNT} from "../../util/property"
import {CreateMessageRequest, IMessageItem} from "../../interface/MessageIntefrace";
import {IRoomItem} from "../../interface/RoomInterface";

interface ChatProps {
    activeRoom: IRoomItem
}

const Temp: React.FC<ChatProps> = ({activeRoom}) => {

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
                        onNext: value => setChatMessages(prevState => [...prevState, value.data]),
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

        const newMessage: CreateMessageRequest = {
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

    return <div>
        {chatMessages.map((value, index) => (
                <div key={index}>
                    <strong>{value.senderName}: </strong>
                    <p>{value.message}</p>
                </div>
            )
        )}
        <input
            type={"text"}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={handleSend}>SEND</button>
    </div>
}


export default Temp;
