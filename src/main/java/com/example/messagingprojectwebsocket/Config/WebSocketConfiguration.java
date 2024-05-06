package com.example.messagingprojectwebsocket.Config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfiguration implements WebSocketMessageBrokerConfigurer {
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {

        registry.addEndpoint("/ws").setAllowedOriginPatterns("*").withSockJS();
        // setAllowedOriginPatterns("*") : mean that all origins of connection requests are allowed
        // "/ws"  : pathe to use to connect to the server
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {

        registry.setApplicationDestinationPrefixes("/app");  // any request to websocket server will be sent through a path start by " /app/..."
        registry.enableSimpleBroker("/room");  //we have 2 rooms : chatroom and user
        /* ****
          ===  *registry.setUserDestinationPrefix("/user");  // if path= "/user/userID' , message will be sent to the user that have this username (private message)
        ******   */

    }
}
