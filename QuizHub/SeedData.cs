using Core.Entities;
using Infrastructure;

namespace QuizHub
{
    public class SeedData
    {
        public static void Initialize(ApplicationDbContext context)
        {
            // Provjeri da li već postoje kvizovi
            if (context.Quizzes.Any())
            {
                Console.WriteLine("Database already seeded.");
                return;
            }

            Console.WriteLine("Seeding database...");

            // ===== KVIZ 1: Programiranje - C# Osnove =====
            var quiz1 = new Quiz
            {
                Title = "C# Osnove",
                Description = "Osnovni koncepti C# programskog jezika",
                Category = "Programiranje",
                Difficulty = "easy",
                TimeLimit = 600 // 10 minuta
            };

            var q1 = new Question
            {
                Text = "Šta je C#?",
                QuestionType = QuestionType.SingleChoice,
                Options = new List<Option>
                {
                    new Option { Text = "Programski jezik", IsCorrect = true },
                    new Option { Text = "Baza podataka", IsCorrect = false },
                    new Option { Text = "Operativni sistem", IsCorrect = false },
                    new Option { Text = "Web browser", IsCorrect = false }
                }
            };

            var q2 = new Question
            {
                Text = "Da li je C# objektno-orijentisan jezik?",
                QuestionType = QuestionType.TrueFalse,
                Options = new List<Option>
                {
                    new Option { Text = "Tačno", IsCorrect = true },
                    new Option { Text = "Netačno", IsCorrect = false }
                }
            };

            var q3 = new Question
            {
                Text = "Koje od sledećih su tipovi podataka u C#? (Izaberi sve tačne)",
                QuestionType = QuestionType.MultipleChoice,
                Options = new List<Option>
                {
                    new Option { Text = "int", IsCorrect = true },
                    new Option { Text = "string", IsCorrect = true },
                    new Option { Text = "boolean", IsCorrect = false },
                    new Option { Text = "double", IsCorrect = true }
                }
            };

            quiz1.Questions.Add(q1);
            quiz1.Questions.Add(q2);
            quiz1.Questions.Add(q3);

            // ===== KVIZ 2: Matematika =====
            var quiz2 = new Quiz
            {
                Title = "Osnove matematike",
                Description = "Test osnovnih matematičkih operacija i koncepata",
                Category = "Matematika",
                Difficulty = "easy",
                TimeLimit = 300 // 5 minuta
            };

            var q4 = new Question
            {
                Text = "Koliko je 15 + 27?",
                QuestionType = QuestionType.SingleChoice,
                Options = new List<Option>
                {
                    new Option { Text = "42", IsCorrect = true },
                    new Option { Text = "41", IsCorrect = false },
                    new Option { Text = "43", IsCorrect = false },
                    new Option { Text = "40", IsCorrect = false }
                }
            };

            var q5 = new Question
            {
                Text = "Da li je broj 17 prost broj?",
                QuestionType = QuestionType.TrueFalse,
                Options = new List<Option>
                {
                    new Option { Text = "Tačno", IsCorrect = true },
                    new Option { Text = "Netačno", IsCorrect = false }
                }
            };

            var q6 = new Question
            {
                Text = "Koliko je 8 x 7?",
                QuestionType = QuestionType.SingleChoice,
                Options = new List<Option>
                {
                    new Option { Text = "56", IsCorrect = true },
                    new Option { Text = "54", IsCorrect = false },
                    new Option { Text = "63", IsCorrect = false },
                    new Option { Text = "48", IsCorrect = false }
                }
            };

            quiz2.Questions.Add(q4);
            quiz2.Questions.Add(q5);
            quiz2.Questions.Add(q6);

            // ===== KVIZ 3: JavaScript - Srednji nivo =====
            var quiz3 = new Quiz
            {
                Title = "JavaScript Srednji Nivo",
                Description = "Testiraj svoje znanje JavaScript-a",
                Category = "Programiranje",
                Difficulty = "medium",
                TimeLimit = 900 // 15 minuta
            };

            var q7 = new Question
            {
                Text = "Šta vraća 'typeof null' u JavaScript-u?",
                QuestionType = QuestionType.SingleChoice,
                Options = new List<Option>
                {
                    new Option { Text = "object", IsCorrect = true },
                    new Option { Text = "null", IsCorrect = false },
                    new Option { Text = "undefined", IsCorrect = false },
                    new Option { Text = "number", IsCorrect = false }
                }
            };

            var q8 = new Question
            {
                Text = "Da li JavaScript podržava arrow funkcije?",
                QuestionType = QuestionType.TrueFalse,
                Options = new List<Option>
                {
                    new Option { Text = "Tačno", IsCorrect = true },
                    new Option { Text = "Netačno", IsCorrect = false }
                }
            };

            var q9 = new Question
            {
                Text = "Koje su osobine JavaScript-a? (Izaberi sve tačne)",
                QuestionType = QuestionType.MultipleChoice,
                Options = new List<Option>
                {
                    new Option { Text = "Dinamički tipiziran", IsCorrect = true },
                    new Option { Text = "Interpreted jezik", IsCorrect = true },
                    new Option { Text = "Samo za backend", IsCorrect = false },
                    new Option { Text = "Podržava asinkroni kod", IsCorrect = true }
                }
            };

            var q10 = new Question
            {
                Text = "Šta je closure u JavaScript-u?",
                QuestionType = QuestionType.SingleChoice,
                Options = new List<Option>
                {
                    new Option { Text = "Funkcija sa pristupom spoljasnjem scope-u", IsCorrect = true },
                    new Option { Text = "Zatvorena funkcija", IsCorrect = false },
                    new Option { Text = "Tip petlje", IsCorrect = false },
                    new Option { Text = "Vrsta objekta", IsCorrect = false }
                }
            };

            quiz3.Questions.Add(q7);
            quiz3.Questions.Add(q8);
            quiz3.Questions.Add(q9);
            quiz3.Questions.Add(q10);

            // ===== KVIZ 4: Opšta kultura =====
            var quiz4 = new Quiz
            {
                Title = "Opšta Kultura - Geografija",
                Description = "Test znanja o geografiji sveta",
                Category = "Opšta Kultura",
                Difficulty = "medium",
                TimeLimit = 600 // 10 minuta
            };

            var q11 = new Question
            {
                Text = "Koji je glavni grad Francuske?",
                QuestionType = QuestionType.SingleChoice,
                Options = new List<Option>
                {
                    new Option { Text = "Pariz", IsCorrect = true },
                    new Option { Text = "London", IsCorrect = false },
                    new Option { Text = "Berlin", IsCorrect = false },
                    new Option { Text = "Madrid", IsCorrect = false }
                }
            };

            var q12 = new Question
            {
                Text = "Da li je Australija kontinent?",
                QuestionType = QuestionType.TrueFalse,
                Options = new List<Option>
                {
                    new Option { Text = "Tačno", IsCorrect = true },
                    new Option { Text = "Netačno", IsCorrect = false }
                }
            };

            var q13 = new Question
            {
                Text = "Koji okean je najveći?",
                QuestionType = QuestionType.SingleChoice,
                Options = new List<Option>
                {
                    new Option { Text = "Pacifik", IsCorrect = true },
                    new Option { Text = "Atlantik", IsCorrect = false },
                    new Option { Text = "Indijski", IsCorrect = false },
                    new Option { Text = "Arktički", IsCorrect = false }
                }
            };

            quiz4.Questions.Add(q11);
            quiz4.Questions.Add(q12);
            quiz4.Questions.Add(q13);

            // ===== KVIZ 5: Teški - Algoritmi =====
            var quiz5 = new Quiz
            {
                Title = "Algoritmi i Strukture Podataka",
                Description = "Napredni koncepti algoritama - za iskusne programere",
                Category = "Programiranje",
                Difficulty = "hard",
                TimeLimit = 1200 // 20 minuta
            };

            var q14 = new Question
            {
                Text = "Koja je vremenska složenost Binary Search algoritma?",
                QuestionType = QuestionType.SingleChoice,
                Options = new List<Option>
                {
                    new Option { Text = "O(log n)", IsCorrect = true },
                    new Option { Text = "O(n)", IsCorrect = false },
                    new Option { Text = "O(n^2)", IsCorrect = false },
                    new Option { Text = "O(1)", IsCorrect = false }
                }
            };

            var q15 = new Question
            {
                Text = "Da li je QuickSort stabilna sortirna metoda?",
                QuestionType = QuestionType.TrueFalse,
                Options = new List<Option>
                {
                    new Option { Text = "Netačno", IsCorrect = true },
                    new Option { Text = "Tačno", IsCorrect = false }
                }
            };

            var q16 = new Question
            {
                Text = "Koje strukture podataka koriste LIFO princip? (Izaberi sve tačne)",
                QuestionType = QuestionType.MultipleChoice,
                Options = new List<Option>
                {
                    new Option { Text = "Stack", IsCorrect = true },
                    new Option { Text = "Queue", IsCorrect = false },
                    new Option { Text = "Rekurzivni pozivi funkcija", IsCorrect = true },
                    new Option { Text = "LinkedList", IsCorrect = false }
                }
            };

            quiz5.Questions.Add(q14);
            quiz5.Questions.Add(q15);
            quiz5.Questions.Add(q16);

            // Dodaj sve kvizove u bazu
            context.Quizzes.Add(quiz1);
            context.Quizzes.Add(quiz2);
            context.Quizzes.Add(quiz3);
            context.Quizzes.Add(quiz4);
            context.Quizzes.Add(quiz5);

            context.SaveChanges();

            Console.WriteLine("Database seeded successfully!");
            Console.WriteLine($"- {quiz1.Title} ({quiz1.Questions.Count} pitanja)");
            Console.WriteLine($"- {quiz2.Title} ({quiz2.Questions.Count} pitanja)");
            Console.WriteLine($"- {quiz3.Title} ({quiz3.Questions.Count} pitanja)");
            Console.WriteLine($"- {quiz4.Title} ({quiz4.Questions.Count} pitanja)");
            Console.WriteLine($"- {quiz5.Title} ({quiz5.Questions.Count} pitanja)");
        }
    }
}
