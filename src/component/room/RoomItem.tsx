import React, {Dispatch, SetStateAction} from 'react';
import {IRoomItem} from "../../interface/RoomInterface";
import {Button, Card} from "antd";

const cardStyle: React.CSSProperties = {
    width: "400px",
    height: "200px",
}

interface RoomItemProps{
    room: IRoomItem
    setActiveRoom: Dispatch<SetStateAction<IRoomItem | undefined>>
}

const RoomItem: React.FC<RoomItemProps> = ({room, setActiveRoom}) => {
    return (
        <Card
            style={cardStyle}
            key={room.id}
            title={room.name}
            actions={[
                <Button
                    type={"primary"}
                    onClick={() => setActiveRoom(room)}
                >
                    Войти</Button>
            ]}
        >
            test
        </Card>
    );
};

export default RoomItem;