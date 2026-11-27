using GeoProfs.Desktop.Common;
using System;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace GeoProfs.Desktop.Models
{

    public class Notification : ViewModelBase
    {
        private bool _isRead;

        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("receiver_id")]
        public int ReceiverId { get; set; }

        [JsonPropertyName("leave_request_id")]
        public int LeaveRequestId { get; set; }

        [JsonPropertyName("notification_type_id")]
        public int NotificationTypeId { get; set; }

        [JsonPropertyName("message")]
        public string Message { get; set; } = string.Empty;

        [JsonPropertyName("is_read")]
        [JsonConverter(typeof(BooleanOrIntegerJsonConverter))]
        public bool IsRead
        {
            get => _isRead;
            set
            {
                if (_isRead == value)
                {
                    return;
                }

                _isRead = value;
                OnPropertyChanged();
                OnPropertyChanged(nameof(IsUnread));
            }
        }

        [JsonPropertyName("created_at")]
        public DateTime? CreatedAt { get; set; }

        [JsonPropertyName("updated_at")]
        public DateTime? UpdatedAt { get; set; }

        [JsonIgnore]
        public bool IsUnread => !IsRead;

        public sealed class BooleanOrIntegerJsonConverter : JsonConverter<bool>
        {
            public override bool Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
            {
                if (reader.TokenType == JsonTokenType.True)
                {
                    return true;
                }

                if (reader.TokenType == JsonTokenType.False)
                {
                    return false;
                }

                if (reader.TokenType == JsonTokenType.Number && reader.TryGetInt32(out var value) && value is 0 or 1)
                {
                    return value == 1;
                }

                throw new JsonException("The is_read value must be a boolean or 0/1 integer.");
            }

            public override void Write(Utf8JsonWriter writer, bool value, JsonSerializerOptions options)
            {
                writer.WriteBooleanValue(value);
            }
        }

    }

}