package com.example.messagingprojectwebsocket.Controllers;

import com.example.messagingprojectwebsocket.DTO.ChatMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class ChatMessaging {

    @MessageMapping("/send/{roomID}")
    @SendTo("/room/{roomID}") // il va envoyer le message to any user suscribed to /room/{roomID}
    public ChatMessage send(@Payload ChatMessage message, @DestinationVariable String roomID) {

        System.out.println("message was received= "+ message.toString());
        return message;

    }

    @MessageMapping("/addUser")
    public void addUser(@Payload ChatMessage message, SimpMessageHeaderAccessor headerAccessor) {

        System.out.println("header= "+ headerAccessor.getSessionAttributes().toString());

        headerAccessor.getSessionAttributes().put("username", message.getSender());
        System.out.println("session is added");

        System.out.println("user is added successfuly");
    }


}
