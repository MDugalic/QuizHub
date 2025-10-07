namespace QuizHub.DTOs
{
    public class CreateQuizDto
    {
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string Category { get; set; } = string.Empty;
        public string Difficulty { get; set; } = "easy";
        public int TimeLimit { get; set; }
        public List<CreateQuestionDto> Questions { get; set; } = new List<CreateQuestionDto>();
    }

    public class CreateQuestionDto
    {
        public string Text { get; set; } = string.Empty;
        public string QuestionType { get; set; } = "SingleChoice";
        public List<CreateOptionDto> Options { get; set; } = new List<CreateOptionDto>();
    }

    public class CreateOptionDto
    {
        public string Text { get; set; } = string.Empty;
        public bool IsCorrect { get; set; }
    }
}
