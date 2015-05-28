/**
 * client socket.io controller
 */

// 모바일 브라우져 체크
var isMobile = function() {
  if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    return true;
  }
  return false;
};

// javascript 노드 가져오기
var getNode = function(s) {
  var returnVar = document.querySelector(s);
  return returnVar;
}



// 초기화 함수
var init = function() {


  // 브라우저 사이즈 계산
  var screenSize = $(window).height();  //current screen size
  var textareaNode = $("#chat-textarea-wrap").height(); // input text
  var _chat_messages_size = screenSize - textareaNode - 35; // chat messages size (40 is padding)

  $(".chat-wrap").css({"height": screenSize});
  $(".chat").css({"height": screenSize});
  $(".chat-messages").css({"height": _chat_messages_size});
  $(".chat-messages-wrap").css({"height": _chat_messages_size});



  // 모바일 브라우져일 경우 소프트웨어 키보드 움직임을 고려하여 딜레이를 줌
  // 안드로이드 겔럭시s4 에서 문제가 발생하여 추가
  if(isMobile()) {

    // textarea에 포커스가 가서 키보드가 켜질경우 키보드 로딩시간을 고려하여 딜레이를 줌
    $('#chat-textarea').focus(function() {

      // 스크롤을 아래로
      var chat_message = function() {
        $('.chat-messages').scrollTop($('.chat-messages')[0].scrollHeight)
      };

      setTimeout(chat_message, 500) // 0.5초 딜레이


    }).blur(function() {   // textarea에 포커스가 사라질 경우

    });
  }
};


/////////////////////////////////////////////////////////////////
///////////////// main 함수 시작
(function() {


  //초기화 실행
  $(function() {
    init();
  });


  //필요한 노드들
  var room = $("#room-name").val(); // params로 넘겨 받은 room 이름
  var sender = $("#sender-name").val(); // query로 넘겨 받은 sender 이름
  var textarea = getNode('.chat-textarea'); // 입력 텍스트 박스
  var statusNode = getNode('.chat-status span'); // 체팅 상태 노드
  var statusDefault = statusNode.innerHTML;     // 현제 체팅 상태 노드
  var messagesVar = getNode('.chat-messages'); //체팅이 보이는 노드
  console.log("room : "+ room);
  console.log("sender : "+ sender);

  /////////////////////////////////////////////////////////////////
  ////////////////////// socket.io 연결 시작

  try {
    var socket = io.connect('http://52.68.38.24');
  } catch(err) {
    // 경고창띄우기
    alert("서버와 연결이 되지 않습니다. 잠시후에 실행해 주세요.");
  }


  if(socket !== undefined) {
    //소캣 연결 됨


    // room에 입장
    socket.emit('join room', {
      room: room,
      sender: sender
    });


    //채팅을 읽었음을 readme으로 알림
    socket.emit('readme',
      {
        room: room,
        sender: sender
      });


    // 지난 채팅 내용을 읽어옴
    socket.emit('get',
      {
        room: room,
        sender: sender
      });


    // 서버로부터 채팅내용을 받았을때 동작
    socket.on('output', function(data) {

      //채팅내용을 읽었음을 알림
      socket.emit('readme',
        {
          room: room,
          sender: sender
        });


      if(data.length) {

        for(var x = 0; x < data.length; x++) {


          //추가할 말풍선 div들을 만듬
          var message = document.createElement('div');
          var messageName = document.createElement('div');
          var messageContent = document.createElement('div');
          var messageText = document.createElement('div');
          var messageState = document.createElement('div');
          var messageRead = document.createElement('div');
          var messageDate = document.createElement('div');
          var newDay = document.createElement('div');
          var newDayText = document.createElement('div');
          newDay.setAttribute('class', 'chat-day');
          newDayText.setAttribute('class', 'chat-day-text');

          messageText.innerText = data[x].message;
          messageName.innerText = data[x].sender;

          if(data[x].read === 1){
            console.log('안읽음');
            messageRead.innerText = '안읽음';
          } else{
            console.log('읽음');
            messageRead.innerText = '';
          }

          // 12시간 단위로 표시
          var myGetHour = (new Date(data[x].date).getHours() );
          if(myGetHour > 12) {
            myGetHour = myGetHour - 12;
          }


          messageDate.innerText = myGetHour + "시 " + new Date(data[x].date).getMinutes() + "분";


          console.log('data[x].read : '+ data[x].read);
          var chatDate = new Date(data[x].date);
          var currentDate = (new Date());
          var weekday = ["월요일","화요일","수요일","목요일","금요일","토요일","일요일"];

          //// 채팅 날짜가 변경될경우 날짜 변경 줄을 추가
          // 마지막 데이터가 아닌경우
          if(data[x + 1] !== undefined) {
            // 오늘날짜가 아닌경우 && 이전채팅날짜와 다음채팅날짜가 다른경우
            if((chatDate.getDate() !== currentDate.getDate()) &&
              (new Date(data[x + 1].date).getDate() !== chatDate.getDate())
            ) {
              var nextChatDate = new Date(data[x + 1].date);

              newDayText.innerText = (nextChatDate.getFullYear()) + "." + (nextChatDate.getUTCMonth() + 1) + "." + (nextChatDate.getDate()) + "." + weekday[(nextChatDate.getDay() - 1)];
              newDay.appendChild(newDayText);
              messagesVar.appendChild(newDay);
            } else {

            }
          }

          //내가쓴 메시지인 경우 오른쪽 편에 보이도록
          if(data[x].sender === sender) {
            if(data[x].read === 0) {
              messageRead.innerText = "";
            }

            message.setAttribute('class', 'chat-message-sender');
            messageText.setAttribute('class', 'sender-text');
            messageState.setAttribute('class', 'sender-state');
            messageDate.setAttribute('class', 'sender-date');
            messageRead.setAttribute('class', 'sender-read');



            messageState.appendChild(messageRead);
            messageState.appendChild(messageDate);
            message.appendChild(messageState);
            message.appendChild(messageText);
            messagesVar.appendChild(message);
            messagesVar.appendChild(message, messagesVar.firstChild);



          } else { //다른사람이 쓴 메시지인 경우 왼쪽 편에 보이도록

            if(data[x].read === 0) {
              messageRead.innerText = "";
            }

            messageRead.innerText = "";
            message.setAttribute('class', 'chat-message-receiver');
            messageName.setAttribute('class', 'receiver-name');
            messageContent.setAttribute('class', 'receiver-content');
            messageText.setAttribute('class', 'receiver-text');
            messageState.setAttribute('class', 'receiver-state');
            messageDate.setAttribute('class', 'receiver-date');

            messageContent.appendChild(messageText);
            messageContent.appendChild(messageState);
            messageState.appendChild(messageDate);
            message.appendChild(messageName);
            message.appendChild(messageContent);
            messagesVar.appendChild(message);
            messagesVar.appendChild(message, messagesVar.firstChild);

            console.log('data[x]._id : '+ data[x]._id);
            //해당 메시지가 안읽음일 경우 서버에 알림
            if(data[x].read === 1) {
              console.log('emit read');

              socket.emit('read',
                {
                  room: room,
                  _id: data[x]._id
                });

            }
          }

          // 채팅창에 메시지 노드들을 연결
          messagesVar.appendChild(message);
          messagesVar.appendChild(message, messagesVar.firstChild);

          //메시지창 스크롤 아래로
          messagesVar.scrollTop = messagesVar.scrollHeight;
        }

      }
    });


    //상대가 모든 체팅을 읽은경우 안읽음을 ''로 벼경
    socket.on('readall', function(data) {
      if(sender !== data.sender) {
        $(".sender-read").text('');
      }
    });


    // socket.io 통신 유지를 위해 esc키 디폴트 동작을 없앰
    $(document).on('keydown', function(event) {
      if(event.keyCode == 27) {
        event.preventDefault();
      }
    });


    var is_keyboard = false;
    var is_landscape = false;
    var initial_screen_size = window.innerHeight; // 현제 화면 내부 사이즈

    /* Android */
    //안드로일 경우 리사이즈 동작
    window.addEventListener("resize", function() {
      is_keyboard = (window.innerHeight < initial_screen_size);
      is_landscape = (screen.height < screen.width);

      var screenSize = $(window).height();
      var _textareaHeight = $(".chat-textarea").height();
      var _statusText = $(".chat-status").height();
      var _chat_messages_size = screenSize - _textareaHeight - _statusText - 40;


      $(".chat-warp").css({"height": screenSize});
      $(".chat").css({"height": screenSize});
      $(".chat-messages").css({"height": _chat_messages_size});
      $(".chat-messages-warp").css({"height": _chat_messages_size});


    }, false);

    /* iOS */
    //ios일 경우 리사이즈 동작
    $("input").bind("focus blur", function() {
      $(window).scrollTop(10);
      is_keyboard = $(window).scrollTop() > 0;
      $(window).scrollTop(0);


      // browser size calculate
      var screenSize = $(window).height();  //current screen size
      var textareaNode = $("#chat-textarea-wrap").height(); // input text
      var _chat_messages_size = screenSize - textareaNode - 35; // chat messages size (40 is padding)

      $(".chat").css({"height": screenSize});
      $(".chat-messages").css({"height": _chat_messages_size});
      $(".chat-messages-wrap").css({"height": _chat_messages_size});


    });


    // 체팅내용을 입력한경우 input 이벤트 발생
    textarea.addEventListener('keydown', function(event) {
      var self = this;

      //shiftKey키를 안누른 상태에서 엔터를 누를경우
      if((event.which === 13 && event.shiftKey === false)) {

        // 서버에 메시지를 입력요청함
        socket.emit('input',
          {
            room: room,
            sender: sender,
            message: self.value,
            read: 1,
            date: new Date()
          });
        event.preventDefault();

        //채팅입력창을 지움
        $("#chat-textarea").val('');
      }
    });
  }
})();