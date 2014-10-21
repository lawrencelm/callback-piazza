(function(window, document, undefined) {

    // pane elements
    var rightPane = document.getElementById('right-pane');
    // TODO: add other panes here

    // button and input elements
    // TODO: add button/input element selectors here

    // script elements that correspond to Handlebars templates
    var questionFormTemplate = document.getElementById('question-form-template');
    // TODO: add other script elements corresponding to templates here

    // compiled Handlebars templates
    var templates = {
        renderQuestionForm: Handlebars.compile(questionFormTemplate.innerHTML)
        // TODO: add other Handlebars render functions here
    };

    /* Returns the questions stored in localStorage. */
    function getStoredQuestions() {
        if (!localStorage.questions) {
            // default to empty array
            localStorage.questions = JSON.stringify([]);
        }

        return JSON.parse(localStorage.questions);
    }

    /* Store the given questions array in localStorage.
     *
     * Arguments:
     * questions -- the questions array to store in localStorage
     */
    function storeQuestions(questions) {
        localStorage.questions = JSON.stringify(questions);
    }

    // TODO: tasks 1-5 and one extension

    // display question form initially
    rightPane.innerHTML = templates.renderQuestionForm();

    // TODO: display question list initially (if there are existing questions)

})(this, this.document);
