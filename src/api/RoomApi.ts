import axios from "axios";
import {ICreateRoomRequest, IRoomItem} from "../interface/RoomInterface";
import {SERVER_URL} from "./CommonApi";

const ROOM_URL = `${SERVER_URL}/room`

export const getAllRooms = async (): Promise<IRoomItem[] | undefined> => {
    try {
        return await axios
            .get<IRoomItem[]>(ROOM_URL)
            .then(
                value => {
                    return value.data
                }
            )
    } catch (ex) {
        console.error(ex)
        return undefined
    }
}

export const createRoom = async (request: ICreateRoomRequest): Promise<IRoomItem | undefined> => {
    try {
        return await axios
            .post<IRoomItem>(ROOM_URL, request)
            .then(
                value => {
                    return value.data
                }
            )
    } catch (ex) {
        console.error(ex)
        return undefined
    }
}

export const deleteRoom = async (id: string): Promise<void> => {
    try {
        return await axios
            .delete<void>(`${ROOM_URL}/${id}`)
            .then(value => {
                return
            })
    } catch (ex) {
        console.error(ex)
        return
    }
}



