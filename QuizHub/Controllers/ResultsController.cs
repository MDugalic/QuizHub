using Core.Entities;
using Infrastructure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuizHub.DTOs;
using System.Security.Claims;

namespace QuizHub.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ResultsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ResultsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("my")]
        public async Task<IActionResult> GetMyResults()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                return Unauthorized("User not found in token");

            int userId = int.Parse(userIdClaim.Value);

            var results = await _context.Results
                .Include(r => r.Quiz)
                .Where(r => r.UserId == userId)
                .OrderByDescending(r => r.DateTaken)
                .Select(r => new ResultDto
                {
                    Id = r.Id,
                    QuizId = r.QuizId,
                    QuizTitle = r.Quiz.Title,
                    CorrectAnswers = r.CorrectAnswers,
                    TotalQuestions = r.TotalQuestions,
                    Percentage = r.Percentage,
                    DateTaken = r.DateTaken
                })
                .ToListAsync();

            return Ok(results);
        }
    }
}
