using GeoProfs.Desktop.Common;
using GeoProfs.Desktop.Models;
using GeoProfs.Desktop.Services;
using System.Windows.Input;

namespace GeoProfs.Desktop.ViewModels
{
    public class MainViewModel : ViewModelBase
    {
        private readonly IGeoProfsApiClient _apiClient;

        private readonly PlanningSettings _planningSettings;
        public NotificationsViewModel NotificationState { get; }

        private object? _currentView;
        public object? CurrentView
        {
            get => _currentView;
            set => SetProperty(ref _currentView, value);
        }

        private string _activeSection = "Requests";
        public string ActiveSection
        {
            get => _activeSection;
            set => SetProperty(ref _activeSection, value);
        }

        
        public ICommand NavigateCommand { get; }

        public MainViewModel(IGeoProfsApiClient apiClient)
        {
            _apiClient = apiClient;

            _planningSettings = new PlanningSettings();
            NotificationState = new NotificationsViewModel(_apiClient);

            // Pass the parameter (obj) directly to the Navigate method
            NavigateCommand = new RelayCommand(obj => Navigate(obj as string));

            // Default startup view
            Navigate("Requests");
        }

        private void Navigate(string? section)
        {
            if (string.IsNullOrEmpty(section)) return;

            ActiveSection = section;

            switch (section)
            {
                case "Requests":
                    CurrentView = new ApprovalsViewModel(_apiClient);
                    break;
                case "Planning":
                    CurrentView = new CalendarViewModel(_planningSettings, _apiClient);
                    break;
                case "Notifications":
                    CurrentView = NotificationState;
                    NotificationState.LoadCommand.Execute(null);
                    break;

                case "Settings":
                    CurrentView = new SettingsViewModel(_planningSettings);
                    break;
                // Future sections go here:
                // case "Overview": CurrentView = new OverviewViewModel(_apiClient); break;
                default:
                    CurrentView = null; // Shows placeholder text in MainWindow for unbuilt views
                    break;
            }
        }
    }
}