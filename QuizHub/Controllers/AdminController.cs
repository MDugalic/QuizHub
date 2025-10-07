using Core.Entities;
using Infrastructure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuizHub.DTOs;

namespace QuizHub.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AdminController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/admin/quizzes
        [HttpGet("quizzes")]
        public async Task<IActionResult> GetAllQuizzes()
        {
            var quizzes = await _context.Quizzes
                .Include(q => q.Questions)
                .ThenInclude(q => q.Options)
                .ToListAsync();

            return Ok(quizzes);
        }

        // GET: api/admin/quizzes/5
        [HttpGet("quizzes/{id}")]
        public async Task<IActionResult> GetQuizById(int id)
        {
            var quiz = await _context.Quizzes
                .Include(q => q.Questions)
                .ThenInclude(q => q.Options)
                .FirstOrDefaultAsync(q => q.Id == id);

            if (quiz == null)
                return NotFound("Quiz not found");

            return Ok(quiz);
        }

        // POST: api/admin/quizzes
        [HttpPost("quizzes")]
        public async Task<IActionResult> CreateQuiz([FromBody] CreateQuizDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Title))
                return BadRequest("Title is required");

            var quiz = new Quiz
            {
                Title = dto.Title,
                Description = dto.Description,
                Category = dto.Category,
                Difficulty = dto.Difficulty,
                TimeLimit = dto.TimeLimit
            };

            // Dodaj pitanja
            foreach (var questionDto in dto.Questions)
            {
                if (!Enum.TryParse<QuestionType>(questionDto.QuestionType, out var questionType))
                    return BadRequest($"Invalid question type: {questionDto.QuestionType}");

                var question = new Question
                {
                    Text = questionDto.Text,
                    QuestionType = questionType
                };

                // Dodaj opcije
                foreach (var optionDto in questionDto.Options)
                {
                    question.Options.Add(new Option
                    {
                        Text = optionDto.Text,
                        IsCorrect = optionDto.IsCorrect
                    });
                }

                quiz.Questions.Add(question);
            }

            _context.Quizzes.Add(quiz);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetQuizById), new { id = quiz.Id }, quiz);
        }

        // PUT: api/admin/quizzes/5
        [HttpPut("quizzes/{id}")]
        public async Task<IActionResult> UpdateQuiz(int id, [FromBody] UpdateQuizDto dto)
        {
            var quiz = await _context.Quizzes.FindAsync(id);
            if (quiz == null)
                return NotFound("Quiz not found");

            quiz.Title = dto.Title;
            quiz.Description = dto.Description;
            quiz.Category = dto.Category;
            quiz.Difficulty = dto.Difficulty;
            quiz.TimeLimit = dto.TimeLimit;

            await _context.SaveChangesAsync();

            return Ok(quiz);
        }

        // DELETE: api/admin/quizzes/5
        [HttpDelete("quizzes/{id}")]
        public async Task<IActionResult> DeleteQuiz(int id)
        {
            var quiz = await _context.Quizzes
                .Include(q => q.Questions)
                .ThenInclude(q => q.Options)
                .FirstOrDefaultAsync(q => q.Id == id);

            if (quiz == null)
                return NotFound("Quiz not found");

            _context.Quizzes.Remove(quiz);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // POST: api/admin/quizzes/5/questions
        [HttpPost("quizzes/{quizId}/questions")]
        public async Task<IActionResult> AddQuestion(int quizId, [FromBody] CreateQuestionDto dto)
        {
            var quiz = await _context.Quizzes.FindAsync(quizId);
            if (quiz == null)
                return NotFound("Quiz not found");

            if (!Enum.TryParse<QuestionType>(dto.QuestionType, out var questionType))
                return BadRequest($"Invalid question type: {dto.QuestionType}");

            var question = new Question
            {
                Text = dto.Text,
                QuestionType = questionType,
                QuizId = quizId
            };

            foreach (var optionDto in dto.Options)
            {
                question.Options.Add(new Option
                {
                    Text = optionDto.Text,
                    IsCorrect = optionDto.IsCorrect
                });
            }

            _context.Questions.Add(question);
            await _context.SaveChangesAsync();

            return Ok(question);
        }

        // DELETE: api/admin/questions/5
        [HttpDelete("questions/{id}")]
        public async Task<IActionResult> DeleteQuestion(int id)
        {
            var question = await _context.Questions
                .Include(q => q.Options)
                .FirstOrDefaultAsync(q => q.Id == id);

            if (question == null)
                return NotFound("Question not found");

            _context.Questions.Remove(question);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // GET: api/admin/stats
        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            var totalUsers = await _context.Users.CountAsync();
            var totalQuizzes = await _context.Quizzes.CountAsync();
            var totalResults = await _context.Results.CountAsync();

            return Ok(new
            {
                totalUsers,
                totalQuizzes,
                totalResults
            });
        }
    }
}
