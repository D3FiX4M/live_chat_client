import React, {useState} from 'react';
import {IRoomItem} from "../../interface/RoomInterface";
import Translation from "../chat/Translation";
import RoomTable from "./RoomTable";


const containerStyle: React.CSSProperties = {
    padding: "10px",
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
};

const RoomPage = () => {

    const [activeRoom, setActiveRoom] = useState<IRoomItem>()

    return (
        <div style={containerStyle}>
            {
                activeRoom
                    ? <Translation activeRoom={activeRoom}/>
                    : <RoomTable setActiveRoom={setActiveRoom}/>
            }
        </div>

    )
};

export default RoomPage;