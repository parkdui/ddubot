let micButton;
let inputField;
let submitButton;

let eg_wrap;
let eg1_button, eg2_button, eg3_button;

let explain;

let clicked = 0;
let promptNum = 0;
let prompts = [];
let answerNum = 0;
let answers = [];

let responseP;
let apiKey = "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";

//p5.speech Text to Speech 변수
let speech;
var myVoice = new p5.Speech(); // new P5.Speech object
var menuLoaded = 0;

//vid test 변수
let vid;
let playing = true;
let vidNum = 0;
let vidName = ['idle.mov', 'processing.mov', 'answer.mov'];

//fonts
let suiteFont;

//imgs
let watchFrame;

//p5.speech variable
let speechRec;
let speechStr;

function preload() {
  suiteFont = loadFont("Fonts/SUITE-Medium.otf");
  watchFrame = loadImage('Images/Watch_Frame_2.png');
}

function setup() {
  fullscreen();
  noCanvas();
  vidPlay();
  
  explain = createP('이 웹페이지에서 아동용 AI 어시스턴트 뚜벗(DDubot)의 놀이 생성 기능을 체험해볼 수 있습니다. <br> 주변에 어떤 것이 있는지, 몇 명의 친구가 있는지 입력하면 뚜벗이 기발한 놀이 아이디어를 말해줍니다.');
  explain.position(displayWidth/2-300,displayHeight*0.88)
  explain.addClass('label');
  explain.style("font-family", "SUITE-Medium.otf");
  explain.style("font-size", "12px");
  
  inputField = createInput();
  inputField.attribute('placeholder', '"안녕, 뚜벗"이라고 말하거나 입력해보세요!');
  inputField.position( displayWidth/2-300, displayHeight*0.82 );
  inputField.addClass('inputText');
  inputField.style("font-family", "SUITE-Medium.otf");
  inputField.style("font-size", "20px");
  
  micButton = createImg('Images/l_Mic_Icons.png');
  micButton.size(50,50);
  micButton.position(displayWidth/2 - inputField.width-200, inputField.y-6);
  micButton.addClass('micButton');
  micButton.mousePressed(micStart);
  
  submitButton = createImg('Images/l_Send_Icons.png');
  // submitButton.size(inputField.height,inputField.height);
  submitButton.size(50,50);
  submitButton.position(displayWidth/2 + inputField.width + 170, inputField.y-6);
  submitButton.mousePressed(askGpt);
  submitButton.addClass('submitButton');  
  
  eg_wrap = createDiv();
  // eg_wrap.position( displayWidth/2 - inputField.width-200, displayHeight*0.78 );
  eg_wrap.position( displayWidth/2-300, displayHeight*0.76 );
  eg_wrap.addClass('egButton_wrap');
  eg_wrap.id('egButton_wrap');
  
  eg1_button = createButton('미끄럼틀과 시소로 할 수 있는 놀이');
  eg1_button.addClass('egButton');
  eg1_button.parent('egButton_wrap');
  
  eg2_button = createButton('5명이 할 수 있는 재미있는 놀이');
  eg2_button.addClass('egButton');
  eg2_button.parent('egButton_wrap');
  
  eg3_button = createButton('심심해 뭐해?');
  eg3_button.addClass('egButton');
  eg3_button.parent('egButton_wrap');

  responseP = createP('');
  // loadFont("Fonts/SUITE-Medium.otf");
  // responseP.style("font-family", 'SUITE-Medium.otf');
  responseP.position(displayWidth/2-400, displayHeight*0.08);
  responseP.addClass('responseP');
}

function vidPlay() {
  // createCanvas(400, 400);
  // createCanvas(1440, 720);
  createCanvas(displayWidth, displayHeight);

  vid = createVideo(vidName[vidNum]);
  vid.size(400, 400);
  vid.loop();
  vid.hide(); // hides the html video loader
}

function draw() {
  background(0);
  let img = vid.get();
  imageMode(CENTER);
  // image(img, 1440/2, 720/2);
  // image(watchFrame, 1440/2, 720/2);
  image(img, displayWidth/2, displayHeight/2.2);
  image(watchFrame, displayWidth/2, displayHeight/2.2);
}

function micStart() {
  //changes video
  
  //<p5.speech>
  // let foo = new p5.Speech();
  speechRec = new p5.SpeechRec(gotSpeech);
  let continuous = true;
  let interimResults = false;
  speechRec.start(continuous, interimResults);
}

function gotSpeech(speech) {
  print(speech.text);
  if(speechRec.resultValue) {
    speechStr = createP(speech.text);
  }
  inputField.value(speech.text);
}

async function askGpt() {
  const prompt = "User:"+ prompts[promptNum-1]  + "뚜벗:" + answers[answerNum-1] + "User:" + inputField.value();
  
  //when you click button, input texts clear
  inputField.value('');
    
  clicked += 1;
  promptNum += 1;
  prompts.push(prompt);
  
  vidNum = 1;
  vidPlay();
  
  console.log(clicked, promptNum, answerNum);
  console.log(prompt);
  console.log(prompts);
  
    const bodyData = {
        model: "gpt-3.5-turbo",
        messages: [
            { "role": "system", "content": "You are an AI trained to create fun and engaging games for children. Users are 10-13 year-old children who go to elementary school. You are a very creative friend for kids. You can make creative play rules using places and things that where is around the children.You should say in Korean. Your name is 'DDuBot'(뚜벗), and you are talking to user very intuitive and friendly, and warmly. Also, you will be popped up via smart watch display, so your answer should be listed, simplified, around 50 words. Translate your answer to Korean so that Koarean children can understand. 존댓말이 아니라 반말을 사용합니다. 예를 들어, '안녕하세요!'가 아니라 '안녕!'으로 말합니다. If user replies you that they want to hang out, then you should ask them where they are now, and what kind of things they can see around the place.입력되는 프롬프트는 비록 '유저:'와 '뚜벗:'을 포함하여 번갈아서 나타나지만, 답변을 제공할 때에는 '뚜벗:'이라고 문장의 가장 앞에 절대 붙이지 않습니다. 예를 들어, ''유저:'안녕, 뚜벗!'라고 당신에게 입력되면, '뚜벗:'안녕!심심해?'가 아니라, '안녕! 심심해?'라고 답해야 합니다. 답변은 놀이의 규칙을 자세히 설명해야 할 때를 제외하고 2개 또는 3개의 문장으로 이루어져야 합니다. 놀이의 규칙을 자세히 설명해야 한다면, 번호를 매겨 순차적으로 설명해야 합니다. 예를 들어, '1. 가위바위보로 순서를 정해! 2. 이긴 사람이 진 사람을 지목해! 3. 진 사람에게 이긴 사람이 원하는 것을 말해!'처럼 말해야 합니다."},
            { "role": "user", "content": prompt }
        ]
  };
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
              'Authorization': 'Bearer ' + apiKey,
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(bodyData)
      });
      const data = await response.json();
      const parsedData = data.choices[0].message.content;
      responseP.html(parsedData);
  
      console.log(responseP.elt.innerText);
  console.log(answers);
  
  answerNum += 1;
  answers.push(responseP.elt.innerText);
  
      DoSpeak();
}

function DoSpeak() {
    //Chat GPT's 2nd Code edit trial
  let textToSpeak = responseP.elt.innerText; // Extract the text content of the DOM element
  myVoice.speak(textToSpeak);
  // myVoice.setRate(2);
  // myVoice.setPitch(4);
  vidNum = 2;
  vidPlay();
}
// 목소리 API 찾아보기!

