using Core.Entities;
using Infrastructure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuizHub.DTOs;
using System.Security.Claims;

namespace QuizHub.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuizController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public QuizController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetQuizzes([FromQuery] string? category, [FromQuery] string? difficulty, [FromQuery] string? search)
        {
            var query = _context.Quizzes.AsQueryable();

            if (!string.IsNullOrEmpty(category))
            {
                query = query.Where(c => c.Category == category);
            }

            if (!string.IsNullOrEmpty(difficulty))
            {
                query = query.Where(c => c.Difficulty == difficulty);
            }

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(c => c.Title.Contains(search) || c.Description.Contains(search));
            }
            var quizzes = await query.ToListAsync();

            return Ok(quizzes);
        }

        [HttpGet("{id}/start")]
        public async Task<IActionResult> StartQuizz(int id)
        {
            var quiz = await _context.Quizzes
        .Include(q => q.Questions)
            .ThenInclude(q => q.Options)
        .FirstOrDefaultAsync(q => q.Id == id);

            if (quiz == null)
                return NotFound("Quiz not found");

            var questions = quiz.Questions.Select(q => new QuestionDto
            {
                Id = q.Id,
                Text = q.Text,
                QuestionType = q.QuestionType.ToString(),
                Options = q.Options.Select(o => new OptionDto
                {
                    Id = o.Id,
                    Text = o.Text
                }).ToList()
            }).ToList();

            return Ok(new
            {
                quiz.Id,
                quiz.Title,
                quiz.Description,
                quiz.TimeLimit,
                Questions = questions
            });

        }
        [Authorize]
        [HttpPost("{id}/submit")]
        public async Task<IActionResult> SubmitQuiz(int id, [FromBody] QuizSubmitDto submission)
        {
            var quiz = await _context.Quizzes
                .Include(q => q.Questions)
                    .ThenInclude(q => q.Options)
                .FirstOrDefaultAsync(q => q.Id == id);

            if (quiz == null)
                return NotFound("Quiz not found");

            int totalQuestions = quiz.Questions.Count;
            int correctAnswers = 0;

            foreach (var answer in submission.Answers)
            {
                var question = quiz.Questions.FirstOrDefault(q => q.Id == answer.QuestionId);
                if (question == null) continue;

                var correctOptionIds = question.Options
                    .Where(o => o.IsCorrect)
                    .Select(o => o.Id)
                    .ToList();

                if (!correctOptionIds.Except(answer.SelectedOptionIds).Any() &&
                    !answer.SelectedOptionIds.Except(correctOptionIds).Any())
                {
                    correctAnswers++;
                }
            }

            double percentage = totalQuestions > 0
                ? (double)correctAnswers / totalQuestions * 100
                : 0;

            // 🔑 izvlačenje userId iz tokena
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                return Unauthorized("User not found in token");

            int userId = int.Parse(userIdClaim.Value);

            // ✅ Sačuvaj rezultat u bazu
            var result = new Result
            {
                UserId = userId,
                QuizId = quiz.Id,
                CorrectAnswers = correctAnswers,
                TotalQuestions = totalQuestions,
                Percentage = percentage,
                DateTaken = DateTime.UtcNow,
                Duration = TimeSpan.FromMinutes(quiz.TimeLimit / 60)
            };

            _context.Results.Add(result);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                result.Id,
                result.QuizId,
                result.UserId,
                result.CorrectAnswers,
                result.TotalQuestions,
                result.Percentage,
                result.DateTaken
            });
        }
    }
}
