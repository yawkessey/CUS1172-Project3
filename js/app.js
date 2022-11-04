let correctAnswered = 0;
let questionsShown = 0;

const questions = [
  {
    questionType: "true_false",
    questionText: "The earth is round",
    correctAnswer: "true",
    options: ["true", "false"],
  },
  {
    questionType: "text_input",
    questionText: "What is the value of the expression 1+1",
    correctAnswer: "2",
    answerFieldId: "answer_to_question",
  },

];

// appState, keep information about the State of the application.
const appState = {
  current_view: "#intro_view",
  current_question: -1,
  current_model: {},
};

//
// start_app: begin the applications.
//

document.addEventListener("DOMContentLoaded", () => {
  // Set the state
  appState.current_view = "#intro_view";
  appState.current_model = {
    action: "start_app",
  };
  update_view(appState);

  //
  // EventDelegation - handle all events of the widget
  //

  document.querySelector("#widget_view").onclick = (e) => {
    handle_widget_event(e);
  };
});

function handle_widget_event(e) {

  // Get the action from the element that was clicked.
  // Need one for multiple choice
  if (appState.current_view == "#intro_view") {
    if (e.target.dataset.action == "start_app") {
      // Update State (current model + state variables)
      // Index of the current question
      appState.current_question = 0;
      appState.current_model = questions[appState.current_question];
      // process the appState, based on question type update appState.current_view
      setQuestionView(appState);

      // Now that the state is updated, update the view.

      update_view(appState);
    }
  }

  // Handle the answer event.
  if (appState.current_view == "#question_view_true_false") {
    if (e.target.dataset.action == "answer") {
      // Controller - implement logic.
      isCorrect = check_user_response(
        e.target.dataset.answer,
        appState.current_model
      );

      // Update the state.
      appState.current_question = appState.current_question + 1;
      appState.current_model = questions[appState.current_question];
      setQuestionView(appState);

      // Update the view.
      update_view(appState);
    }
  }

  // Handle answer event for  text questions.
  if (appState.current_view == "#question_view_text_input") {
    if (e.target.dataset.action == "submit") {
      user_response = document.querySelector(
        `#${appState.current_model.answerFieldId}`
      ).value;
      isCorrect = check_user_response(
        e.target.dataset.answer,
        appState.current_model
      );
      updateQuestion(appState);
      //appState.current_question =   appState.current_question + 1;
      //appState.current_model = questions[appState.current_question];
      setQuestionView(appState);
      update_view(appState);
    }
  }

  // Handle answer event for  text questions.
  if (appState.current_view == "#end_view") {
    if (e.target.dataset.action == "start_again") {
      appState.current_view = "#intro_view";
      appState.current_model = {
        action: "start_app",
      };
      update_view(appState);
    }
  }
} // end of hadnle_widget_event

function check_user_response(user_answer, model) {
  if (user_answer == model.correctAnswer) {
    return true;
  }
  return false;
}

function updateQuestion(appState) {
  if (appState.current_question < questions.length - 1) {
    appState.current_question = appState.current_question + 1;
    appState.current_model = questions[appState.current_question];
  } else {
    appState.current_question = -2;
    appState.current_model = {};
  }
}

function setQuestionView(appState) {
  if (appState.current_question == -2) {
    appState.current_view = "#end_view";
    return;
  }

  if (appState.current_model.questionType == "true_false")
    appState.current_view = "#question_view_true_false";
  else if (appState.current_model.questionType == "text_input") {
    appState.current_view = "#question_view_text_input";
  }
}

function update_view(appState) {
  const html_element = render_widget(
    appState.current_model,
    appState.current_view
  );
  document.querySelector("#widget_view").innerHTML = html_element;
}
//

const render_widget = (model, view) => {
  // Get the template HTML
  template_source = document.querySelector(view).innerHTML;
  // Handlebars compiles the above source into a template
  var template = Handlebars.compile(template_source);

  // apply the model to the template.
  var html_widget_element = template({ ...model, ...appState });

  return html_widget_element;
};
