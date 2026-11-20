using System;
using System.ComponentModel;
using System.Runtime.CompilerServices;
using System.Text.Json.Serialization;

namespace GeoProfs.Desktop.Models;

class Notification : INotifyPropertyChanged
{
    private int _isRead;

    [JsonPropertyName("id")]
    public int Id { get; set; }

    [JsonPropertyName("reciver_id")]
    public int ReciverID { get; set; }

    [JsonPropertyName("leave_request_id")]
    public int LeaveRquestId { get; set; }

    [JsonPropertyName("notification_type_id")]
    public int NotificationTypeID { get; set; }

    [JsonPropertyName("message")]
    public string Message { get; set; } = string.Empty;

    [JsonPropertyName("is_read")]
    public int IsRead
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
    public bool IsUnread => IsRead == 0;

    public event PropertyChangedEventHandler? PropertyChanged;

    private void OnPropertyChanged([CallerMemberName] string? propertyName = null)
    {
        PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
    }
}
