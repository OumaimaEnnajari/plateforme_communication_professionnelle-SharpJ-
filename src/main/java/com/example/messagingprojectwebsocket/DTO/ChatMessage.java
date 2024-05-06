package com.example.messagingprojectwebsocket.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor

public class ChatMessage {

    private String sender;
    private String content;

    @Override
    public String toString() {
        return "ChatMessage{" +
                "Sender='" + sender + '\'' +
                ", Content='" + content + '\'' +
                '}';
    }

}
