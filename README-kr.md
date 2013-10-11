[English documentation! (영문 사용서)](https://github.com/Leftium/adhoc/blob/master/README.md)

# Adhoc: 개발자의 도움이

디렉토리안에서 간편하게 웹서버를 실행시킨다.<br />
(`python -m SimpleHTTPServer`와 유사.)

<hr />
**주요 장점**

- 하나의 명령어로 어디서나 실행가능한 경랑 웹서버
- 반복적으로 [F5]를 누를 필요가 없으며 심지어 웹브라우져도 자동으로 실행된다.
- 컨텐츠를 저장하면 웹페이지에 바로 반영되어 보여진다.(페이지 갱신없이 동시에 열려있는 모든 브라우져에 반영됨)
- 한눈에 대부분의 중요한 서버 로그 정보를 파악할 수 가 있다.
- 브라우져에서 로컬에 작업중인 웹사이트 디렉토리를 볼 수 있다.


## 간단 설치:

    npm -g install adhoc


## 사용법:

    $ ls
    index.html style.css script.js image.png

    $ adhoc
    The adhoc server is now hosting c:/wip-site/ at http://localhost:80/
    Started live reload server on port 35729
    Hit CTRL-C to stop the servers. Launching your default browser...
    GET 200  54ms - 11.16kb /
    GET 200   9ms -  5.20kb /style.css
    GET 200  45ms - 97.63kb /script.js
    ...
    ...

*index.html, script.js, style.css, image.png등의 파일을 수정하면 열려있는 모든 브라우져가 자동으로 갱신되어 보여진다!*


## 사용예:

    adhoc [options] [path]

      -n, --nobrowser       자동브라우져 시작 사용않함
      -v, --verbosity=NUM   0에서 4까지 서버로그 레벨 지정    [초기값: 3]
      -p, --port=NUM        사용포트 지정                     [초기값: 80]
      -r, --noreload        자동갱신 사용않함
      -c, --nocolors        디스플래이 화면 컬러링 사용않함
      -t, --ttl=SECONDS     브라우져 캐시시간 지정 (초단위)   [초기값: 0]
      -i, --index=FILENAME  디폴트 index 파일명               [초기값: index.html]
      -h, --help            도움말 보기

Copyright John-Kim Murphy

참조사이트: [http-server](https://github.com/nodeapps/http-server)

