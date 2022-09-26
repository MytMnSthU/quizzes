$(function () {
   (async function () {
      const api_url = "https://the-trivia-api.com/api/questions";

      let quizzes = [];
      let c = 0; // to move next quiz
      let scores = 0;
      let correctAnswer = "";

      let difficulties = {
         easy: "text-success",
         medium: "text-warning",
         hard: "text-danger",
      };

      let getQuiz = async function (url) {
         return await $.ajax({
            type: "GET",
            url: url,
            dataType: "json",
         });
      };

      let setQuiz = async function (url) {
         let data = await getQuiz(url);
         quizzes = [...data];
      };

      await setQuiz(api_url);

      console.log(quizzes);

      let createQuiz = function (quizNum) {
         let quizAnswers = [];
         let quiz = quizzes[quizNum];
         let randNum = Math.floor(Math.random() * 3); // to mix correct answer

         correctAnswer = quiz.correctAnswer; // to check answer
         quizAnswers = [...quiz.incorrectAnswers];
         quizAnswers.splice(randNum, 0, correctAnswer);

         // $("#main").html("");
         $("#main").html(
            `
         <div class="container  quiz">

            <div class="col-md-7 mx-auto my-1 my-sm-5 p-4  quiz__inner">
                <!-- Start Question -->
                <div class="quiz__header">
                    <div class="d-flex flex-column-reverse flex-sm-row justify-content-between gap-2 gap-sm-5">
                        <div>
                           <small class="fw-bold d-inline-block pb-1">${
                              quiz.category
                           }</small>
                           <h4 class="fs-5">${quiz.question}</h4>
                        </div>
                        <div class="d-flex d-sm-block gap-3 align-items-end">
                           <div><span id="current">${c + 1}</span>/10</div>
                           <small class="text-capitalize fw-bold ${difficulties[quiz.difficulty]}">${
                              quiz.difficulty
                           }</small>
                        </div>
                    </div>
                </div>
                <!-- End Question -->

                <!-- Start Answers -->
                <div class="mt-4  quiz__body">
                    <ul id="list" class="list-unstyled">


                        ${quizAnswers
                           .map(
                              (ans, idx) =>
                                 `
                                 <li class="my-3 d-flex gap-2 align-items-center btn btn-outline-dark">
                                    <input type="radio" name="ans" id="ans${idx}" class="form-check-input visually-hidden  quiz__check" />
                                    <label for="ans${idx}" class=" w-100 p-2">${ans}</label>
                                 </li>
                              `
                           )
                           .join(" ")}
                        
                        
                    </ul>
                </div>
                <!-- End Answers -->

                <!-- Start btns -->
                <div class="quiz__footer">
                    <button type="button" id="ctnBtn" class="btn btn-lg btn-dark mt-3 float-end">Continue</button>
                </div>
                <!-- End btns -->
            </div>

        </div>
         `
         );
      };

      createQuiz(0);

      let showResult = function () {
         $("#main").html(`
            <div class="container">
               <div class="col-md-4 mx-auto text-center py-5 px-3 py-sm-1">
                  <img src="https://dashboard.doj.gov.in/eodb/images/trophy.gif" class="img-fluid" />
                  <h2 class="fs-4 fw-bold">Congrats</h2>
                  <h1 class="fs1 fw-bold text-success">${(scores/10)*100}% Score</h1>
                  <h4 class="fs-6 fw-normal">Quiz completed successfully</h4>
                  <div class="d-grid">
                     <button type="button" id="agnbtn" class="btn btn-dark btn-lg mt-3">Let's do it again</button>
                  </div>
               </div>
            </div>
         `);
      };

      $(document).on("click", ".quiz__check", function () {
         $(".quiz__check")
            .parent()
            .each(function (idx, val) {
               $(val).removeClass("active");
            });
         $(this).parent().addClass("active");
      });

      $(document).on("click", "#ctnBtn", function () {
         // console.log(this);
         if (c < 9) {
            c += 1;
            console.log(c);

            let selectedAnswer = $(".quiz__check:checked").siblings(0).text();
            if (correctAnswer === selectedAnswer) scores += 1;

            console.log(correctAnswer);
            console.log(selectedAnswer);

            createQuiz(c);
         } else {
            showResult();
         }
      });

      $(document).on("click", "#agnbtn", async function () {  
         await setQuiz(api_url);
         c = 0;
         scores = 0;

         createQuiz(c);
      });
   })();
});
