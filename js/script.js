(function(window, document, undefined) {

    // pane elements
    var rightPane = document.getElementById('right-pane');
    var leftPane = document.getElementById('left-pane');
    var interactors = document.getElementById('interactors');
    var responseForm = document.getElementById('response-form');

    var expandedID;
    // TODO: add other panes here

    // button and input elements
    // TODO: add button/input element selectors here

    // script elements that correspond to Handlebars templates
    var questionFormTemplate = document.getElementById('question-form-template');
    var questionsTemplate = document.getElementById('questions-template');
    var expandedQuestionTemplate = document.getElementById('expanded-question-template');
    var usedIDs = new Set();
    if(questionsTemplate === null) console.log("bad");
    // TODO: add other script elements corresponding to templates here

    // compiled Handlebars templates
    var templates = {
        renderQuestionForm: Handlebars.compile(questionFormTemplate.innerHTML),
        renderQuestion: Handlebars.compile(questionsTemplate.innerHTML),
        renderExpandedQuestion: Handlebars.compile(expandedQuestionTemplate.innerHTML)
        // TODO: add other Handlebars render functions here
    };

    rightPane.innerHTML = templates.renderQuestionForm();
    
    if(localStorage.questions) {
    var allQuestions = getStoredQuestions();//JSON.parse(localStorage.questions);
    for(var i = 0; i < allQuestions.length ; i++) {
        if(allQuestions[i]){
        leftPane.innerHTML += templates.renderQuestion({
                questions: [
                    {"question": allQuestions[i]["question"],
                    "subject": allQuestions[i]["subject"],
                    "id": allQuestions[i]["id"]
                    }
                ]
            });
        }
    }
}

    /* Returns the questions stored in localStorage. */
    function getStoredQuestions() {
        if (!localStorage.questions) {
            // default to empty array
            console.log("local storage is empty /:");
            localStorage.questions = JSON.stringify([]);
        }
        console.log(JSON.parse(localStorage.questions), "returned!");
        return JSON.parse(localStorage.questions);
    }

    /*function getQuestionMap() {
        var map = getMap();
        console.log(map);
        var map = {"questions": []};
        if(!localStorage.questions) {
            return map;
        }

        map["questions"] += localStorage.questions;
        console.log(map);
        return map;
    }*/

    /* Store the given questions array in localStorage.
     *
     * Arguments:
     * questions -- the questions array to store in localStorage
     */
    function storeQuestions(questions) {
        if(!localStorage.questions) {
            localStorage.questions = "[" + JSON.stringify(questions) + "]";
            //localStorage.questions = [JSON.stringify(questions)];
            //console.log("EMPTY", localStorage.questions);
        } else {
            localStorage.questions = localStorage.questions.slice(1, localStorage.questions.length);
            localStorage.questions = "[" + JSON.stringify(questions) + "," + localStorage.questions;
        }
        /*if(!localStorage.map) {
            var map = {};
            map["question"] = [{"question": questions[0], "subject": questions[1]}];
        } else {*/
        console.log(questions);
        console.log(localStorage.questions, "local sotrag");
        console.log("stored!");
        //}
    }

    function searchStoredQuestions(idSearch){
        console.log("o through ", localStorage);
        /*for(var i = 0; i < localStorage.questions.length ; i++){
            console.log("loop");
        }*/
        //var count = 0;
        var allQuestions = JSON.parse(localStorage.questions);
        console.log("all questions is ", allQuestions);
        console.log("looking for ", idSearch);
        for(var i = 0; i < allQuestions.length ; i++) {
            if(allQuestions[i] && allQuestions[i]["id"] == idSearch){
                return allQuestions[i];
            }
        }
       /* for (question in allQuestions){
            //count ++;
            //question = JSON.parse(question);
            //console.log("oin quesiton ", question);
            //console.log("looking at ", question["id"]);
            if(question.id == idSearch) {
                return question;
            }
        }*/
        return {
            "question": "error", "responses": [], "subject": "error", "id": "error"
        }
    }

    function addQuestion(form){
        var question = form.question.value;
        var subject = form.subject.value;
        if(question && subject) {
            var id = Math.random();
            while(usedIDs.has(id)) {
                id = Math.random();
            }
            console.log(form.id);
            //storing question
            storeQuestions(
                {
                    "subject": subject,
                    "question": question,
                    "id": id,
                    "responses": []
                }
            );//[subject, question]);
            //adding question to left panel
            usedIDs.add(id);
            leftPane.innerHTML = templates.renderQuestion({
                questions: [
                    {"question": question,
                    "subject": subject,
                    "id": id,
                    "responses": []
                    }
                ]
            }) + leftPane.innerHTML;
            //rightPane.innerHTML = templates.renderQuestionForm();
        } else console.log("Subject and/or question are/is empty.");
        
        //clearing quesiton form:
        form.question.value = "";
        form.subject.value = "";
    } 

    function display(id) {
        console.log("display function");
        //var question = questionObject.value;
        console.log(id, "is the display id");
        var question = searchStoredQuestions(id);//questionObject.question;
        //var responses = questionObject.responses;
        //var subject = questionObject.subject;
        console.log("quesiton is ", question);
        var subject = question["subject"];
        var questionValue = question["question"];
        var responses = question["responses"];
        console.log("results are ", questionValue, responses, subject);
        rightPane.innerHTML = templates.renderExpandedQuestion(
        {
            subject : subject,
            question : questionValue,
            responses : responses,
            id: id
        }
        );
        expandedID = id;
    }

    function removeFromStorage(index){
        var questions = getStoredQuestions();
        //questions = questions.splice(index, 1);
        //questions.remove(index);
        delete questions[index];// + 1];
        /*questions[index] = {
            "question": "error", "responses": [], "subject": "error", "id": "error"
        }*/
        for(var i = 0; i < questions.length ; i ++) {
            console.log("after removal ", questions[i]);
        }
        localStorage.questions = JSON.stringify(questions);
    }

    function addResponseForm(response) {
        console.log("THIS IS RESPONSE ", response);
        console.log("RESPONSE NAME", response.name.value);
        console.log("RESPONSEEE ", response.response.value);
        var question;
        var finalResponse = {name: response.name.value ,response: response.response.value};
       // var finalResponse = "{\"name\":\"" + response.name.value + "\",\"response\": \"" + response.response.value+"\"}";
        var allQuestions = JSON.parse(localStorage.questions);
        for(var i = 0; i < allQuestions.length; i++) {
            if(allQuestions[i] && allQuestions[i]["id"] == expandedID){
                console.log("current responses are ", allQuestions[i]["responses"]);
                allQuestions[i]["responses"].push(finalResponse);
                /*if(allQuestions[i]["responses"] == []){
                    allQuestions[i]["responses"] = "[" + finalResponse + "]";
                }
                else{
                    allQuestions[i]["responses"] = allQuestions[i]["responses"].slice(1, allQuestions[i]["responses"].length);
                    allQuestions[i]["responses"] = "[" + finalResponse + "," + allQuestions[i]["responses"];
                    
                    //allQuestions[i][responses] = ",[" + finalResponse + "]"; //might need to change repsonse
                }*/
                console.log("responses after appending are ", allQuestions[i]["responses"]);
                question = allQuestions[i];
                //localStorage.removeItem(expandedID);
                removeFromStorage(i);
                storeQuestions(question);
                break;
            }

        }

        var subject = question["subject"];//response.subject;
        var questionValue = question["question"];
        console.log("bleehhhh ", question["responses"]);
        var expandedResponses = question["responses"];
        console.log("response sin end are ", expandedResponses);
        console.log("is it array? ", expandedResponses[0]);
        console.log("is it map? ", expandedResponses[0]["name"]);
        rightPane.innerHTML = templates.renderExpandedQuestion({
            question: questionValue,
            subject: subject,
            responses: expandedResponses
        }
        );
    }
    function resolve(id) {
        console.log("resolve function");
        var index;
        var allQuestions = getStoredQuestions();
        for(var i = 0; i < allQuestions.length; i++) {
            if(allQuestions[i] && allQuestions[i]["id"] == id){
                index = i;
                break;
            }

        }
        removeFromStorage(index);
    }
    // TODO: tasks 1-5 and one extension

    // display question form initially
    //rightPane.innerHTML = templates.renderQuestionForm();
    //var question = document.getElementById('questions-template');
    //if(question === null) console.log("ahhhh");
    var questionForm = document.getElementById('question-form');
    if(questionForm === null) console.log("hmm");
    //question.addEventListener("click", function(event) {
     //   console.log("clicked!");
     //   displayQuestion(event.target);
    //});
        interactors.addEventListener("click", function(event) {
       // event.preventDefault();
        var interactorTarget = event.target;
        if(interactorTarget.className === "btn") {
            console.log("BUTTON");
            rightPane.innerHTML = templates.renderQuestionForm();
        }
    });
    leftPane.addEventListener("click", function(event) {
      // event.preventDefault();
        var place = event.target;
        while(place != leftPane){
            if(place.className === "list-question question-info"){
                display(place.id);
                break;
            }
            place = place.parentNode;
        }
        //display(event.target.id);
    });
    rightPane.addEventListener("submit", function (event) {
        var rightTarget = event.target;
        if(rightTarget.id === "question-form"){
            event.preventDefault();
            console.log("NEW AHA");
            addQuestion(event.target);
        } else if(rightTarget.id === "response-form") {
            event.preventDefault();
            addResponseForm(event.target);
        }
    } );
    rightPane.addEventListener("click", function(event){
        var clickTarget = event.target;
        if(clickTarget.className === "resolve btn"){
            console.log("RESOLVE");
            event.preventDefault();
            var id = document.getElementById('response-form').value;
            resolve(id);
        }
    });
    /*
    questionForm.addEventListener("submit", function(event) {
        event.preventDefault();
        console.log("AHA");
        addQuestion(event.target);
    });*/
    // TODO: display question list initially (if there are existing questions)

})(this, this.document);
