function shuffleArr(arr)
{
	for (var i = arr.length - 1; i >= 0; i--)
	{
		var j = Math.floor(Math.random() * (i+1));
		var tmp = arr[i];
		arr[i] = arr[j];
		arr[j] = tmp;
	}
}
$(document).on("ready",function(){
	var timer;
	var timerStarted = false;
	var game = {
		gameTime: 30,//total time per question in seconds
		answerTime: 3,//waiting time after answer a question in seconds
		timeLeft: 30,//total time left in seconds
		correctAnswers : 0,
		incorrectAnswers : 0,
		questionsLeft: [],
		answersLeft: [],
		gameStarted: false,
		questions : [
			{
				qid: 0,
				question: "Who is the mascot of the university of Texas?",
				answers: [{a:"Reveille",isCorrect:false,id:0},{a:"Bevo",isCorrect:true,id:1},{a:"Sammy",isCorrect:false,id:2},{a:"Shasta",isCorrect:false,id:3}],
				pic: "assets/images/bevo.gif"
			},
			{
				qid: 1,
				question: "What is the flagship university in texas?",
				answers: [{a:"Rice",isCorrect:false,id:0},{a:"University of Houston",isCorrect:false,id:1},{a:"Texas A&M",isCorrect:false,id:2},{a:"The University of Texas at Austin",isCorrect:true,id:3}],
				pic: "assets/images/utexas.jpeg"
			},
			{
				qid: 2,
				question: "When was the last year Texas Longhorns won a national Championship?",
				answers: [{a:"2005",isCorrect:true,id:0},{a:"2009",isCorrect:false,id:1},{a:"2013",isCorrect:false,id:2},{a:"1998",isCorrect:false,id:3}],
				pic: "assets/images/utchamp.jpg"	
			},
			{
				qid: 3,
				question: "How many gold medals did University of Texas athletes earn during the 2016 Rio Olympics",
				answers: [{a:"10",isCorrect:true,id:0},{a:"2",isCorrect:false,id:1},{a:"5",isCorrect:false,id:2},{a:"8",isCorrect:false,id:3}],
				pic: "assets/images/bevoinrio.png"	
			}
		],
		start: function(){
			if( !game.gameStarted )
			{
				game.correctAnswers = 0;
				game.incorrectAnswers = 0;

				//create an array with the index of the questions
				game.questionsLeft = game.questions.map( function(element, index) {
						return index;
				});
				//shuffle the array created
				shuffleArr(game.questionsLeft);
				game.gameStarted = true;
			}
	
			game.timeLeft = game.gameTime;
			$("#timer").html( "Time Remaining: " + game.timeLeft + " Seconds" );
			
			var selectedQuestion = game.questions[game.questionsLeft[0]];
			var qid = selectedQuestion.qid;

			game.answersLeft = selectedQuestion.answers.map( function(ans, index){
				return index;
			});
			shuffleArr(game.answersLeft);
		
			$("#question").html(selectedQuestion.question);

			game.answersLeft.forEach( function(ans){
				var a = $("<li class='Trivia-ul-li' data-val='" + selectedQuestion.answers[ans].id + "' data-qid='" + qid + "'>" + selectedQuestion.answers[ans].a + "</li>");
				$("#options").append(a);
			});
			
			if( !timerStarted )
			{
				timer = setInterval(game.startTimer,1000);
				timerStarted = true;
			}

		},
		startTimer: function(){
			if(game.timeLeft>0)
			{
				game.timeLeft = game.timeLeft - 1;
				$("#timer").html( "Time Remaining: " + game.timeLeft + " Seconds" );
			}
			else
			{
				game.stopTimer();	
				game.showResult();
				game.gameStarted = false;
			}
		},
		stopTimer: function(){
			clearInterval( timer );
			timerStarted = false;
		},
		showResult: function(){
			var msg = "<p>Correct Answers: "+game.correctAnswers+"</p><p>Incorrect Answers: "+game.incorrectAnswers+"</p><p>Questions not answered: "+game.questionsLeft.length+"</p>";
			$("#timer").html(msg);
			$("#question").html("");
			$("#options").html("");
			$("form").css("display","block");
		}
	};
	
	$("#start").on("click", function(ev){
		ev.preventDefault();
		game.start();
		$("form").css("display","none");
	});

	$("body").on("click", "#options li", function(ev){
		ev.preventDefault();
		
		var id = $(this).data("val");
		var qid = parseInt($(this).data("qid"));
		var ans = game.questions[qid].answers.filter(function(a){ return a["id"] == id; });
		//stop timer
		game.stopTimer();
		
		var msg = "";
		//increase correct or incorrect counter
		var figQuery = "<img src='"+game.questions[qid].pic+"' alt='"+"'>";
		if( ans[0].isCorrect )
		{
			game.correctAnswers++;
			msg = "Correct Answer!";
			figQuery = figQuery + "<figcaption></figcaption>";
		}
		else
		{
			var correctAns = game.questions[qid].answers.filter(function(a){ return a["isCorrect"] == true; });
			game.incorrectAnswers++;
			msg = "Incorrect Answer";
			figQuery = figQuery + "<figcaption class='Trivia-fig-figcaption'>The correct answer was " + correctAns[0]["a"]+"</figcaption>";
		}
		var fig = $(figQuery);
		//show a message with the result
		$("figure").append(fig);
		$("#timer").html(msg);
		$("#question").html("");
		$("#options").html("");
		$("form").css("display","none"); 
		//Remove cleared question from questions array
		game.questionsLeft.splice(0, 1);
		//continue to the next question
		setTimeout( 
			function()
			{
				$("figure").html("");
				if(game.questionsLeft.length === 0)
				{
					//If the array is empty, that means that the user has already answered everything
					game.stopTimer();
					game.showResult();
					game.gameStarted = false;
				}
				else
				{
					//otherwise continue playing
					game.start(); 
				}
			},
			(game.answerTime*1000) 
		);
	});
});