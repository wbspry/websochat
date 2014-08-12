package models;

import play.*;
import play.mvc.*;
import play.libs.*;

import scala.concurrent.duration.*;
import akka.actor.*;

import com.fasterxml.jackson.databind.JsonNode;

import static java.util.concurrent.TimeUnit.*;

public class Robot {
    
    public Robot(ActorRef chatRoom) {
        
        // Create a Fake socket out for the robot that log events to the console.
        WebSocket.Out<JsonNode> robotChannel = new WebSocket.Out<JsonNode>() {
            
            public void write(JsonNode frame) {
                Logger.of("robot").info(Json.stringify(frame));
            }
            
            public void close() {}
            
        };
        
        // Join the room
//        chatRoom.tell(new ChatRoom.Join("Robot", robotChannel), null);
        
        // Make the robot talk every 30 seconds
        Akka.system().scheduler().schedule(
            Duration.create(50, SECONDS),
            Duration.create(50, SECONDS),
            chatRoom,
            new ChatRoom.Talk("Robot", "まだだ、まだおわらんよ"),
            Akka.system().dispatcher(),
            /** sender **/ null
        );
        
    }
    
}
