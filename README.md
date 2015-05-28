# chat_server


## 프로그램 설명
     node.js와 socket.io를 이용한 체팅 프로그램
     - 1:1, 1:N 채팅 가능
     - 읽음여부 확인 가능
     - socket.io room을 이용한 채팅방 기능 구현
     - 모바일 브라우져를 고려한 반응형 페이지로 개발

## 사용한 기술

    node.js + express.js + socket.io + jade + less + jquery + mongodb


## 사용법

#### 1. url파라미터로 방이름과 사용자명으로 접속 
http://52.68.38.24/room1?sender=판매자
#### 2. 함께 채팅을 하고 싶다면 같은 방으로 접속 
http://52.68.38.24/room1?sender=구매자
#### 3. 새로운 방을 만들고 싶다면 room이름을 변경하여 접속 
http://52.68.38.24/room2?sender=user3



## 개발기

네이버블로그(http://liange.blog.me/220370557524)
