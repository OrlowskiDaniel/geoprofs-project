using System;
using System.ComponentModel;
using System.Runtime.CompilerServices;
using System.Text.Json.Serialization;

namespace GeoProfs.Desktop.Models
{
    public class LeaveRequest : INotifyPropertyChanged
    {
        public int Id { get; set; }

        [JsonPropertyName("user")]
        public LeaveRequestUser? User { get; set; }

        [JsonPropertyName("status")]
        public LeaveRequestStatus? StatusInfo { get; set; }

        [JsonPropertyName("start_date")]
        public DateTime StartDate { get; set; }

        [JsonPropertyName("end_date")]
        public DateTime EndDate { get; set; }

        public string Reason { get; set; } = string.Empty;

        [JsonPropertyName("created_at")]
        public DateTime RequestedAt { get; set; }

        [JsonPropertyName("rejection_reason")]
        public string? RejectionReason { get; set; }

        private bool _isSelected;

        [JsonIgnore]
        public bool IsSelected
        {
            get => _isSelected;
            set
            {
                if (_isSelected == value) return;
                _isSelected = value;
                OnPropertyChanged();
            }
        }

        [JsonIgnore]
        public string EmployeeName =>
            User?.Name ?? "Unknown employee";

        [JsonIgnore]
        public string Status =>
            StatusInfo?.Name ?? "Unknown";

        public event PropertyChangedEventHandler? PropertyChanged;

        protected void OnPropertyChanged(
            [CallerMemberName] string? propertyName = null)
        {
            PropertyChanged?.Invoke(
                this,
                new PropertyChangedEventArgs(propertyName)
            );
        }
    }

    public class LeaveRequestUser
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public string? Email { get; set; }
    }

    public class LeaveRequestStatus
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;
    }
}
