
// package com.involveininnovation.chat.model;

// import lombok.*;

// import java.util.Date;

// @NoArgsConstructor
// @AllArgsConstructor
// @Getter
// @Setter
// @ToString
// public class Message {
//     private String senderName;
//     private String receiverName;
//     private String message;
//     private String date;
//     private Status status;
// }

package com.involveininnovation.chat.model;

public class Message {
    private String senderName;
    private String receiverName;
    private String message;
    private String status;
    private String video;  // Field to store video URL

    // Getters and Setters
    public String getSenderName() {
        return senderName;
    }

    public void setSenderName(String senderName) {
        this.senderName = senderName;
    }

    public String getReceiverName() {
        return receiverName;
    }

    public void setReceiverName(String receiverName) {
        this.receiverName = receiverName;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getVideo() {
        return video;
    }

    public void setVideo(String video) {
        this.video = video;
    }

    @Override
    public String toString() {
        return "Message{" +
                "senderName='" + senderName + '\'' +
                ", receiverName='" + receiverName + '\'' +
                ", message='" + message + '\'' +
                ", status='" + status + '\'' +
                ", video='" + video + '\'' +
                '}';
    }
}
