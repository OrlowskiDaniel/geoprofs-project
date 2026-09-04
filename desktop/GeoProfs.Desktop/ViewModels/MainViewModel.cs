using System.ComponentModel;
using System.Runtime.CompilerServices;
using System.Threading.Tasks;
using GeoProfs.Desktop.Services;

namespace GeoProfs.Desktop.ViewModels
{
    /// <summary>
    /// This is the "brain" behind MainWindow.xaml. The View knows nothing
    /// about HttpClient or JSON — it only binds to Message/IsError.
    /// Same layering idea as React: View -> ViewModel -> Service -> API.
    /// </summary>
    public class MainViewModel : INotifyPropertyChanged
    {
        private readonly GeoProfsApiClient _api = new();

        private string _message = "Loading...";
        public string Message
        {
            get => _message;
            set { _message = value; OnPropertyChanged(); }
        }

        private bool _isError;
        public bool IsError
        {
            get => _isError;
            set { _isError = value; OnPropertyChanged(); }
        }

        public MainViewModel()
        {
            _ = LoadHelloMessageAsync();
        }

        private async Task LoadHelloMessageAsync()
        {
            try
            {
                Message = await _api.GetHelloMessageAsync();
                IsError = false;
            }
            catch (System.Exception ex)
            {
                Message = $"Could not reach the API: {ex.Message}";
                IsError = true;
            }
        }

        public event PropertyChangedEventHandler? PropertyChanged;
        private void OnPropertyChanged([CallerMemberName] string? name = null)
            => PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(name));
    }
}
