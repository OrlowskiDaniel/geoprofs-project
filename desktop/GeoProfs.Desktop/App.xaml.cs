using GeoProfs.Desktop.Services;
using GeoProfs.Desktop.ViewModels;
using GeoProfs.Desktop.Views;
using System.Windows;

namespace GeoProfs.Desktop
{
    public partial class App : Application
    {
        protected override void OnStartup(StartupEventArgs e)
        {
            base.OnStartup(e);

            ShutdownMode = ShutdownMode.OnExplicitShutdown;

            // Change this line to use mock api: IGeoProfsApiClient apiClient = new MockGeoProfsApiClient();
            // Instantiate single real API client instance
            IGeoProfsApiClient apiClient = new GeoProfsApiClient();

            // Inject API client into LoginViewModel
            var loginWindowModel = new LoginViewModel(apiClient);

            var loginWindow = new LoginWindow
            {
                DataContext = loginWindowModel
            };

            bool? loginResult = loginWindow.ShowDialog();

            // Login failed or canceled
            if (loginResult != true)
            {
                Shutdown();
                return;
            }

            // Login successful pass same instance to MainViewModel
            var mainViewModel = new MainViewModel(apiClient);
            var mainWindow = new MainWindow
            {
                DataContext = mainViewModel
            };

            MainWindow = mainWindow;
            ShutdownMode = ShutdownMode.OnLastWindowClose;

            mainWindow.Show();
        }
    }
}