using GeoProfs.Desktop.Common;
using GeoProfs.Desktop.Models;
using GeoProfs.Desktop.Services;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Collections.Specialized;
using System.ComponentModel;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using System.Windows.Input;

namespace GeoProfs.Desktop.ViewModels
{
    public class NotificationsViewModel : ViewModelBase
    {
        private readonly IGeoProfsApiClient _apiClient;
        private readonly HashSet<Notification> _observedNotifications = new();
        private readonly HashSet<int> _markingAsReadIds = new();
        private bool _isLoading;
        private string? _errorMessage;

        public ObservableCollection<Notification> Notifications { get; } = new();

        public bool IsLoading
        {
            get => _isLoading;
            private set => SetProperty(ref _isLoading, value);
        }

        public string? ErrorMessage
        {
            get => _errorMessage;
            private set => SetProperty(ref _errorMessage, value);
        }

        public bool HasUnreadNotifications => Notifications.Any(notification => notification.IsUnread);

        public ICommand LoadCommand { get; }
        public ICommand MarkAsReadCommand { get; }

        public NotificationsViewModel(IGeoProfsApiClient apiClient)
        {
            _apiClient = apiClient;
            Notifications.CollectionChanged += OnNotificationsChanged;

            LoadCommand = new RelayCommand(async _ => await LoadAsync());
            MarkAsReadCommand = new RelayCommand(async parameter => await MarkAsReadAsync(parameter as Notification));

            _ = LoadAsync();
        }

        private async Task LoadAsync()
        {
            IsLoading = true;
            ErrorMessage = null;

            try
            {
                var notifications = await _apiClient.GetManagerNotificationsAsync();
                Notifications.Clear();
                foreach (var notification in notifications)
                {
                    Notifications.Add(notification);
                }
            }
            catch (ApiException ex)
            {
                ErrorMessage = ex.Message;
            }
            catch (JsonException ex)
            {
                ErrorMessage = $"Notification response could not be read: {ex.Message}";
            }
            finally
            {
                IsLoading = false;
            }
        }

        private async Task MarkAsReadAsync(Notification? notification)
        {
            if (notification is null || !notification.IsUnread || !_markingAsReadIds.Add(notification.Id))
            {
                return;
            }

            ErrorMessage = null;
            try
            {
                var updatedNotification = await _apiClient.MarkNotificationAsReadAsync(notification.Id);
                notification.IsRead = updatedNotification.IsRead;
            }
            catch (ApiException ex)
            {
                ErrorMessage = ex.Message;
            }
            finally
            {
                _markingAsReadIds.Remove(notification.Id);
            }
        }

        private void OnNotificationsChanged(object? sender, NotifyCollectionChangedEventArgs e)
        {
            foreach (var notification in _observedNotifications.ToArray())
            {
                if (!Notifications.Contains(notification))
                {
                    notification.PropertyChanged -= OnNotificationPropertyChanged;
                    _observedNotifications.Remove(notification);
                }
            }

            foreach (var notification in Notifications)
            {
                if (_observedNotifications.Add(notification))
                {
                    notification.PropertyChanged += OnNotificationPropertyChanged;
                }
            }

            OnPropertyChanged(nameof(HasUnreadNotifications));
        }

        private void OnNotificationPropertyChanged(object? sender, PropertyChangedEventArgs e)
        {
            if (e.PropertyName is nameof(Notification.IsRead) or nameof(Notification.IsUnread))
            {
                OnPropertyChanged(nameof(HasUnreadNotifications));
            }
        }
    }
}
