using System.Windows.Input;
using GeoProfs.Desktop.Common;
using GeoProfs.Desktop.Services;

namespace GeoProfs.Desktop.ViewModels
{
    public class MainViewModel : ViewModelBase
    {
        private readonly IGeoProfsApiClient _apiClient;

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
                // Future sections go here:
                // case "Overview": CurrentView = new OverviewViewModel(_apiClient); break;
                default:
                    CurrentView = null; // Shows placeholder text in MainWindow for unbuilt views
                    break;
            }
        }
    }
}