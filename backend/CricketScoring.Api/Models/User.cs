using Google.Cloud.Firestore;

namespace CricketScoring.Api.Models
{
    [FirestoreData]
    public class User
    {
        [FirestoreDocumentId]
        public string? Id { get; set; }

        [FirestoreProperty("username")]
        public string? Username { get; set; }

        [FirestoreProperty("email")]
        public string? Email { get; set; }

        [FirestoreProperty("passwordHash")]
        public byte[]? PasswordHash { get; set; }

        [FirestoreProperty("passwordSalt")]
        public byte[]? PasswordSalt { get; set; }
    }
}