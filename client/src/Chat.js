import React, { useEffect, useState } from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';

function Chat({ socket, username, room }) {
    const [currMsg, setCurrMsg] = useState("");
    const [msgList, setmsgList] = useState([]);

    const sendMessage = async () => {
        if(currMsg !== ""){
            const messageData = {
                room : room,
                author : username,
                message : currMsg,
                time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
            };

            await socket.emit("send_msg", messageData);
            setmsgList((list) => [...list, messageData]);
            setCurrMsg("");
        }
    };

    useEffect(() => {
        socket.on("recieved_msg", (data) => {
            console.log(data);
            setmsgList((list) => [...list, data]);
        })
        // return () => socket.removeListener('received_msg');

    }, [socket]);

    return (
        <div className='chat-window'>
            <div className='chat-header'>
                <p>Live Chat: Room - {room}</p>
            </div>

            <div className='chat-body'>
                <ScrollToBottom className='message-container'>
                {msgList.map((msgContent, i) => {
                    return <div className='message' id={username === msgContent.author ? "other" : "you"} key={msgContent.message + msgContent.time + i}>
                        <div>
                            <div className='message-content'>
                                <p>{msgContent.message}</p>
                            </div>
                            <div className='message-meta'>
                                <p id='time' >{msgContent.time}</p>
                                <p id='author'>{msgContent.author}</p>
                            </div>
                        </div>
                    </div>
                })}
                </ScrollToBottom>
            </div>
                
            <div className='chat-footer'>
                <input type="text" placeholder="type msg..." value={currMsg} onChange={(event) => {setCurrMsg(event.target.value)}} onKeyDown={(event) => event.target.key ==="Enter"?sendMessage() : null} />
                <button onClick={sendMessage}>&#9658;</button>
            </div>
        </div>
    )
}

export default Chat
