import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {IRoomItem} from "../../interface/RoomInterface";
import {getAllRooms} from "../../api/RoomApi";
import RoomModal from "./RoomModal";
import RoomItem from "./RoomItem";

const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    height: "fit-content",
    padding: "50px",
    gap: "50px"
};

interface RoomTableProps {
    setActiveRoom: Dispatch<SetStateAction<IRoomItem | undefined>>
}

const RoomTable: React.FC<RoomTableProps> = ({setActiveRoom}) => {
    const [rooms, setRooms] = useState<IRoomItem[]>([])
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false)
    useEffect(() => {
        getAllRooms()
            .then(value => value ? setRooms(value) : null)
    }, [])

    return (
        <div style={containerStyle}>
            {rooms.map(value =>
                <RoomItem key={value.id} room={value} setActiveRoom={setActiveRoom}/>
            )}
            <RoomModal
                modalIsOpen={modalIsOpen}
                setModalIsOpen={setModalIsOpen}
                setRooms={setRooms}
                mode={"create"}
                params={undefined}
            />
        </div>
    );
};

export default RoomTable;