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
            ApproveCommand = new RelayCommand(async param => await ApproveAsync(param as LeaveRequest));
            RejectCommand = new RelayCommand(async param => await RejectAsync(param as LeaveRequest));

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

        private async Task ApproveAsync(LeaveRequest? request)
        {
            if (request is null) return;
            await HandleDecisionAsync(request, () => _apiClient.ApproveAsync(request.Id));
        }

        private async Task RejectAsync(LeaveRequest? request)
        {
            if (request is null) return;

            // show modal dialog to collect reason before rejecting
            try
            {
                var dlg = new RejectDialog(request);
                // center on MainWindow
                if (Application.Current?.MainWindow != null)
                    dlg.Owner = Application.Current.MainWindow;

                var result = dlg.ShowDialog();
                if (result == true)
                {
                    // Reason is available via dlg.Reason
                    await HandleDecisionAsync(request, () => _apiClient.RejectAsync(request.Id));
                }
            }
            catch (System.Exception ex)
            {
                // errors via ErrorMessage
                ErrorMessage = ex.Message;
            }
        }

        // shared by Approve/Reject: call the API, then drop the row from the
        // pending list on success
        private async Task HandleDecisionAsync(LeaveRequest request, System.Func<Task> action)
        {
            ErrorMessage = null;
            try
            {
                await action();
                PendingApprovals.Remove(request);
            }
            catch (ApiException ex)
            {
                ErrorMessage = ex.Message;
            }
        }
    }
}
