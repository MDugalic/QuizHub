using Microsoft.VisualBasic.FileIO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Entities
{
    public class Question
    {
        public int Id { get; set; }
        public string Text { get; set; } = string.Empty;
        public QuestionType QuestionType { get; set; }

        // FK ka Quiz
        public int QuizId { get; set; }
        public Quiz Quiz { get; set; }

        // Relacija sa opcijama
        public ICollection<Option> Options { get; set; } = new List<Option>();
    }
    
}
