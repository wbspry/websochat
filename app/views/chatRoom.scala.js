@(username: String)

$(function() {
    var WS = window['MozWebSocket'] ? MozWebSocket : WebSocket
    var chatSocket = new WS("@routes.Application.chat(username).webSocketURL(request)")

    var sendMessage = function() {
        chatSocket.send(JSON.stringify(
            {type:"talk", text: $("#talk").val()}
        ))
        $("#talk").val('')
    }

    var receiveEvent = function(event) {
    	
        var data = JSON.parse(event.data)
        
        // Handle errors
        if(data.error) {
            chatSocket.close()
            $("#onError span").text(data.error)
            $("#onError").show()
            return
        } else {
            $("#onChat").show()
        }

        if(data.user == 'Robot') return false;

        // Create the message element
        var el = $('<div class="message"><span class="name"></span><p></p><span class="time"></span></div>')
        $("span.name", el).text(data.user)
        $("span.time", el).text(data.time)
        $("p", el).text(data.message)
        $(el).addClass(data.kind)
        if(data.user == '@username') $(el).addClass('me')
        $('#messages').append(el)

        try{
			if (active_flag) {
				// アクティブのときの処理
				} else {
				// 非アクティブのときの処理
			        notify(data.user,data.message);
				}
        }catch(e){
        	alert(e);
        }

        
        
        
        // Update the members list
        $("#members").html('')
        $(data.members).each(function() {
            var li = document.createElement('li');
            li.textContent = this;
            $("#members").append(li);
        })
    }

    var handleReturnKey = function(e) {
        if(e.charCode == 13 || e.keyCode == 13) {
        	if($("#talk").val()==""){
        		return false;
        	}
            e.preventDefault()
            sendMessage()
        }
    }

    $("#talk").keypress(handleReturnKey)

    chatSocket.onmessage = receiveEvent

    var closeEvent = function(){
    	alert("WebSocketが閉じられました。");
    }
    
    chatSocket.onclose = closeEvent
    
	// イベントハンドラの設定
	chatSocket.onopen = function(event) {
	  /* セッション確立時の処理 */
    	try{
    		chatSocket.send(JSON.stringify({type:"join", text: "has entered the room"}))
    	}catch(e){
    		alert(e);
    	}
    };
    
    function notifyReq(){
    	  Notification.requestPermission(function(permission){
    	    console.debug("Notification permission: "+permission);
    	    if(Notification.permission == "granted"){
    	      notify();
    	    }
    	  });
    	};
    	function notify(user, message){
    	  switch(Notification.permission){
    	    case "granted":
    	      new Notification(user, {
    	        icon:"http://3.bp.blogspot.com/-Y042BzoevnM/UCkNli79vMI/AAAAAAAAYLs/VyStPcI4EIg/s220/logroid_150.png",
    	        body:message,
    	        tag:"notification-test",
    	      });
    	      break;
    	    case "default":
    	      notifyReq();
    	      break;
    	    case "denied":
    	      console.warn("デスクトップ通知が拒否されています");
    	      break;
    	  }
    	};

})

