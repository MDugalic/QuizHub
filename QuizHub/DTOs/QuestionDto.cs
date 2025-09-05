namespace QuizHub.DTOs
{
    public class QuestionDto
    {
        public int Id { get; set; }
        public string Text { get; set; } = string.Empty;

        public string QuestionType { get; set; } = string.Empty;

        public List<OptionDto> Options { get; set; } = new List<OptionDto>();
    }

    public class OptionDto
    {
        public int Id { get; set; }
        public string Text { get; set; } = string.Empty;
    }
}
