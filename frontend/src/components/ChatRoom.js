import React, { useEffect, useState, useRef } from "react";
import { over } from "stompjs";
import SockJS from "sockjs-client";
import logo from "../logo/logo.jpg";

var stompClient = null;

const ChatRoom = () => {
  const [privateChats, setPrivateChats] = useState(new Map());
  const [publicChats, setPublicChats] = useState([]);
  const [tab, setTab] = useState("CHATROOM");
  const [userData, setUserData] = useState({
    username: "",
    receivername: "",
    connected: false,
    message: "",
    video: "",
  });
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [videoBlob, setVideoBlob] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    console.log(userData);
  }, [userData]);

  const connect = () => {
    let Sock = new SockJS("https://damaged-catriona-alkar-2d781158.koyeb.app/ws");
    stompClient = over(Sock);
    stompClient.connect({}, onConnected, onError);
  };

  const onConnected = () => {
    setUserData({ ...userData, connected: true });
    stompClient.subscribe("/chatroom/public", onMessageReceived);
    stompClient.subscribe(
      "/user/" + userData.username + "/private",
      onPrivateMessage
    );
    userJoin();
  };

  const userJoin = () => {
    var chatMessage = {
      senderName: userData.username,
      status: "JOIN",
    };
    stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
  };

  const onMessageReceived = (payload) => {
    var payloadData = JSON.parse(payload.body);
    switch (payloadData.status) {
      case "JOIN":
        if (!privateChats.get(payloadData.senderName)) {
          privateChats.set(payloadData.senderName, []);
          setPrivateChats(new Map(privateChats));
        }
        break;
      case "MESSAGE":
        publicChats.push(payloadData);
        setPublicChats([...publicChats]);
        break;
    }
  };

  const onPrivateMessage = (payload) => {
    var payloadData = JSON.parse(payload.body);
    if (privateChats.get(payloadData.senderName)) {
      privateChats.get(payloadData.senderName).push(payloadData);
      setPrivateChats(new Map(privateChats));
    } else {
      let list = [];
      list.push(payloadData);
      privateChats.set(payloadData.senderName, list);
      setPrivateChats(new Map(privateChats));
    }
  };

  const onError = (err) => {
    console.log(err);
  };

  const handleMessage = (event) => {
    const { value } = event.target;
    setUserData({ ...userData, message: value });
  };

  const sendValue = () => {
    if (stompClient) {
      var chatMessage = {
        senderName: userData.username,
        message: userData.message,
        video: videoBlob ? URL.createObjectURL(videoBlob) : "",
        status: "MESSAGE",
      };
      stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
      setUserData({ ...userData, message: "" });
      setVideoBlob(null);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      const mediaRecorder = new MediaRecorder(stream);
      setMediaRecorder(mediaRecorder);
      const chunks = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        setVideoBlob(blob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      videoRef.current.srcObject = stream;
    } catch (err) {
      console.error("Error starting recording:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
      setIsRecording(false);
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }
  };

  const handleUsername = (event) => {
    const { value } = event.target;
    setUserData({ ...userData, username: value });
  };

  const registerUser = () => {
    connect();
  };

  const openModal = (videoSrc) => {
    setSelectedVideo(videoSrc);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedVideo(null);
  };

  const handleVideoClick = (videoSrc) => {
    // Open the video in full-screen mode
    const videoElement = document.createElement("video");
    videoElement.src = videoSrc;
    videoElement.controls = true;
    videoElement.muted = true;
    document.body.appendChild(videoElement);
    videoElement.play();
    videoElement.requestFullscreen();
  };

  return (
    <div className="container">
      {userData.connected ? (
        <div className="chat-box">
          <div className="member-list">
            <div className="logo_container">
              <img src={logo} alt="POPCAM Logo" className="logo" />
              <p>POPCAM</p>
            </div>
            <ul>
              <li
                onClick={() => {
                  setTab("POPCAM");
                }}
                className={`member ${tab === "POPCAM" && "active"}`}
              >
                Chatroom
              </li>
              {[...privateChats.keys()].map((name, index) => (
                <li
                  onClick={() => {
                    setTab(name);
                  }}
                  className={`member ${tab === name && "active"}`}
                  key={index}
                >
                  {name}
                </li>
              ))}
            </ul>
          </div>
          <div className="chat-content">
            <ul className="chat-messages">
              {publicChats.map((chat, index) => (
                <li
                  className={`message ${
                    chat.senderName === userData.username && "self"
                  }`}
                  key={index}
                >
                  {chat.senderName !== userData.username && (
                    <div className="avatar">
                      {chat.senderName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="message-data">
                    <p>{chat.message}</p>
                    {chat.video && (
                      <video
                        width="50"
                        height="50"
                        src={chat.video}
                        autoPlay
                        loop
                        muted
                        onClick={() => handleVideoClick(chat.video)}
                        className="circular-video"
                        style={{ cursor: "pointer" }}
                      />
                    )}
                  </div>

                  {chat.senderName === userData.username && (
                    <div className="avatar self">
                      {chat.senderName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </li>
              ))}
            </ul>
            <div className="send-message">
              <input
                type="text"
                className="input-message"
                placeholder="Enter the message"
                value={userData.message}
                onChange={handleMessage}
              />
              <button type="button" className="send-button" onClick={sendValue}>
                Send
              </button>
              <button
                type="button"
                className="send-button"
                onClick={startRecording}
                disabled={isRecording}
              >
                Start Recording
              </button>
              <button
                type="button"
                className="send-button"
                onClick={stopRecording}
                disabled={!isRecording}
              >
                Stop Recording
              </button>
              <div className="video-circle" onClick={openModal}>
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  controls
                  className="video-preview"
                ></video>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="register">
          <img src={logo} alt="POPCAM Logo" className="logo" />
          <input
            id="user-name"
            placeholder="Enter your name"
            name="userName"
            value={userData.username}
            onChange={handleUsername}
          />
          <button type="button" onClick={registerUser}>
            Connect
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatRoom;
