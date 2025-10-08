-- 1. Provjeri da li postoji Role kolona u Users tabeli
DESCRIBE Users;

-- 2. Ako nema Role kolone, dodaj je (pokreni samo ako je potrebno)
-- ALTER TABLE Users ADD COLUMN Role VARCHAR(50) NOT NULL DEFAULT 'User';

-- 3. Provjeri sve korisnike i njihove role
SELECT Id, Username, Email, Role, ProfileImage FROM Users;

-- 4. Promijeni postojećeg korisnika u Admin (zamijeni 'tvoj_username' sa pravim username-om)
-- UPDATE Users SET Role = 'Admin' WHERE Username = 'tvoj_username';

-- 5. Ili kreiraj direktno novog Admin korisnika (password je 'admin123' - već heširan sa BCrypt)
-- INSERT INTO Users (Username, Email, PasswordHash, Role, ProfileImage)
-- VALUES ('admin', 'admin@quizhub.com', '$2a$11$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhka', 'Admin', NULL);
