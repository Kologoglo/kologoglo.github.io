function optclick(e) {
    // e.classList.toggle('correct');
}

function btnclick(e) {
    var qn = e.parentElement.parentElement.parentElement.parentElement.getAttribute("num");
    var on = e.parentElement.parentElement.getAttribute("o");
    // console.log(qn + " " + on);
    if (e.classList.contains('btn-t')) {
        e.classList.add('active');
        e.nextElementSibling.classList.remove('active');
        state[qn-1][on-1] = 1;
    }
    else if (e.classList.contains('btn-f')) {
        e.classList.add('active');
        e.previousElementSibling.classList.remove('active');
        state[qn-1][on-1] = 0;
    }

    // update progress
    var totalAnswered = 0;
    for (i of state) {
        for (j of i) {
            if (j == 1 || j == 0) {
                totalAnswered++;
            }
        }
    }
    // console.log(totalAnswered);
    document.getElementById("num-done").innerHTML = totalAnswered;
    var pb = document.getElementsByClassName("progress-bar")[0];
    pb.style.width = (totalAnswered / (numQuestions*numAnswers) * 100) + "%";

    document.getElementsByClassName("r-unanswered")[0].innerHTML = numQuestions*numAnswers - totalAnswered;

    var wrapper = document.getElementsByClassName("r-numbers-wrapper")[0];
    var pageNum = Math.floor((qn-1) / 24);
    var page = wrapper.getElementsByClassName("r-page")[pageNum];
    // console.log(qn - pageNum*24 - 1);
    var a = page.children[qn - pageNum*24 - 1];
    var d = a.children[0];
    var i = d.children[on-1];
    i.style.color = "var(--color-answer-select)";
}

function num_q_change(e) {
    var b = document.getElementById("start");
    if (e.checkValidity()) b.disabled = false;
    else b.disabled = true;
}

function all_q_click(e) {
    var i = document.getElementById("num-questions");
    var btn = document.getElementById("start");
    if (e.checked) {
        i.disabled = true;
        btn.disabled = false;
    }
    else {
        i.disabled = false
        num_q_change(i);
    }
}

function btnstart() {
    document.getElementsByClassName("welcome-wnd")[0].classList.remove("active");
    // setTimeout(start, 800);
    start();
}

function btncloseresults() {
    document.getElementsByClassName("result-wnd")[0].classList.remove("active");
    document.getElementsByClassName("btn-show-results")[0].classList.remove("active");
}

function btnshowresults() {
    var wnd =  document.getElementsByClassName("result-wnd")[0];
    if (wnd.classList.contains("active")) {
        wnd.classList.remove("active");
        document.getElementsByClassName("btn-show-results")[0].classList.remove("active");
    } else {
        wnd.classList.add("active");
        document.getElementsByClassName("btn-show-results")[0].classList.add("active");
    }
}

function aclick(e) {
    var num = e.innerText;
    var card = document.getElementById("container").children[num-1];
    card.scrollIntoView();
}

// function getDatabase() {
//     fetch('https://upload.wikimedia.org/wikipedia/commons/7/77/Delete_key1.jpg')
//   .then(res => res.blob()) // Gets the response and returns it as a blob
//   .then(blob => {
//     // Here's where you get access to the blob
//     // And you can use it for whatever you want
//     // Like calling ref().put(blob)

//     // Here, I use it to make an image appear on the page
//     let objectURL = URL.createObjectURL(blob);
//     // let myImage = new Image();
//     // myImage.src = objectURL;
//     // document.getElementById('myImg').appendChild(myImage)
//     console.log(blob);
//     console.log(objectURL);
// });
// }

window.onload = function() {
    // load database
    loadXMLDoc('database/database_test4.xml', parseDatabase);
    }
    
function parseDatabase(xml) {
    xmlDoc = xml.responseXML;
    xmlQuestions = xmlDoc.getElementsByTagName("questions")[0].getElementsByTagName("question");
    document.getElementsByClassName("info-num-questions")[0].innerHTML = xmlQuestions.length;
    document.getElementById("num-questions").setAttribute("max", xmlQuestions.length);
    // default value
    document.getElementById("num-questions").setAttribute("value", 45);
}

function loadXMLDoc(name, func) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        console.log("'" + name + "' retrieved");
        func(this);
      }
    };
    xmlhttp.open("GET", name, true);
    xmlhttp.send();
    console.log("retrieving '" + name + "'...");
  }

  var xmlDoc, xmlQuestions, xmlAnswers;
  var selection;
  var points = 0, corrects = 0, wrongs = 0, unanswered = 0;
  var state;
  
function start() {
  if (document.getElementById("all-questions").checked) {
      numQuestions = xmlQuestions.length;
  }
  else {
      numQuestions = document.getElementById("num-questions").value;
  }

  if (document.getElementById("all-answers").checked) {
      numAnswers = 8;
  }
  else if (document.getElementById("four-answers").checked){
      numAnswers = 4;
  } else
      numAnswers = 8;
  buildQuestions();
  document.getElementsByClassName("container")[0].classList.add("active");
  document.getElementsByClassName("status-bar")[0].classList.add("active");
  document.getElementById("num-all").innerHTML = numQuestions*numAnswers;
  document.getElementsByClassName("r-unanswered")[0].innerHTML = numQuestions*numAnswers;
}
  
  function buildQuestions() {
    selection = new Map();
    
    // select random questions
    var randomQ;
    for (var i = 0; i < numQuestions; i++) {
        do {
            randomQ = Math.floor(Math.random() * xmlQuestions.length)+1;
        }
        while (selection.has(randomQ));
        // console.log(randomQ);
        // console.log(getQuestionData(randomQ));

        var obj = {
            optList: []
        };

        // select random answers
        var randomO;
        for (var j = 0; j < numAnswers; j++) {
            do {
                randomO = Math.floor(Math.random() * 8);
            }
            while (obj.optList.includes(randomO));
            obj.optList.push(randomO);
        }

        selection.set(randomQ, obj);
    }

    // prepare the page
    buildPage();

    // prepare state
    state = [];
    for (var i = 0; i < xmlQuestions.length; i++) {
        var cell = [];
        for (var j = 0; j < numAnswers; j++) {
            cell.push(-1);
        }
        state.push(cell);
    }
  }

  function buildPage() {

    var n = 1;
    for ([key, value] of selection) {
        var q = getQuestionData(key);
        var text = q.getElementsByTagName("text")[0];

        var card = document.createElement("div");
        card.setAttribute("class", "card");
        card.setAttribute("num", n)

        var h3 = document.createElement("h3");
        h3.setAttribute("class", "q-text");
        h3.innerHTML = n + ". " + text.innerHTML;
        card.appendChild(h3);

        var ol = document.createElement("ol");
        ol.setAttribute("class", "opt-list");

        var l = 1
        for (o of value.optList) {
            var optionData = getOptionData(q, o);

            var li = document.createElement("li");
            li.setAttribute("class", "opt");
            li.setAttribute("o", l);
            li.setAttribute("onclick", "optclick(this)");

            var opt = document.createElement("span");
            opt.setAttribute("class", "opt-text");
            opt.innerHTML = String.fromCharCode('a'.charCodeAt(0)+l-1) + ") " + optionData.innerHTML;
            li.appendChild(opt);
            l++;
            // l = String.fromCharCode(l.charCodeAt(0) + 1);

            var btns = document.createElement("span");
            btns.setAttribute("class", "btn-container");
            //
            var btn_t = document.createElement("button");
            btn_t.setAttribute("class", " btn-tf btn-t");
            btn_t.setAttribute("onclick", "btnclick(this)");
            var t_i = document.createElement("i");
            t_i.setAttribute("class", "fa-solid fa-check");
            btn_t.appendChild(t_i);
            //
            var btn_f = document.createElement("button");
            btn_f.setAttribute("class", "btn-tf btn-f");
            btn_f.setAttribute("onclick", "btnclick(this)");
            var f_i = document.createElement("i");
            f_i.setAttribute("class", "fa-solid fa-xmark");
            btn_f.appendChild(f_i);
            
            btns.appendChild(btn_t);
            btns.appendChild(btn_f);

            li.appendChild(btns);

            ol.appendChild(li);
        }

        card.appendChild(ol);

        document.getElementById("container").appendChild(card);

        n++;
    }

    // refresh MathJax
    setTimeout(MathJax.typeset, 100);

    // build results window
    var wrapper = document.getElementsByClassName("r-numbers-wrapper")[0];

    var numPages = Math.ceil(numQuestions / 24);
    var lastPage = numQuestions - (numPages-1)*24;
    var counter = 1;
    for (var i = 0; i < numPages; i++) {
        var page = document.createElement("div");
        page.setAttribute("class", "r-page");

        for (var j = 0; j < ((i == numPages - 1 ? lastPage : 24)); j++) {
            var a = document.createElement("a");
            a.setAttribute("onclick", "aclick(this)");
            a.innerHTML = counter;
            counter++;
            var dots = document.createElement("div");
            dots.setAttribute("class", "r-dots");
            for (var k = 0; k < 4; k++) {
                var dot = document.createElement("i");
                dot.setAttribute("class", "fa-solid fa-circle");
                dots.appendChild(dot);
            }
            a.appendChild(dots);
            page.appendChild(a);
        }
        wrapper.appendChild(page);
    }

    // owl carousel
    $(".owl-carousel").owlCarousel({
        items: 1,
        loop: false,
        center: false,
        margin: 15,
        dots: true,
        nav: true,
        navText : ['<i class="fa fa-angle-left" aria-hidden="true"></i>','<i class="fa fa-angle-right" aria-hidden="true"></i>'],
        mouseDrag: false
    });
  }


  function checkAnswersBtn() {
    // request answers database
    loadXMLDoc('database/database_test4_answers.xml', checkAnswers);
  }

  function checkAnswers(xml) {
    xmlAnswers = xml.responseXML.getElementsByTagName("answers")[0].getElementsByTagName("ans");
    // reset variables
    points = 0;
    corrects = 0;
    wrongs = 0;
    unanswered = 0;

    var q = 0;
    var cards = document.getElementById("container").getElementsByClassName("card");
    var wrapper = document.getElementsByClassName("r-numbers-wrapper")[0];
    // iterate all cards
    for ([key, value] of selection) {
        var card_opts = cards[q].getElementsByClassName("opt");
        var pageNum = Math.floor(q / 24);
        var page = wrapper.getElementsByClassName("r-page")[pageNum];
        var a = page.children[q - pageNum*24].children[0];
        // iterate all options
        for (var i = 0; i < value.optList.length; i++) {
            // get correct answer
            var ans_correct = getAnswer(xmlAnswers, key)[value.optList[i]];
            // console.log(key + " " + value.optList[i] + " " + getAnswer(xmlAnswers, key)[value.optList[i]]);
            // var ans_correct = true; // TEMPORARY

            // get user answer
            var ans = -1;
            var btn_t = card_opts[i].getElementsByClassName("btn-t")[0];
            var btn_f = card_opts[i].getElementsByClassName("btn-f")[0];
            if (btn_t.classList.contains("active")) ans = 1;
            if (btn_f.classList.contains("active")) ans = 0;

            // find result window element
            var ie = a.children[i];

            // compare data
            if (ans == -1) unanswered++;
            else if ((ans_correct == "S" && ans == 1) || (ans_correct == "N" && ans == 0)) {
                corrects++;
                card_opts[i].style.backgroundColor = "var(--color-correct)";
                ie.style.color = "var(--color-answer-correct)";
            }
            else {
                wrongs++;
                card_opts[i].style.backgroundColor = "var(--color-wrong)";
                ie.style.color = "var(--color-answer-wrong)";
            }
        }
        q++;
    }

    // update result window
    document.getElementsByClassName("r-correct")[0].innerHTML = corrects;
    document.getElementsByClassName("r-wrong")[0].innerHTML = wrongs;
    document.getElementsByClassName("r-unanswered")[0].innerHTML = unanswered;
    document.getElementsByClassName("result-wnd")[0].classList.add("active");
    document.getElementsByClassName("btn-show-results")[0].classList.add("active");
  }


  function getQuestionData(num) {
    for (var i = 0; i < xmlQuestions.length; i++) {
        var q = xmlQuestions[i];
        if (q.getAttribute("num") == num) {
            return q;
        }
    }
    return null;
  }

  function getOptionData(question, id) {
    var options = question.getElementsByTagName("opt");
    for (var i = 0; i < options.length; i++) {
        var o = options[i];
        if (o.getAttribute("id") == id) {
            return o;
        }
    }
    return null;
  }

  function getAnswer(answersXml, num) {
    // var answers = answersXml.getElementsByTagName("ans");
    for (var i = 0; i < answersXml.length; i++) {
        if (answersXml[i].getAttribute("num") == num) {
            return answersXml[i].innerHTML.trim();
        }
    }
    return null;
  }
// function test() {
//     document.getElementsByClassName("testdiv")[0].style.animation_name = "";
//     document.getElementsByClassName("testdiv")[0].style.animation_name = "testanim";
    
//     // document.getElementsByClassName("testdiv")[0].classList.remove("active");
//     // document.getElementsByClassName("testdiv")[0].classList.add("active");
// }