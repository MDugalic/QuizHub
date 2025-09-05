namespace QuizHub.DTOs
{
    
        public class QuizSubmitDto
        { 
            public int QuizId { get; set; }
            public List<AnswerDto> Answers { get; set; }
        }

        public class AnswerDto
        {
            public int QuestionId { get; set; }
            public List<int> SelectedOptionIds { get; set; }
        }
    
}
