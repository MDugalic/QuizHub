namespace QuizHub.DTOs
{
    public class UpdateQuizDto
    {
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string Category { get; set; } = string.Empty;
        public string Difficulty { get; set; } = "easy";
        public int TimeLimit { get; set; }
    }
}
