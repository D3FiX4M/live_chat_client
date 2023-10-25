import React from 'react';
import {IRoomItem} from "../../interface/RoomInterface";
import TranslationVideo from "./TranslationVideo";
import TranslationChat from "./TranslationChat";




const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: "row",
    height: '100%',
    width: "100%",
    gap: "10px"
};

const videoStyle: React.CSSProperties = {
    flex: 1.6,
    background: "#c8d4e1"
};

const chatStyle: React.CSSProperties = {
    flex: 0.4,
};

interface ChatProps {
    activeRoom: IRoomItem
}

const Translation: React.FC<ChatProps> = ({activeRoom}) => {

    return (
        <div style={containerStyle}>
            <div style={videoStyle}>
                <TranslationVideo/>
            </div>
            <div style={chatStyle}>
                <TranslationChat activeRoom={activeRoom}/>
            </div>
        </div>

    );
};

export default Translation;