using Infrastructure;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuizHub.DTOs;

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
        public async Task<IActionResult> GetQuizzes([FromQuery] string? category,  [FromQuery] string? difficulty, [FromQuery] string? search)
        {
            var query = _context.Quizzes.AsQueryable();

            if(!string.IsNullOrEmpty(category))
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
    }
}
