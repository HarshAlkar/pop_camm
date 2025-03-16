// package com.involveininnovation.chat.controller;

// import com.involveininnovation.chat.model.Message;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.messaging.handler.annotation.MessageMapping;
// import org.springframework.messaging.handler.annotation.Payload;
// import org.springframework.messaging.handler.annotation.SendTo;
// import org.springframework.messaging.simp.SimpMessagingTemplate;
// import org.springframework.stereotype.Controller;

// @Controller
// public class ChatController {

//     @Autowired
//     private SimpMessagingTemplate simpMessagingTemplate;

//     @MessageMapping("/message")
//     @SendTo("/chatroom/public")
//     public Message receiveMessage(@Payload Message message){
//         return message;
//     }

//     @MessageMapping("/private-message")
//     public Message recMessage(@Payload Message message){
//         simpMessagingTemplate.convertAndSendToUser(message.getReceiverName(),"/private",message);
//         System.out.println(message.toString());
//         return message;
//     }
// }


package com.involveininnovation.chat.controller;

import com.involveininnovation.chat.model.Message;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {

    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    // Handle public chat messages
    @MessageMapping("/message")
    @SendTo("/chatroom/public")
    public Message receiveMessage(@Payload Message message) {
        return message; // Broadcast the message to all users in the public chatroom
    }

    // Handle private messages
    @MessageMapping("/private-message")
    public Message recMessage(@Payload Message message) {
        // Send message to a specific user
        simpMessagingTemplate.convertAndSendToUser(message.getReceiverName(), "/private", message);
        System.out.println(message.toString());
        return message;
    }
}
