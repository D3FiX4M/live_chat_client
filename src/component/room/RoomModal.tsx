import React, {Dispatch, SetStateAction, useState} from 'react';
import {Button, Input, Modal} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import {ICreateRoomRequest, IRoomItem} from "../../interface/RoomInterface";
import {createRoom} from "../../api/RoomApi";

const createButtonStyle: React.CSSProperties = {
    width: "400px",
    height: "200px",
};

interface RoomModalProps {
    mode: "create" | "edit"
    params: IRoomItem | undefined
    modalIsOpen: boolean,
    setRooms: Dispatch<SetStateAction<IRoomItem[]>>
    setModalIsOpen: Dispatch<SetStateAction<boolean>>
}

const RoomModal: React.FC<RoomModalProps> = ({
                                                 mode,
                                                 params,
                                                 modalIsOpen,
                                                 setRooms,
                                                 setModalIsOpen
                                             }) => {

    const [roomParam, setRoomParam] = useState<ICreateRoomRequest>({name: params ? params.name ? params.name : '' : ''})
    const showModal = () => {
        setModalIsOpen(true);
    };

    const handleOk = () => {
        switch (mode) {
            case "create":
                createRoom(roomParam)
                    .then(value => {
                        if (value) {
                            setRooms(prevState => [...prevState, value])
                            setModalIsOpen(false);
                        }
                    })
        }
    };

    const handleCancel = () => {
        setRoomParam({name: ""})
        setModalIsOpen(false);
    };

    const handleChange = (value: React.ChangeEvent<HTMLInputElement>) => {
        setRoomParam({...roomParam, name: value.target.value})
    }

    return (
        <>
            <Button style={createButtonStyle} onClick={showModal}><PlusOutlined/></Button>
            <Modal title={mode === "create" ? "Создание" : "Редактирование"} open={modalIsOpen} onOk={handleOk}
                   onCancel={handleCancel}>
                <Input onChange={handleChange} placeholder={"Введите название"} value={roomParam?.name}
                       defaultValue={roomParam?.name}/>
            </Modal>
        </>

    );
};

export default RoomModal;