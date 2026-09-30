using System.Collections.ObjectModel;
using System.Threading.Tasks;
using System.Windows.Input;
using GeoProfs.Desktop.Common;
using GeoProfs.Desktop.Models;
using GeoProfs.Desktop.Services;
using System.Windows;
using GeoProfs.Desktop.Views;

namespace GeoProfs.Desktop.ViewModels
{
    // View (ApprovalsView.xaml) -> ViewModel (this) -> Service (IGeoProfsApiClient) -> API
    public class ApprovalsViewModel : ViewModelBase
    {
        private readonly IGeoProfsApiClient _apiClient;

        public ObservableCollection<LeaveRequest> PendingApprovals { get; } = new();

        private bool _isLoading;
        public bool IsLoading
        {
            get => _isLoading;
            private set => SetProperty(ref _isLoading, value);
        }

        private string? _errorMessage;
        public string? ErrorMessage
        {
            get => _errorMessage;
            private set => SetProperty(ref _errorMessage, value);
        }

        public ICommand LoadCommand { get; }
        public ICommand ApproveCommand { get; }
        public ICommand RejectCommand { get; }

        public ApprovalsViewModel(IGeoProfsApiClient apiClient)
        {
            _apiClient = apiClient;

            LoadCommand = new RelayCommand(async _ => await LoadAsync());

            // load as soon as the view opens
            _ = LoadAsync();
        }

        private async Task LoadAsync()
        {
            IsLoading = true;
            ErrorMessage = null;
            try
            {
                var requests = await _apiClient.GetPendingApprovalsAsync();
                PendingApprovals.Clear();
                foreach (var request in requests)
                    PendingApprovals.Add(request);
            }
            catch (ApiException ex)
            {
                ErrorMessage = ex.Message;
            }
            finally
            {
                IsLoading = false;
            }
        }

    }
}
