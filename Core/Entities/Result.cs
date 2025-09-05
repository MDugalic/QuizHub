using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Entities
{
    public class Result
    {
        public int Id { get; set; }

        // FK ka User
        public int UserId { get; set; }
        public User User { get; set; }

        // FK ka Quiz
        public int QuizId { get; set; }
        public Quiz Quiz { get; set; }

        public int CorrectAnswers { get; set; }
        public int TotalQuestions { get; set; }   // plural
        public double Percentage { get; set; }
        public DateTime DateTaken { get; set; }
        public TimeSpan Duration { get; set; }
    }
}
